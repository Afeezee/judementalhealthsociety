import { redirect } from "next/navigation";
import { desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const metadata = { title: "Site settings" };

async function saveSetting(formData: FormData) {
  "use server";
  const gate = await requireRole("website_administrator");
  if (!gate.ok) throw new Error("Not authorised");
  const key = String(formData.get("key"));
  const raw = String(formData.get("value") ?? "");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Value must be valid JSON.");
  }
  await db
    .insert(schema.siteSettings)
    .values({ key, value: value as object, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: value as object, updatedAt: new Date() } });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/competition");
  revalidatePath("/lectures");
}

async function markResponded(id: string) {
  "use server";
  const gate = await requireRole("website_administrator");
  if (!gate.ok) throw new Error("Not authorised");
  await db.update(schema.contactMessages).set({ respondedAt: new Date() }).where(eq(schema.contactMessages.id, id));
  revalidatePath("/admin/settings");
}

export default async function SiteSettings() {
  const gate = await requireRole("website_administrator");
  if (!gate.ok) redirect("/admin");

  const [settings, messages] = await Promise.all([
    db.select().from(schema.siteSettings),
    db.select().from(schema.contactMessages).where(isNull(schema.contactMessages.respondedAt)).orderBy(desc(schema.contactMessages.createdAt)).limit(20),
  ]);

  return (
    <>
      <PageTitle
        kicker="Site settings"
        title="Site-wide settings and contact inbox"
        description="These values back the About page copy, contact details, competition timeline, and next lecture. Contact messages awaiting reply appear below."
      />

      <section className="mb-10">
        <h2 className="font-display text-lg font-medium mb-3">Settings (JSON)</h2>
        <div className="grid gap-4">
          {settings.map((s) => (
            <Card key={s.key}>
              <form action={saveSetting}>
                <input type="hidden" name="key" value={s.key} />
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg font-medium">{s.key}</div>
                  <div className="text-xs text-fg-muted">Updated {new Date(s.updatedAt).toLocaleString("en-GB")}</div>
                </div>
                <textarea
                  name="value"
                  rows={8}
                  defaultValue={JSON.stringify(s.value, null, 2)}
                  className="w-full rounded-lg border border-hairline bg-bg px-3 py-2 font-mono text-xs"
                  spellCheck={false}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-hover"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-medium mb-3">
          Contact inbox ({messages.length} unanswered)
        </h2>
        {messages.length === 0 ? (
          <Card><p className="text-sm text-fg-muted">No unanswered messages. 🎉</p></Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <ul className="divide-y divide-hairline">
              {messages.map((m) => (
                <li key={m.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider text-brand font-semibold">{m.topic}</div>
                      <div className="mt-1 font-medium">{m.name} · <a className="hover:text-brand" href={`mailto:${m.email}`}>{m.email}</a></div>
                      <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <form action={markResponded.bind(null, m.id)}>
                      <button className="rounded-full bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-hover">
                        Mark responded
                      </button>
                    </form>
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
