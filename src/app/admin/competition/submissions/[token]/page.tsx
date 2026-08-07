import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Submission (blind)" };

/**
 * Blind view of a single submission — manuscript-side only. Identities
 * live in a separate table and this page never joins them.
 */
export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const gate = await requireRole("competition_coordinator");
  if (!gate.ok) redirect("/admin");

  const { token } = await params;
  const rows = await db
    .select()
    .from(schema.submissionManuscripts)
    .where(eq(schema.submissionManuscripts.internalToken, token))
    .limit(1);
  const row = rows[0];
  if (!row) return notFound();

  return (
    <>
      <PageTitle
        kicker="Writing Competition · Blind"
        title={row.title}
        description={`${row.category} · ${row.wordCount} words · submitted ${new Date(row.submittedAt).toLocaleDateString("en-GB")}`}
        actions={
          <Link
            href="/admin/competition/submissions"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-fg hover:border-brand hover:text-brand"
          >
            ← Back to list
          </Link>
        }
      />

      {row.flagged && Array.isArray(row.flagReasons) && (row.flagReasons as string[]).length > 0 && (
        <Card className="mb-4 border-signal-red/30 bg-signal-red/5">
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">Flagged</div>
          <ul className="mt-2 space-y-1 text-sm">
            {(row.flagReasons as string[]).map((r) => <li key={r}>· {r}</li>)}
          </ul>
        </Card>
      )}

      <Card>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap font-serif text-lg leading-relaxed">
          {row.content}
        </div>
      </Card>

      <div className="mt-4 text-xs text-fg-muted">
        Internal token: <code className="font-mono">{row.internalToken}</code>
      </div>
    </>
  );
}
