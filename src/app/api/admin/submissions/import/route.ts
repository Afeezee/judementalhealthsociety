import { NextResponse } from "next/server";
import { ingestSubmissions } from "@/lib/submissions-import";
import { requireRole } from "@/lib/auth";

/**
 * POST an XLSX/CSV Sculptform export. Splits each row into
 * manuscript + identity records at ingest (see spec §2.11).
 */
export async function POST(req: Request) {
  const gate = await requireRole("competition_coordinator");
  if (!gate.ok) {
    return NextResponse.json({ error: "Not authorised" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const themeYearRaw = String(form.get("themeYear") ?? new Date().getFullYear());
  const notes = String(form.get("notes") ?? "").trim() || undefined;
  const themeYear = parseInt(themeYearRaw, 10);

  if (!file || !themeYear) {
    return NextResponse.json({ error: "Missing file or theme year" }, { status: 400 });
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 413 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const result = await ingestSubmissions({
      fileBuffer: buffer,
      filename: file.name,
      themeYear,
      importedByUserId: gate.user.id,
      notes,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[import] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 }
    );
  }
}
