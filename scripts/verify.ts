import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

async function main() {
  const { db, schema } = await import("../src/db/client");
  const { eq, desc } = await import("drizzle-orm");
  const strips = await db
    .select({ slug: schema.announcements.slug, title: schema.announcements.title, href: schema.announcements.href })
    .from(schema.announcements)
    .where(eq(schema.announcements.strip, true))
    .orderBy(desc(schema.announcements.publishAt));
  console.log("STRIP ANNOUNCEMENTS:");
  for (const r of strips) console.log(" ·", r.slug, "→", r.title);

  const lecs = await db
    .select({ date: schema.lectures.date, topic: schema.lectures.topic })
    .from(schema.lectures)
    .orderBy(schema.lectures.date);
  console.log("\nLECTURES:");
  for (const l of lecs) console.log(" ·", l.date.toISOString().slice(0,10), "→", l.topic);
}
main().catch(e => { console.error(e); process.exit(1); });
