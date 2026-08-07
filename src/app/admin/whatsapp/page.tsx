import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "WhatsApp settings" };

async function addLink(formData: FormData) {
  "use server";
  const gate = await requireRole("website_administrator");
  if (!gate.ok) throw new Error("Not authorised");
  const label = String(formData.get("label") ?? "JMHS Community").trim();
  const url = String(formData.get("url") ?? "").trim();
  const active = formData.get("active") === "on";
  if (!url) return;
  if (active) {
    await db.update(schema.whatsappSettings).set({ active: false });
  }
  await db.insert(schema.whatsappSettings).values({ label, inviteUrl: url, active });
  revalidatePath("/");
  revalidatePath("/whatsapp");
  revalidatePath("/admin/whatsapp");
}

async function setActive(id: string) {
  "use server";
  const gate = await requireRole("website_administrator");
  if (!gate.ok) throw new Error("Not authorised");
  await db.update(schema.whatsappSettings).set({ active: false });
  await db.update(schema.whatsappSettings).set({ active: true }).where(eq(schema.whatsappSettings.id, id));
  revalidatePath("/");
  revalidatePath("/whatsapp");
  revalidatePath("/admin/whatsapp");
}

async function deleteLink(id: string) {
  "use server";
  const gate = await requireRole("website_administrator");
  if (!gate.ok) throw new Error("Not authorised");
  await db.delete(schema.whatsappSettings).where(eq(schema.whatsappSettings.id, id));
  revalidatePath("/admin/whatsapp");
}

export default async function WhatsAppAdmin() {
  const gate = await requireRole("website_administrator");
  if (!gate.ok) redirect("/admin");

  const rows = await db.select().from(schema.whatsappSettings).orderBy(desc(schema.whatsappSettings.createdAt));

  return (
    <>
      <PageTitle
        kicker="Community"
        title="WhatsApp community links"
        description='The active link is used by every "Join our WhatsApp community" button on the site. You can store multiple; only one is live at a time.'
      />

      <Card className="mb-6">
        <form action={addLink} className="grid gap-4 sm:grid-cols-[1fr_2fr_auto_auto] items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Label</span>
            <input
              type="text"
              name="label"
              defaultValue="JMHS Community"
              className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Invite URL</span>
            <input
              type="url"
              name="url"
              required
              placeholder="https://chat.whatsapp.com/…"
              className="mt-1 w-full rounded-lg border border-hairline bg-bg px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded" />
            <span className="text-sm">Make active</span>
          </label>
          <button
            type="submit"
            className="rounded-full bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-hover"
          >
            Add
          </button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <ul className="divide-y divide-hairline">
          {rows.map((r) => (
            <li key={r.id} className="p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.label}</span>
                  {r.active && (
                    <span className="inline-flex items-center rounded-full bg-brand text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-fg-muted truncate max-w-lg">{r.inviteUrl}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.active && (
                  <form action={setActive.bind(null, r.id)}>
                    <button className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand">
                      Make active
                    </button>
                  </form>
                )}
                <form action={deleteLink.bind(null, r.id)}>
                  <button className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-signal-red hover:bg-signal-red hover:text-white">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="p-10 text-center text-fg-muted text-sm">No WhatsApp links yet.</li>
          )}
        </ul>
      </Card>
    </>
  );
}
