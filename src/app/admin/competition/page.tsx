import Link from "next/link";
import { redirect } from "next/navigation";
import { and, count, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card, Stat } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { COMPETITION } from "@/lib/site-settings";

export const metadata = { title: "Admin — Writing Competition" };

export default async function AdminCompetition() {
  const gate = await requireRole("competition_coordinator");
  if (!gate.ok) redirect("/admin");

  const year = new Date().getFullYear();

  const [
    [{ n: total }],
    [{ n: flagged }],
    [{ n: poetry }],
    [{ n: shortStory }],
    [{ n: essay }],
    [{ n: narrative }],
    recentImports,
  ] = await Promise.all([
    db.select({ n: count() }).from(schema.submissionManuscripts).where(eq(schema.submissionManuscripts.themeYear, year)),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(and(eq(schema.submissionManuscripts.themeYear, year), eq(schema.submissionManuscripts.flagged, true))),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(and(eq(schema.submissionManuscripts.themeYear, year), eq(schema.submissionManuscripts.category, "poetry"))),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(and(eq(schema.submissionManuscripts.themeYear, year), eq(schema.submissionManuscripts.category, "short-story"))),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(and(eq(schema.submissionManuscripts.themeYear, year), eq(schema.submissionManuscripts.category, "essay"))),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(and(eq(schema.submissionManuscripts.themeYear, year), eq(schema.submissionManuscripts.category, "personal-narrative"))),
    db.select().from(schema.submissionImports).orderBy(desc(schema.submissionImports.importedAt)).limit(5),
  ]);

  return (
    <>
      <PageTitle
        kicker="Writing Competition"
        title={`Overview — ${year}`}
        description="Blind-judged, identity-split at ingest. Anyone here can see counts but only manuscripts (never identities) unless you switch on 'reveal after judging' from Site Settings."
        actions={
          <>
            <Link
              href="/admin/competition/import"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Import from Sculptform
            </Link>
            <Link
              href="/admin/competition/submissions"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-fg hover:border-brand hover:text-brand"
            >
              View submissions (blind)
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Stat label="Total submissions" value={total} hint={`Deadline ${COMPETITION.deadline}`} />
        <Stat label="Flagged for review" value={flagged} hint="Short/long/language" />
        <Stat label="Poetry" value={poetry} />
        <Stat label="Short stories" value={shortStory} />
        <Stat label="Essays" value={essay} />
        <Stat label="Personal narratives" value={narrative} />
      </div>

      <section className="mb-8">
        <h2 className="font-display text-lg font-medium mb-3">Recent imports</h2>
        {recentImports.length === 0 ? (
          <Card>
            <p className="text-sm text-fg-muted">
              No imports yet. Export the results from Sculptform and drop the file into the{" "}
              <Link href="/admin/competition/import" className="text-brand font-semibold">
                import tool
              </Link>.
            </p>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <ul className="divide-y divide-hairline">
              {recentImports.map((imp) => (
                <li key={imp.id} className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-medium">{imp.filename}</div>
                      <div className="text-xs text-fg-muted">
                        {new Date(imp.importedAt).toLocaleString("en-GB")} · theme year {imp.themeYear}
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span><strong className="text-fg">{imp.createdCount}</strong> created</span>
                      <span><strong className="text-brand">{imp.flaggedCount}</strong> flagged</span>
                      <span><strong className="text-fg-muted">{imp.duplicateCount}</strong> dup</span>
                      <span><strong className="text-signal-red">{imp.errorCount}</strong> error</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </>
  );
}
