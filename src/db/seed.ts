/**
 * Seed script — populates the DB with the values from src/lib/seed-content.ts
 * and src/lib/site-settings.ts. Safe to re-run: uses onConflictDoNothing on
 * unique slugs / keys so it won't wipe production data if accidentally run.
 *
 * Usage:  npm run db:seed
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function seed() {
  // Dynamic imports so env is loaded before client.ts evaluates.
  const { db, schema } = await import("./client");
  const { ANNOUNCEMENTS, RESOURCES, DIRECTORY } = await import("../lib/seed-content");
  const { IMPACT_METRICS, WHATSAPP_INVITE, CONTACT, COMPETITION, NEXT_LECTURE } =
    await import("../lib/site-settings");

  console.log("→ Seeding announcements…");
  await db
    .insert(schema.announcements)
    .values(
      ANNOUNCEMENTS.map((a) => ({
        slug: a.id,
        title: a.title,
        body: a.body,
        category: a.category as (typeof schema.announcementCategoryEnum.enumValues)[number],
        publishAt: new Date(a.publishAt),
        strip: a.category === "Competition" || a.category === "Lectures",
        href:
          a.category === "Competition"
            ? "/competition"
            : a.category === "Lectures"
            ? "/lectures"
            : null,
      }))
    )
    .onConflictDoNothing({ target: schema.announcements.slug });

  console.log("→ Seeding resources…");
  await db
    .insert(schema.resources)
    .values(
      RESOURCES.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        body: r.body,
        category: r.category as (typeof schema.resourceCategoryEnum.enumValues)[number],
        readingMinutes: r.readingMinutes,
        tags: r.tags,
        publishedAt: new Date(r.publishedAt),
      }))
    )
    .onConflictDoNothing({ target: schema.resources.slug });

  console.log("→ Seeding directory listings…");
  await db
    .insert(schema.directoryListings)
    .values(
      DIRECTORY.map((d) => ({
        slug: d.id,
        name: d.name,
        credentials: d.credentials,
        affiliation: d.affiliation,
        location: d.location ?? null,
        costTier: d.costTier as (typeof schema.directoryCostEnum.enumValues)[number],
        status: d.status as (typeof schema.directoryStatusEnum.enumValues)[number],
        verifiedAt: d.status === "verified" ? new Date() : null,
      }))
    )
    .onConflictDoNothing({ target: schema.directoryListings.slug });

  console.log("→ Seeding impact metrics…");
  await db
    .insert(schema.impactMetrics)
    .values(
      IMPACT_METRICS.map((m, i) => ({
        key: m.key,
        label: m.label,
        note: m.note,
        value: m.value,
        suffix: m.suffix,
        isManual: m.isManual,
        sortOrder: i,
      }))
    )
    .onConflictDoNothing({ target: schema.impactMetrics.key });

  console.log("→ Seeding next lecture (TBD state)…");
  await db
    .insert(schema.lectures)
    .values({
      date: new Date(NEXT_LECTURE.date),
      topic: NEXT_LECTURE.topic,
      speaker: NEXT_LECTURE.speaker,
      joinLink: NEXT_LECTURE.joinLink,
      summary: NEXT_LECTURE.note,
      isNext: true,
    });

  console.log("→ Seeding site settings…");
  const settings: [string, unknown][] = [
    ["contact", CONTACT],
    ["competition", COMPETITION],
    ["next_lecture", NEXT_LECTURE],
  ];
  for (const [key, value] of settings) {
    await db
      .insert(schema.siteSettings)
      .values({ key, value })
      .onConflictDoNothing({ target: schema.siteSettings.key });
  }

  console.log("→ Seeding WhatsApp invite…");
  await db
    .insert(schema.whatsappSettings)
    .values({
      label: "JMHS Community",
      inviteUrl: WHATSAPP_INVITE,
      active: true,
    });

  console.log("✓ Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
