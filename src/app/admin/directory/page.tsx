import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { DirectoryRow } from "@/components/DirectoryRow";

export const metadata = { title: "Admin — Directory" };

export default async function AdminDirectory({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const { status } = await searchParams;
  const filter = status === "pending" ? "pending" : status === "verified" ? "verified" : null;

  const query = db.select().from(schema.directoryListings).orderBy(desc(schema.directoryListings.createdAt));
  const rows = filter
    ? await query.where(eq(schema.directoryListings.status, filter))
    : await query;

  return (
    <>
      <PageTitle
        kicker="Directory"
        title="Professional Support Directory"
        description="Verified practitioners appear on /directory. Pending listings are hidden from the public until you approve them."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { k: null, label: "All" },
          { k: "pending", label: "Pending" },
          { k: "verified", label: "Verified" },
        ].map((f) => {
          const href = f.k ? `?status=${f.k}` : "?";
          const active = (filter ?? null) === f.k;
          return (
            <a
              key={String(f.k)}
              href={href}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active
                  ? "bg-brand text-white border-brand"
                  : "bg-bg-surface text-fg-muted border-hairline hover:border-brand hover:text-brand"
              }`}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <ul className="divide-y divide-hairline">
          {rows.map((d) => (
            <DirectoryRow key={d.id} row={d} />
          ))}
          {rows.length === 0 && (
            <li className="p-10 text-center text-fg-muted">Nothing here yet.</li>
          )}
        </ul>
      </Card>
    </>
  );
}
