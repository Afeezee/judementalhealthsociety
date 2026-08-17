/**
 * Server-side helpers the public pages use to read live content from the DB.
 * If a query returns nothing (fresh install), fall back to the seed arrays
 * in seed-content.ts so the site is never blank.
 */
import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { db, schema } from "@/db/client";
import {
  ANNOUNCEMENTS as SEED_ANNOUNCEMENTS,
  RESOURCES as SEED_RESOURCES,
  DIRECTORY as SEED_DIRECTORY,
  RESOURCE_CATEGORIES,
} from "./seed-content";
import { IMPACT_METRICS as SEED_METRICS } from "./site-settings";

export { RESOURCE_CATEGORIES };

export async function getAnnouncements() {
  const rows = await db
    .select()
    .from(schema.announcements)
    .orderBy(desc(schema.announcements.publishAt));
  if (rows.length === 0) {
    return SEED_ANNOUNCEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      category: a.category,
      publishAt: a.publishAt,
      strip: false,
      href: null,
    }));
  }
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    category: r.category,
    publishAt: r.publishAt.toISOString(),
    strip: r.strip,
    href: r.href,
  }));
}

export async function getStripAnnouncements() {
  const rows = await db
    .select()
    .from(schema.announcements)
    .where(eq(schema.announcements.strip, true))
    .orderBy(desc(schema.announcements.publishAt))
    .limit(5);
  return rows.map((r) => ({
    id: r.id,
    label: r.category,
    message: r.title,
    href: r.href ?? undefined,
  }));
}

export async function getResources() {
  const rows = await db.select().from(schema.resources).orderBy(desc(schema.resources.publishedAt));
  if (rows.length === 0) return SEED_RESOURCES;
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body,
    category: r.category,
    readingMinutes: r.readingMinutes,
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    publishedAt: r.publishedAt.toISOString().slice(0, 10),
  }));
}

export async function getResource(slug: string) {
  const rows = await db.select().from(schema.resources).where(eq(schema.resources.slug, slug)).limit(1);
  if (rows.length > 0) {
    const r = rows[0];
    return {
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: r.body,
      category: r.category,
      readingMinutes: r.readingMinutes,
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
      publishedAt: r.publishedAt.toISOString().slice(0, 10),
    };
  }
  return SEED_RESOURCES.find((r) => r.slug === slug) ?? null;
}

export async function getVerifiedDirectory() {
  const rows = await db
    .select()
    .from(schema.directoryListings)
    .where(eq(schema.directoryListings.status, "verified"))
    .orderBy(asc(schema.directoryListings.name));
  if (rows.length === 0) return SEED_DIRECTORY;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    credentials: r.credentials,
    affiliation: r.affiliation,
    location: r.location ?? undefined,
    costTier: r.costTier,
    status: r.status,
  }));
}

export async function getImpactMetrics() {
  const rows = await db.select().from(schema.impactMetrics).orderBy(asc(schema.impactMetrics.sortOrder));
  if (rows.length === 0) return SEED_METRICS;
  return rows.map((r) => ({
    key: r.key,
    label: r.label,
    value: r.value,
    suffix: r.suffix,
    isManual: r.isManual,
    note: r.note ?? "",
  }));
}

/**
 * Lecture retrieval — date-driven now (not is_next).
 * The soonest future-dated lecture is "next"; anything else in the future is
 * "upcoming"; anything past is "archived". This lets us surface two upcoming
 * lectures side-by-side (e.g. August and September events on the homepage).
 */
export async function getNextLecture() {
  const now = new Date();
  const rows = await db
    .select()
    .from(schema.lectures)
    .where(gte(schema.lectures.date, now))
    .orderBy(asc(schema.lectures.date))
    .limit(1);
  if (rows[0]) {
    return {
      date: rows[0].date.toISOString(),
      topic: rows[0].topic,
      speaker: rows[0].speaker,
      joinLink: rows[0].joinLink,
      note: rows[0].summary ?? "",
    };
  }
  const { NEXT_LECTURE } = await import("./site-settings");
  return NEXT_LECTURE;
}

export async function getUpcomingLectures() {
  const now = new Date();
  const rows = await db
    .select()
    .from(schema.lectures)
    .where(gte(schema.lectures.date, now))
    .orderBy(asc(schema.lectures.date));
  return rows.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    topic: r.topic,
    speaker: r.speaker,
    joinLink: r.joinLink,
    summary: r.summary,
  }));
}

export async function getPastLectures() {
  const now = new Date();
  const rows = await db
    .select()
    .from(schema.lectures)
    .where(lt(schema.lectures.date, now))
    .orderBy(desc(schema.lectures.date));
  return rows.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    topic: r.topic,
    speaker: r.speaker,
    recordingUrl: r.recordingUrl,
  }));
}

export async function getActiveWhatsAppInvite() {
  const rows = await db
    .select()
    .from(schema.whatsappSettings)
    .where(eq(schema.whatsappSettings.active, true))
    .limit(1);
  return rows[0]?.inviteUrl ?? "https://chat.whatsapp.com/IkB8sF0vISwETjXgfRpLY4";
}

/**
 * Typed readers backed by the `site_settings` JSONB table. Each returns
 * the file default from src/lib/site-settings.ts if the DB row is missing,
 * so the site never renders blank on a fresh install and the admin editor
 * can bootstrap from those defaults on first save.
 *
 * Keys are kept short and stable — changing them will orphan admin edits.
 */
export type HomeHero = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
};

export type ContactInfo = {
  phone: string;
  emergencyPhone: string;
  email: string;
  instagram: string;
  instagramHandle: string;
};

async function readSetting<T>(key: string): Promise<T | null> {
  try {
    const rows = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, key))
      .limit(1);
    return (rows[0]?.value as T) ?? null;
  } catch {
    return null;
  }
}

export async function getHomeHero(): Promise<HomeHero> {
  const { HOME_HERO } = await import("./site-settings");
  const stored = await readSetting<Partial<HomeHero>>("home_hero");
  return { ...HOME_HERO, ...(stored ?? {}) };
}

export async function getContactInfo(): Promise<ContactInfo> {
  const { CONTACT } = await import("./site-settings");
  const stored = await readSetting<Partial<ContactInfo>>("contact_info");
  return {
    phone: CONTACT.phone,
    emergencyPhone: CONTACT.emergencyPhone,
    email: CONTACT.email,
    instagram: CONTACT.instagram,
    instagramHandle: CONTACT.instagramHandle,
    ...(stored ?? {}),
  };
}
