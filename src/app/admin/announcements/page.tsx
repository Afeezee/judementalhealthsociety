import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card, EmptyState } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Announcements" };

export default async function AdminAnnouncements() {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const rows = await db
    .select()
    .from(schema.announcements)
    .orderBy(desc(schema.announcements.publishAt));

  return (
    <>
      <PageTitle
        kicker="Announcements"
        title="Announcements"
        description="What the public sees on the homepage feed and the announcements strip."
        actions={
          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            New announcement
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Create the first one — it'll appear in the strip and on the homepage."
          action={<Link href="/admin/announcements/new" className="text-brand font-semibold">Create →</Link>}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-hairline">
            {rows.map((a) => (
              <li key={a.id} className="p-5 hover:bg-bg-elevated transition-colors">
                <Link href={`/admin/announcements/${a.id}`} className="block">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-semibold mb-2">
                    <span className="text-brand">{a.category}</span>
                    <span className="text-fg-muted">
                      {new Date(a.publishAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="font-display text-lg font-medium">{a.title}</div>
                  <p className="mt-1 text-sm text-fg-muted line-clamp-2">{a.body}</p>
                  {a.strip && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Pinned to strip
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
