/**
 * JMHS database schema — mirrors the data model in spec §4.
 * Key invariant: submission_manuscripts and submission_identities are
 * two distinct tables joined by an internal token; judges only ever see
 * the manuscript table. That split is enforced at the import layer
 * (spec §2.11, spec §6 non-negotiables).
 */
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------- Enums ----------

export const roleEnum = pgEnum("user_role", [
  "super_admin",
  "website_administrator",
  "competition_coordinator",
  "content_editor",
  "moderator",
]);

export const announcementCategoryEnum = pgEnum("announcement_category", [
  "Competition",
  "Lectures",
  "General",
  "Community",
]);

export const resourceCategoryEnum = pgEnum("resource_category", [
  "struggling-right-now",
  "supporting-someone-else",
  "learning-and-prevention",
]);

export const directoryCostEnum = pgEnum("directory_cost_tier", [
  "free",
  "low-cost",
  "paid",
  "contact-for-details",
]);

export const directoryStatusEnum = pgEnum("directory_status", [
  "pending",
  "verified",
  "rejected",
]);

export const submissionCategoryEnum = pgEnum("submission_category", [
  "poetry",
  "short-story",
  "essay",
  "personal-narrative",
]);

export const competitionStatusEnum = pgEnum("competition_status", [
  "not_open",
  "submissions_open",
  "judging",
  "winners_announced",
]);

export const forumFlagStatusEnum = pgEnum("forum_flag_status", [
  "open",
  "reviewed_kept",
  "reviewed_removed",
]);

export const publishConsentEnum = pgEnum("publish_consent", [
  "not_yet_asked",
  "granted_with_name",
  "granted_anonymously",
  "declined",
]);

// ---------- Users & Roles ----------
// Records mirror Clerk accounts; row is upserted on first sign-in.

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: varchar("clerk_id", { length: 128 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 200 }),
    role: roleEnum("role").notNull().default("content_editor"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("users_email_idx").on(t.email)]
);

// ---------- Site settings (single row, keyed by string) ----------

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Announcements ----------

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 300 }).notNull(),
    body: text("body").notNull(),
    category: announcementCategoryEnum("category").notNull(),
    publishAt: timestamp("publish_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    strip: boolean("strip").notNull().default(false), // pin to top strip
    href: varchar("href", { length: 500 }),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("announcements_publish_idx").on(t.publishAt)]
);

// ---------- Lectures ----------

export const lectures = pgTable("lectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  topic: varchar("topic", { length: 300 }),
  speaker: varchar("speaker", { length: 200 }),
  joinLink: varchar("join_link", { length: 500 }),
  recordingUrl: varchar("recording_url", { length: 500 }),
  summary: text("summary"),
  isNext: boolean("is_next").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Resources ----------

export const resources = pgTable(
  "resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 300 }).notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
    category: resourceCategoryEnum("category").notNull(),
    readingMinutes: integer("reading_minutes").notNull().default(5),
    tags: jsonb("tags").notNull().default(sql`'[]'::jsonb`),
    author: varchar("author", { length: 200 }),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("resources_category_idx").on(t.category)]
);

// ---------- Forum ----------

export const forumThreads = pgTable("forum_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  sensitive: boolean("sensitive").notNull().default(false),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const forumPosts = pgTable(
  "forum_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id").notNull().references(() => forumThreads.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    authorId: uuid("author_id").notNull().references(() => users.id),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("forum_posts_thread_idx").on(t.threadId)]
);

export const forumFlags = pgTable("forum_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
  reporterId: uuid("reporter_id").references(() => users.id),
  reason: text("reason").notNull(),
  status: forumFlagStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

// ---------- Professional Support Directory ----------

export const directoryListings = pgTable(
  "directory_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    credentials: varchar("credentials", { length: 300 }).notNull(),
    affiliation: varchar("affiliation", { length: 300 }).notNull(),
    location: varchar("location", { length: 200 }),
    contact: varchar("contact", { length: 300 }),
    costTier: directoryCostEnum("cost_tier").notNull().default("contact-for-details"),
    status: directoryStatusEnum("status").notNull().default("pending"),
    submittedBy: varchar("submitted_by", { length: 255 }),
    verifiedBy: uuid("verified_by").references(() => users.id),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("directory_status_idx").on(t.status)]
);

// ---------- Writing Competition ----------
// Blind judging is enforced HERE: manuscripts and identities live in
// separate tables joined only by `internal_token`. Identities are never
// exposed to judges (spec §6).

export const submissionImports = pgTable("submission_imports", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: varchar("filename", { length: 300 }).notNull(),
  importedBy: uuid("imported_by").notNull().references(() => users.id),
  importedAt: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  rowCount: integer("row_count").notNull().default(0),
  createdCount: integer("created_count").notNull().default(0),
  flaggedCount: integer("flagged_count").notNull().default(0),
  duplicateCount: integer("duplicate_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  themeYear: integer("theme_year").notNull(),
  notes: text("notes"),
});

