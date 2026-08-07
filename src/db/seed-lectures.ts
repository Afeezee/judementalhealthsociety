/**
 * One-off seed for the Aug & Sept 2026 lectures. Safe to re-run —
 * deletes existing rows on the same date first.
 *
 *   npm run db:seed-lectures
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function run() {
  const { db, schema } = await import("./client");
  const { and, eq, gte, lt } = await import("drizzle-orm");

  const LECTURES: Array<{
    date: Date;
    topic: string | null;
    speaker: string | null;
    summary: string | null;
  }> = [
    {
      date: new Date("2026-08-29T15:00:00.000Z"),
      topic: "Mental Health in Humanitarian Settings",
      speaker: null, // TBD
      summary: "Speaker and joining details to be announced.",
    },
    {
      date: new Date("2026-09-27T15:00:00.000Z"),
      topic: "Suicide Prevention and Presentation of Prize",
      speaker: null, // TBD
      summary:
        "The winners of the 2026 JMHS National Writing Competition will be announced and prizes presented live during this lecture.",
    },
  ];

  for (const l of LECTURES) {
    const dayStart = new Date(l.date); dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(l.date);   dayEnd.setUTCHours(23, 59, 59, 999);

    await db.delete(schema.lectures).where(
      and(
        gte(schema.lectures.date, dayStart),
        lt(schema.lectures.date, dayEnd)
      )
    );

    await db.insert(schema.lectures).values({
      date: l.date,
      topic: l.topic,
      speaker: l.speaker,
      summary: l.summary,
      isNext: false, // superseded by date-based logic; kept for schema compat
    });
    console.log("✓ seeded", l.date.toISOString().slice(0, 10), "—", l.topic);
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
