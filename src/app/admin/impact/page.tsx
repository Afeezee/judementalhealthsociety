import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Impact counter" };

async function updateMetric(formData: FormData) {
  "use server";
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  const key = String(formData.get("key"));
  const value = Number(formData.get("value") ?? 0);
  const suffix = String(formData.get("suffix") ?? "");
  await db
    .update(schema.impactMetrics)
    .set({ value, suffix, updatedAt: new Date() })
    .where(eq(schema.impactMetrics.key, key));
  revalidatePath("/");
  revalidatePath("/admin/impact");
}

export default async function ImpactAdmin() {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const rows = await db.select().from(schema.impactMetrics).orderBy(asc(schema.impactMetrics.sortOrder));

  return (
    <>
      <PageTitle
        kicker="Impact counter"
        title="Impact metrics"
        description="Numbers that render on the homepage and in the footer strip. Auto-tracked metrics can also be overridden manually here."
      />

      <div className="grid gap-4">
        {rows.map((m) => (
          <Card key={m.key}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-fg-muted">{m.key}</div>
                <div className="font-display text-lg font-medium">{m.label}</div>
                <div className="text-sm text-fg-muted">{m.note}</div>
                <div className="mt-1 text-[11px]">
                  {m.isManual ? (
                    <span className="text-brand font-semibold">Manual</span>
                  ) : (
                    <span className="text-fg-muted">Auto-tracked (overridable)</span>
                  )}
                </div>
              </div>
              <form action={updateMetric} className="flex items-end gap-2">
                <input type="hidden" name="key" value={m.key} />
                <label className="block">
                  <span className="text-xs text-fg-muted">Value</span>
                  <input
                    type="number"
                    name="value"
                    defaultValue={m.value}
                    className="mt-1 block w-24 rounded-lg border border-hairline bg-bg px-3 py-2 text-right tabular-nums"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-fg-muted">Suffix</span>
                  <input
                    type="text"
                    name="suffix"
                    defaultValue={m.suffix}
                    maxLength={4}
                    className="mt-1 block w-14 rounded-lg border border-hairline bg-bg px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-hover"
                >
                  Save
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
