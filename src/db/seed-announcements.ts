/**
 * Sync the sitewide announcements strip with the current lecture schedule.
 * Idempotent — safe to re-run whenever dates or themes change.
 *
 *   npm run db:seed-announcements
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function run() {
  const { db, schema } = await import("./client");
  const { eq } = await import("drizzle-orm");

  const ROWS: {
    slug: string;
    title: string;
    body: string;
    category: (typeof schema.announcementCategoryEnum.enumValues)[number];
    publishAt: Date;
    strip: boolean;
    href: string | null;
  }[] = [
    {
      slug: "lecture-aug-2026",
      title: "August Lecture · 29 Aug · Mental Health in Humanitarian Settings",
      body: "Our August Monthly Lecture is on 29 August 2026. Topic: Mental Health in Humanitarian Settings. Speaker and joining details will be shared soon.",
      category: "Lectures",
      publishAt: new Date("2026-08-01T09:00:00.000Z"),
      strip: true,
      href: "/lectures",
    },
    {
      slug: "lecture-sept-2026",
      title: "September Lecture · 27 Sept · Suicide Prevention + Prize Presentation",
      body: "Our September Monthly Lecture is on 27 September 2026. Theme: Suicide Prevention and Presentation of Prize — the 2026 Writing Competition winners will be revealed live.",
      category: "Lectures",
      publishAt: new Date("2026-08-15T09:00:00.000Z"),
      strip: true,
      href: "/lectures",
    },
    {
      slug: "wc-2026-open",
      title: "The 2026 JMHS National Writing Competition is open — deadline 13 September 2026",
      body: "Submissions close on 13 September 2026. Winners will be announced live at the September Monthly Lecture on 27 September 2026.",
      category: "Competition",
      publishAt: new Date("2026-07-01T09:00:00.000Z"),
      strip: true,
      href: "/competition",
    },
  ];

  for (const r of ROWS) {
    await db
      .insert(schema.announcements)
      .values(r)
      .onConflictDoUpdate({
        target: schema.announcements.slug,
        set: {
          title: r.title,
          body: r.body,
          category: r.category,
          publishAt: r.publishAt,
          strip: r.strip,
          href: r.href,
          updatedAt: new Date(),
        },
      });
    console.log("✓ upserted", r.slug);
  }

  console.log("Done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
