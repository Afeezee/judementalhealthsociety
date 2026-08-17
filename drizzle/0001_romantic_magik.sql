CREATE TYPE "public"."analytics_event_type" AS ENUM('page_view', 'link_click');--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "analytics_event_type" NOT NULL,
	"path" varchar(500) NOT NULL,
	"target" varchar(200) DEFAULT '' NOT NULL,
	"session_id" varchar(32) DEFAULT '' NOT NULL,
	"referrer" varchar(500) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "analytics_created_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_type_path_idx" ON "analytics_events" USING btree ("type","path");--> statement-breakpoint
CREATE INDEX "analytics_target_idx" ON "analytics_events" USING btree ("target");