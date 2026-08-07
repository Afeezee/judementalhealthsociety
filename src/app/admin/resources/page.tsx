import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card, EmptyState } from "@/components/AdminChrome";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Admin — Resources" };

const CATEGORY_LABEL: Record<string, string> = {
  "struggling-right-now": "Struggling right now",
  "supporting-someone-else": "Supporting someone else",
  "learning-and-prevention": "Learning & prevention",
};

export default async function AdminResources() {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const rows = await db.select().from(schema.resources).orderBy(desc(schema.resources.publishedAt));

  return (
    <>
      <PageTitle
        kicker="Resource Centre"
        title="Resources"
        description="Articles surfaced on /resources and via the Quick Paths on the homepage."
        actions={
          <Link
            href="/admin/resources/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            New article
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState title="No articles yet" />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-hairline">
            {rows.map((r) => (
              <li key={r.id} className="p-5 hover:bg-bg-elevated transition-colors">
                <Link href={`/admin/resources/${r.id}`} className="block">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-semibold mb-2">
                    <span className="text-brand">{CATEGORY_LABEL[r.category] ?? r.category}</span>
                    <span className="text-fg-muted">
                      {r.readingMinutes} min · /resources/{r.slug}
                    </span>
                  </div>
                  <div className="font-display text-lg font-medium">{r.title}</div>
                  <p className="mt-1 text-sm text-fg-muted line-clamp-2">{r.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
