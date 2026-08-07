/**
 * Sculptform → JMHS Submissions Import (spec §2.11).
 *
 * Sculptform exports the writing competition results as a spreadsheet.
 * At the moment we ingest that spreadsheet, we split each row into two
 * separate table writes:
 *   - submission_manuscripts  (title, content, category, submitted_at)   — no identity
 *   - submission_identities   (name, email, phone, country/state, occupation, consent)
 * joined only by an opaque internal UUID that judges never see.
 *
 * This function does the split. It never returns identity data to the
 * caller — only the counts + a per-row status list.
 */

import * as XLSX from "xlsx";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db/client";

export type ImportResult = {
  importId: string;
  rowCount: number;
  createdCount: number;
  duplicateCount: number;
  errorCount: number;
  flaggedCount: number;
  rows: RowStatus[];
};

export type RowStatus = {
  rowIndex: number;
  status: "created" | "duplicate" | "error" | "flagged";
  reason?: string;
  title?: string;
  category?: string;
  // Deliberately NO identity fields returned. Judges shouldn't see them,
  // and neither should anyone using this function's output.
};

const CATEGORY_MAP: Record<string, (typeof schema.submissionCategoryEnum.enumValues)[number]> = {
  "poetry": "poetry",
  "poem": "poetry",
  "poems": "poetry",
  "short story": "short-story",
  "short-story": "short-story",
  "story": "short-story",
  "essay": "essay",
  "essays": "essay",
  "personal narrative": "personal-narrative",
  "personal-narrative": "personal-narrative",
  "narrative": "personal-narrative",
};

function normaliseCategory(v: unknown): (typeof schema.submissionCategoryEnum.enumValues)[number] | null {
  if (typeof v !== "string") return null;
  const key = v.trim().toLowerCase();
  return CATEGORY_MAP[key] ?? null;
}

function pick(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    for (const rk of Object.keys(row)) {
      if (rk.toLowerCase().trim() === k.toLowerCase().trim()) {
        const v = row[rk];
        if (v == null) continue;
        return String(v).trim();
      }
    }
  }
  return "";
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Parse a Sculptform export (CSV or XLSX) into normalised row objects.
 * Column names are matched case-insensitively; a few common aliases are
 * accepted so the tool doesn't break the day Sculptform renames a header.
 */
export function parseWorkbook(buf: ArrayBuffer): Record<string, unknown>[] {
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    raw: false,
  });
}

