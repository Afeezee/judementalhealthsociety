CREATE TYPE "public"."announcement_category" AS ENUM('Competition', 'Lectures', 'General', 'Community');--> statement-breakpoint
CREATE TYPE "public"."competition_status" AS ENUM('not_open', 'submissions_open', 'judging', 'winners_announced');--> statement-breakpoint
CREATE TYPE "public"."directory_cost_tier" AS ENUM('free', 'low-cost', 'paid', 'contact-for-details');--> statement-breakpoint
CREATE TYPE "public"."directory_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."forum_flag_status" AS ENUM('open', 'reviewed_kept', 'reviewed_removed');--> statement-breakpoint
CREATE TYPE "public"."publish_consent" AS ENUM('not_yet_asked', 'granted_with_name', 'granted_anonymously', 'declined');--> statement-breakpoint
CREATE TYPE "public"."resource_category" AS ENUM('struggling-right-now', 'supporting-someone-else', 'learning-and-prevention');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'website_administrator', 'competition_coordinator', 'content_editor', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."submission_category" AS ENUM('poetry', 'short-story', 'essay', 'personal-narrative');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"body" text NOT NULL,
	"category" "announcement_category" NOT NULL,
	"publish_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"strip" boolean DEFAULT false NOT NULL,
	"href" varchar(500),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "announcements_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"topic" varchar(120) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directory_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"name" varchar(200) NOT NULL,
	"credentials" varchar(300) NOT NULL,
	"affiliation" varchar(300) NOT NULL,
	"location" varchar(200),
	"contact" varchar(300),
	"cost_tier" "directory_cost_tier" DEFAULT 'contact-for-details' NOT NULL,
	"status" "directory_status" DEFAULT 'pending' NOT NULL,
	"submitted_by" varchar(255),
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "directory_listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "forum_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"reporter_id" uuid,
	"reason" text NOT NULL,
	"status" "forum_flag_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"body" text NOT NULL,
	"author_id" uuid NOT NULL,
	"edited_at" timestamp with time zone,
	"removed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(300) NOT NULL,
	"category" varchar(64) NOT NULL,
	"sensitive" boolean DEFAULT false NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impact_metrics" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"label" varchar(200) NOT NULL,
	"note" varchar(300),
	"value" integer NOT NULL,
	"suffix" varchar(8) DEFAULT '' NOT NULL,
	"is_manual" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lectures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"topic" varchar(300),
	"speaker" varchar(200),
	"join_link" varchar(500),
	"recording_url" varchar(500),
	"summary" text,
	"is_next" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "published_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(300) NOT NULL,
	"manuscript_token" uuid NOT NULL,
	"title" varchar(400) NOT NULL,
	"author" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" "submission_category" NOT NULL,
	"theme_year" integer NOT NULL,
	"placement" varchar(60),
	"published_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "published_entries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "published_entries_manuscript_token_unique" UNIQUE("manuscript_token")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"category" "resource_category" NOT NULL,
	"reading_minutes" integer DEFAULT 5 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author" varchar(200),
	"published_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"internal_token" uuid NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(60),
	"country" varchar(120),
	"state_region" varchar(120),
	"occupation" varchar(200),
	"consent_to_publish" "publish_consent" DEFAULT 'not_yet_asked' NOT NULL,
	"consent_to_contact" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submission_identities_internal_token_unique" UNIQUE("internal_token")
);
--> statement-breakpoint
CREATE TABLE "submission_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(300) NOT NULL,
	"imported_by" uuid NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_count" integer DEFAULT 0 NOT NULL,
	"created_count" integer DEFAULT 0 NOT NULL,
	"flagged_count" integer DEFAULT 0 NOT NULL,
	"duplicate_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"theme_year" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "submission_manuscripts" (
	"internal_token" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_id" uuid,
	"title" varchar(400) NOT NULL,
	"content" text NOT NULL,
	"category" "submission_category" NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"theme_year" integer NOT NULL,
	"submitted_at" timestamp with time zone NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	"flag_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manuscript_token" uuid NOT NULL,
	"judge_id" uuid NOT NULL,
	"relevance" integer NOT NULL,
	"originality" integer NOT NULL,
	"clarity" integer NOT NULL,
	"emotional_impact" integer NOT NULL,
	"comments" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(128) NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(200),
	"role" "user_role" DEFAULT 'content_editor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(200) NOT NULL,
	"invite_url" varchar(500) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_listings" ADD CONSTRAINT "directory_listings_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_flags" ADD CONSTRAINT "forum_flags_post_id_forum_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_flags" ADD CONSTRAINT "forum_flags_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "published_entries" ADD CONSTRAINT "published_entries_manuscript_token_submission_manuscripts_internal_token_fk" FOREIGN KEY ("manuscript_token") REFERENCES "public"."submission_manuscripts"("internal_token") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_identities" ADD CONSTRAINT "submission_identities_internal_token_submission_manuscripts_internal_token_fk" FOREIGN KEY ("internal_token") REFERENCES "public"."submission_manuscripts"("internal_token") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_imports" ADD CONSTRAINT "submission_imports_imported_by_users_id_fk" FOREIGN KEY ("imported_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_manuscripts" ADD CONSTRAINT "submission_manuscripts_import_id_submission_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."submission_imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_scores" ADD CONSTRAINT "submission_scores_manuscript_token_submission_manuscripts_internal_token_fk" FOREIGN KEY ("manuscript_token") REFERENCES "public"."submission_manuscripts"("internal_token") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_scores" ADD CONSTRAINT "submission_scores_judge_id_users_id_fk" FOREIGN KEY ("judge_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcements_publish_idx" ON "announcements" USING btree ("publish_at");--> statement-breakpoint
CREATE INDEX "directory_status_idx" ON "directory_listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "forum_posts_thread_idx" ON "forum_posts" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "published_year_idx" ON "published_entries" USING btree ("theme_year");--> statement-breakpoint
CREATE INDEX "resources_category_idx" ON "resources" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "identities_email_year_idx" ON "submission_identities" USING btree ("email");--> statement-breakpoint
CREATE INDEX "manuscripts_theme_year_idx" ON "submission_manuscripts" USING btree ("theme_year");--> statement-breakpoint
CREATE INDEX "manuscripts_category_idx" ON "submission_manuscripts" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "scores_manuscript_judge_idx" ON "submission_scores" USING btree ("manuscript_token","judge_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");