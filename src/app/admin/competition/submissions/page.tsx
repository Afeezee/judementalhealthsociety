import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Submissions (blind)" };

// IMPORTANT: query returns manuscript rows ONLY — never joins identities.
// This is the invariant that keeps judging blind (spec §6).
export default async function SubmissionsList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; flagged?: string }>;
}) {
  const gate = await requireRole("competition_coordinator");
  if (!gate.ok) redirect("/admin");

  const { category, flagged } = await searchParams;

  const conditions = [];
  if (category) conditions.push(eq(schema.submissionManuscripts.category, category as (typeof schema.submissionCategoryEnum.enumValues)[number]));
  if (flagged === "1") conditions.push(eq(schema.submissionManuscripts.flagged, true));

  const query = db
    .select({
      token: schema.submissionManuscripts.internalToken,
      title: schema.submissionManuscripts.title,
      category: schema.submissionManuscripts.category,
      wordCount: schema.submissionManuscripts.wordCount,
      submittedAt: schema.submissionManuscripts.submittedAt,
      themeYear: schema.submissionManuscripts.themeYear,
      flagged: schema.submissionManuscripts.flagged,
      flagReasons: schema.submissionManuscripts.flagReasons,
    })
    .from(schema.submissionManuscripts)
    .orderBy(desc(schema.submissionManuscripts.submittedAt))
    .limit(200);

  const rows = conditions.length > 0
    ? await query.where(conditions.length === 1 ? conditions[0] : (await import("drizzle-orm")).and(...conditions))
    : await query;

  return (
    <>
      <PageTitle
        kicker="Writing Competition"
        title="Submissions — blind view"
        description="Manuscript-side only. Authors are not shown here or on the individual entry pages until you switch on 'reveal after judging' from Site Settings."
      />

      <Card className="mb-4 bg-brand/5 border-brand/30">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">Judging is blind</div>
        <p className="mt-2 text-sm text-fg">
          Every row shown was written to <code className="text-fg-muted">submission_manuscripts</code>.
          Author identities live in a separate table joined by an internal
          token and are never queried on this page.
        </p>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-fg-muted mr-2">Filter:</span>
        {[
          { k: null, label: "All" },
          { k: "poetry", label: "Poetry" },
          { k: "short-story", label: "Short story" },
          { k: "essay", label: "Essay" },
          { k: "personal-narrative", label: "Personal narrative" },
        ].map((f) => (
          <Link
            key={String(f.k)}
            href={f.k ? `?category=${f.k}` : "?"}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              (category ?? null) === f.k
                ? "bg-brand text-white border-brand"
                : "border-hairline text-fg-muted hover:border-brand"
            }`}
          >
            {f.label}
          </Link>
        ))}
        <Link
          href="?flagged=1"
          className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border ${
            flagged === "1"
              ? "bg-signal-red text-white border-signal-red"
              : "border-hairline text-fg-muted hover:border-signal-red"
          }`}
        >
          Flagged only
        </Link>
      </div>

      {rows.length === 0 ? (
        <Card>
          <p className="text-sm text-fg-muted">No submissions match. Import a Sculptform export from the{" "}
            <Link href="/admin/competition/import" className="text-brand font-semibold">import tool</Link>.
          </p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-elevated">
              <tr className="text-left">
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Words</th>
                <th className="p-3 font-semibold">Year</th>
                <th className="p-3 font-semibold">Submitted</th>
                <th className="p-3 font-semibold">Flag</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.token} className="border-t border-hairline">
                  <td className="p-3">
                    <Link
                      href={`/admin/competition/submissions/${r.token}`}
                      className="text-fg font-medium hover:text-brand"
                    >
                      {r.title}
                    </Link>
                  </td>
                  <td className="p-3 text-fg-muted">{r.category}</td>
                  <td className="p-3 tabular-nums">{r.wordCount}</td>
                  <td className="p-3 text-fg-muted tabular-nums">{r.themeYear}</td>
                  <td className="p-3 text-fg-muted">
                    {new Date(r.submittedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-3">
                    {r.flagged ? (
                      <span className="text-signal-red text-xs font-semibold">
                        {Array.isArray(r.flagReasons) ? (r.flagReasons as string[]).join(", ") : "flagged"}
                      </span>
                    ) : (
                      <span className="text-fg-muted text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