export async function ingestSubmissions(opts: {
  fileBuffer: ArrayBuffer;
  filename: string;
  themeYear: number;
  importedByUserId: string;
  notes?: string;
}): Promise<ImportResult> {
  const rows = parseWorkbook(opts.fileBuffer);
  const now = new Date();

  // Create the import log row up front so every manuscript row can point back to it.
  const [importRow] = await db
    .insert(schema.submissionImports)
    .values({
      filename: opts.filename,
      importedBy: opts.importedByUserId,
      themeYear: opts.themeYear,
      rowCount: rows.length,
      notes: opts.notes,
    })
    .returning();

  const statuses: RowStatus[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;
  let flaggedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i] ?? {};
    const rowIndex = i + 2; // spreadsheet row (accounting for header)

    const title = pick(raw, "title", "entry title", "submission title");
    const content = pick(raw, "content", "entry", "body", "submission", "text");
    const categoryRaw = pick(raw, "category", "entry category", "type");
    const category = normaliseCategory(categoryRaw);
    const submittedAtRaw = pick(raw, "submitted at", "submitted_at", "date", "timestamp");
    const submittedAt = submittedAtRaw ? new Date(submittedAtRaw) : now;

    const fullName = pick(raw, "full name", "name", "author", "author name");
    const email = pick(raw, "email", "email address");
    const phone = pick(raw, "phone", "phone number", "whatsapp");
    const country = pick(raw, "country");
    const stateRegion = pick(raw, "state", "state/region", "region");
    const occupation = pick(raw, "occupation", "role");
    const consentRaw = pick(raw, "consent to publish", "publication consent", "consent");
    const consent: (typeof schema.publishConsentEnum.enumValues)[number] =
      /anonym/i.test(consentRaw)
        ? "granted_anonymously"
        : /yes|granted|agree/i.test(consentRaw)
        ? "granted_with_name"
        : /no|declin/i.test(consentRaw)
        ? "declined"
        : "not_yet_asked";

    // Validate — minimum viable submission
    const problems: string[] = [];
    if (!title) problems.push("missing title");
    if (!content || countWords(content) < 20) problems.push("empty or too-short manuscript");
    if (!category) problems.push(`unknown category "${categoryRaw}"`);
    if (!fullName) problems.push("missing name");
    if (!email || !isEmail(email)) problems.push("invalid or missing email");

    if (problems.length > 0) {
      errorCount++;
      statuses.push({
        rowIndex,
        status: "error",
        reason: problems.join("; "),
        title: title || "(untitled)",
        category: categoryRaw || "(unknown)",
      });
      continue;
    }

    // Duplicate check — same email + same title + same theme year
    const existing = await db
      .select({ token: schema.submissionManuscripts.internalToken })
      .from(schema.submissionManuscripts)
      .innerJoin(
        schema.submissionIdentities,
        eq(schema.submissionIdentities.internalToken, schema.submissionManuscripts.internalToken)
      )
      .where(
        and(
          eq(schema.submissionIdentities.email, email),
          eq(schema.submissionManuscripts.title, title),
          eq(schema.submissionManuscripts.themeYear, opts.themeYear)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      duplicateCount++;
      statuses.push({
        rowIndex,
        status: "duplicate",
        reason: "same author + title + year already imported",
        title,
        category: category!,
      });
      continue;
    }

    // Flag conditions that don't block ingest but need admin review
    const flags: string[] = [];
    const wc = countWords(content);
    if (wc < 100) flags.push("very short");
    if (wc > 3000) flags.push("very long");
    if (/\bkill\s+myself\b|\bsuicid/i.test(content)) flags.push("contains self-harm language — review before publication");

    const isFlagged = flags.length > 0;
    if (isFlagged) flaggedCount++;

    // THE SPLIT — write manuscript first, then identity. Both are needed
    // or neither should exist; wrap in a mini-tx if the driver supports it.
    // (neon-http doesn't expose transactions, so we chain and rollback
    // the manuscript on identity-insert failure.)
    let manuscriptToken: string | null = null;
    try {
      const [ms] = await db
        .insert(schema.submissionManuscripts)
        .values({
          importId: importRow.id,
          title,
          content,
          category: category!,
          wordCount: wc,
          themeYear: opts.themeYear,
          submittedAt,
          flagged: isFlagged,
          flagReasons: flags,
        })
        .returning({ token: schema.submissionManuscripts.internalToken });
      manuscriptToken = ms.token;

      await db.insert(schema.submissionIdentities).values({
        internalToken: manuscriptToken,
        fullName,
        email: email.toLowerCase(),
        phone: phone || null,
        country: country || null,
        stateRegion: stateRegion || null,
        occupation: occupation || null,
        consentToPublish: consent,
        consentToContact: true,
      });

      createdCount++;
      statuses.push({
        rowIndex,
        status: isFlagged ? "flagged" : "created",
        reason: isFlagged ? flags.join("; ") : undefined,
        title,
        category: category!,
      });
    } catch (err: unknown) {
      // Best-effort rollback of the manuscript row if the identity write failed.
      if (manuscriptToken) {
        try {
          await db
            .delete(schema.submissionManuscripts)
            .where(eq(schema.submissionManuscripts.internalToken, manuscriptToken));
        } catch { /* swallow */ }
      }
      errorCount++;
      statuses.push({
        rowIndex,
        status: "error",
        reason: err instanceof Error ? err.message : "insert failed",
        title,
        category: category ?? categoryRaw,
      });
    }
  }

  await db
    .update(schema.submissionImports)
    .set({
      createdCount,
      duplicateCount,
      errorCount,
      flaggedCount,
    })
    .where(eq(schema.submissionImports.id, importRow.id));

  return {
    importId: importRow.id,
    rowCount: rows.length,
    createdCount,
    duplicateCount,
    errorCount,
    flaggedCount,
    rows: statuses,
  };
}