export const submissionManuscripts = pgTable(
  "submission_manuscripts",
  {
    // The token is what judges reference. UUID chosen so it carries no info.
    internalToken: uuid("internal_token").primaryKey().defaultRandom(),
    importId: uuid("import_id").references(() => submissionImports.id),
    title: varchar("title", { length: 400 }).notNull(),
    content: text("content").notNull(),
    category: submissionCategoryEnum("category").notNull(),
    wordCount: integer("word_count").notNull().default(0),
    themeYear: integer("theme_year").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull(),
    flagged: boolean("flagged").notNull().default(false),
    flagReasons: jsonb("flag_reasons").notNull().default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("manuscripts_theme_year_idx").on(t.themeYear),
    index("manuscripts_category_idx").on(t.category),
  ]
);

export const submissionIdentities = pgTable(
  "submission_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // NB: this FK is the only bridge between identity and manuscript.
    // Judge-facing queries must NEVER join through this table.
    internalToken: uuid("internal_token")
      .notNull()
      .unique()
      .references(() => submissionManuscripts.internalToken, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    country: varchar("country", { length: 120 }),
    stateRegion: varchar("state_region", { length: 120 }),
    occupation: varchar("occupation", { length: 200 }),
    consentToPublish: publishConsentEnum("consent_to_publish").notNull().default("not_yet_asked"),
    consentToContact: boolean("consent_to_contact").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("identities_email_year_idx").on(t.email),
  ]
);

export const submissionScores = pgTable(
  "submission_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptToken: uuid("manuscript_token")
      .notNull()
      .references(() => submissionManuscripts.internalToken, { onDelete: "cascade" }),
    judgeId: uuid("judge_id").notNull().references(() => users.id),
    relevance: integer("relevance").notNull(),           // 0-10
    originality: integer("originality").notNull(),       // 0-10
    clarity: integer("clarity").notNull(),               // 0-10
    emotionalImpact: integer("emotional_impact").notNull(), // 0-10
    comments: text("comments"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("scores_manuscript_judge_idx").on(t.manuscriptToken, t.judgeId),
  ]
);

export const publishedEntries = pgTable(
  "published_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    manuscriptToken: uuid("manuscript_token")
      .notNull()
      .unique()
      .references(() => submissionManuscripts.internalToken),
    title: varchar("title", { length: 400 }).notNull(),
    author: varchar("author", { length: 200 }).notNull(), // may be "Anonymous"
    body: text("body").notNull(),
    excerpt: text("excerpt").notNull(),
    category: submissionCategoryEnum("category").notNull(),
    themeYear: integer("theme_year").notNull(),
    placement: varchar("placement", { length: 60 }), // "winner" | "runner-up" | "shortlisted"
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("published_year_idx").on(t.themeYear)]
);

// ---------- Impact metrics ----------

export const impactMetrics = pgTable("impact_metrics", {
  key: varchar("key", { length: 64 }).primaryKey(),
  label: varchar("label", { length: 200 }).notNull(),
  note: varchar("note", { length: 300 }),
  value: integer("value").notNull(),
  suffix: varchar("suffix", { length: 8 }).notNull().default(""),
  isManual: boolean("is_manual").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Contact messages ----------

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 120 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
});

// ---------- WhatsApp / community settings ----------

export const whatsappSettings = pgTable("whatsapp_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 200 }).notNull(),
  inviteUrl: varchar("invite_url", { length: 500 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------- Analytics ----------
// Lightweight, PII-free page-view + link-click tracking. We deliberately
// don't store IP, user agent, or Clerk userId — just the path viewed,
// the click target key, a short random session id (per browser tab), and
// same-origin referrer. Enough for real product decisions, nothing more.

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "page_view",
  "link_click",
]);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: analyticsEventTypeEnum("type").notNull(),
    path: varchar("path", { length: 500 }).notNull(),
    // For link_click: a slug describing the link (e.g. "sculptform-submit",
    // "whatsapp-cta", "crisis-help"). For page_view: empty string.
    target: varchar("target", { length: 200 }).notNull().default(""),
    // Short random id generated client-side (sessionStorage, per-tab).
    // Lets us de-duplicate double-fires and count unique sessions without
    // any cross-session tracking.
    sessionId: varchar("session_id", { length: 32 }).notNull().default(""),
    // Only stored when it's same-origin, to preserve referral chains
    // inside the site while never logging where visitors came from.
    referrer: varchar("referrer", { length: 500 }).notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("analytics_created_idx").on(t.createdAt),
    index("analytics_type_path_idx").on(t.type, t.path),
    index("analytics_target_idx").on(t.target),
  ]
);
