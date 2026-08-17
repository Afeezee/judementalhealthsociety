import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { getHomeHero, getContactInfo } from "@/lib/public-data";

export const metadata = { title: "Content editor" };
export const dynamic = "force-dynamic";

async function saveHomeHero(formData: FormData) {
  "use server";
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  const value = {
    eyebrow: String(formData.get("eyebrow") ?? "").slice(0, 200),
    headline: String(formData.get("headline") ?? "").slice(0, 400),
    headlineAccent: String(formData.get("headlineAccent") ?? "").slice(0, 200),
    subhead: String(formData.get("subhead") ?? "").slice(0, 1200),
  };
  await db
    .insert(schema.siteSettings)
    .values({ key: "home_hero", value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
  revalidatePath("/");
  revalidatePath("/admin/content");
}

async function saveContactInfo(formData: FormData) {
  "use server";
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  const value = {
    phone: String(formData.get("phone") ?? "").slice(0, 60),
    emergencyPhone: String(formData.get("emergencyPhone") ?? "").slice(0, 60),
    email: String(formData.get("email") ?? "").slice(0, 200),
    instagram: String(formData.get("instagram") ?? "").slice(0, 300),
    instagramHandle: String(formData.get("instagramHandle") ?? "").slice(0, 100),
  };
  await db
    .insert(schema.siteSettings)
    .values({ key: "contact_info", value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/content");
}

function Field({
  label,
  name,
  defaultValue,
  hint,
  multiline,
  rows,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-fg mb-1">{label}</div>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={rows ?? 4}
          className="w-full rounded-lg border border-hairline bg-bg px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-hairline bg-bg px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      )}
      {hint && <div className="mt-1 text-xs text-fg-muted">{hint}</div>}
    </label>
  );
}

export default async function ContentEditor() {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const [hero, contact] = await Promise.all([getHomeHero(), getContactInfo()]);

  return (
    <>
      <PageTitle
        kicker="Content editor"
        title="Edit key site content"
        description="Changes here update the public site immediately. For less-common settings — impact metrics, competition timeline, next lecture — see the sidebar."
      />

      <section className="mb-10">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2 className="font-display text-lg font-medium">Home hero</h2>
          <span className="text-xs text-fg-muted">Shows at the top of /</span>
        </div>
        <Card>
          <form action={saveHomeHero} className="grid gap-4">
            <Field
              label="Eyebrow"
              name="eyebrow"
              defaultValue={hero.eyebrow}
              hint="Small label above the headline."
            />
            <Field
              label="Headline"
              name="headline"
              defaultValue={hero.headline}
              hint="The main sentence."
            />
            <Field
              label="Headline accent"
              name="headlineAccent"
              defaultValue={hero.headlineAccent}
              hint="Coloured sentence that follows the headline."
            />
            <Field
              label="Subhead"
              name="subhead"
              defaultValue={hero.subhead}
              multiline
              rows={4}
              hint="The paragraph under the headline. Keep it to 2–3 sentences."
            />
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-full bg-brand text-white px-5 py-2 text-sm font-semibold hover:bg-brand-hover"
              >
                Save home hero
              </button>
            </div>
          </form>
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2 className="font-display text-lg font-medium">Contact information</h2>
          <span className="text-xs text-fg-muted">Shows on /contact and the footer</span>
        </div>
        <Card>
          <form action={saveContactInfo} className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Public phone"
              name="phone"
              defaultValue={contact.phone}
              hint="Displayed on the Contact page."
            />
            <Field
              label="Emergency phone"
              name="emergencyPhone"
              defaultValue={contact.emergencyPhone}
              hint="Shown on the Emergency page as a JMHS fallback line."
            />
            <Field
              label="Email"
              name="email"
              defaultValue={contact.email}
            />
            <Field
              label="Instagram handle"
              name="instagramHandle"
              defaultValue={contact.instagramHandle}
              hint="Displayed text — e.g. @judementalhealthsociety"
            />
            <div className="sm:col-span-2">
              <Field
                label="Instagram URL"
                name="instagram"
                defaultValue={contact.instagram}
                hint="Full https:// link the handle should open to."
              />
            </div>
            <div className="sm:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-full bg-brand text-white px-5 py-2 text-sm font-semibold hover:bg-brand-hover"
              >
                Save contact info
              </button>
            </div>
          </form>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-lg font-medium mb-3">
          Editing other content
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <div className="font-display text-base font-medium">Announcements</div>
            <p className="mt-1 text-sm text-fg-muted">
              Home page cards, category strip, and the top notification bar.
            </p>
            <a href="/admin/announcements" className="mt-3 inline-block text-sm font-semibold text-brand">
              Open →
            </a>
          </Card>
          <Card>
            <div className="font-display text-base font-medium">Monthly Lectures</div>
            <p className="mt-1 text-sm text-fg-muted">
              Add and update the upcoming lecture schedule. Feeds the home
              teaser and /lectures.
            </p>
            <a href="/admin/lectures" className="mt-3 inline-block text-sm font-semibold text-brand">
              Open →
            </a>
          </Card>
          <Card>
            <div className="font-display text-base font-medium">Resource Centre</div>
            <p className="mt-1 text-sm text-fg-muted">
              Publish new articles and edit existing ones.
            </p>
            <a href="/admin/resources" className="mt-3 inline-block text-sm font-semibold text-brand">
              Open →
            </a>
          </Card>
          <Card>
            <div className="font-display text-base font-medium">Impact counter</div>
            <p className="mt-1 text-sm text-fg-muted">
              Manual values (members, lectures held) shown on the home page.
            </p>
            <a href="/admin/impact" className="mt-3 inline-block text-sm font-semibold text-brand">
              Open →
            </a>
          </Card>
        </div>
      </section>
    </>
  );
}
