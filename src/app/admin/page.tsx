import Link from "next/link";
import { db, schema } from "@/db/client";
import { count, eq, gte, isNull } from "drizzle-orm";
import { PageTitle, Card, Stat, EmptyState } from "@/components/AdminChrome";
import { getCurrentDbUser } from "@/lib/auth";
import { COMPETITION } from "@/lib/site-settings";

export const metadata = { title: "Admin overview" };

export default async function AdminOverview() {
  const user = await getCurrentDbUser();

  const [
    [{ n: announcementCount }],
    [{ n: resourceCount }],
    [{ n: directoryCount }],
    [{ n: directoryPending }],
    [{ n: lectureCount }],
    [{ n: submissionCount }],
    [{ n: openFlags }],
    [{ n: contactUnanswered }],
    nextLectureRows,
  ] = await Promise.all([
    db.select({ n: count() }).from(schema.announcements),
    db.select({ n: count() }).from(schema.resources),
    db.select({ n: count() }).from(schema.directoryListings),
    db.select({ n: count() }).from(schema.directoryListings).where(eq(schema.directoryListings.status, "pending")),
    db.select({ n: count() }).from(schema.lectures),
    db.select({ n: count() }).from(schema.submissionManuscripts).where(gte(schema.submissionManuscripts.themeYear, new Date().getFullYear())),
    db.select({ n: count() }).from(schema.forumFlags).where(eq(schema.forumFlags.status, "open")),
    db.select({ n: count() }).from(schema.contactMessages).where(isNull(schema.contactMessages.respondedAt)),
    db.select().from(schema.lectures).where(eq(schema.lectures.isNext, true)).limit(1),
  ]);

  const nextLecture = nextLectureRows[0];

  return (
    <>
      <PageTitle
        kicker="Overview"
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.`}
        description="A snapshot of what's happening across JMHS. Everything shown here reflects live database state."
      />

      {/* Alerts */}
      {(directoryPending > 0 || openFlags > 0 || contactUnanswered > 0) && (
        <section aria-label="Pending moderation" className="mb-8 grid gap-3 sm:grid-cols-3">
          {directoryPending > 0 && (
            <Card className="border-brand/30 bg-brand/5">
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                Directory
              </div>
              <div className="mt-2 font-medium">
                {directoryPending} pending listing{directoryPending === 1 ? "" : "s"} awaiting verification
              </div>
              <Link href="/admin/directory?status=pending" className="mt-2 inline-block text-sm text-brand font-semibold">
                Review →
              </Link>
            </Card>
          )}
          {openFlags > 0 && (
            <Card className="border-signal-red/30 bg-signal-red/5">
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">
                Forum
              </div>
              <div className="mt-2 font-medium">
                {openFlags} open moderation flag{openFlags === 1 ? "" : "s"}
              </div>
              <Link href="/admin/forum" className="mt-2 inline-block text-sm text-signal-red font-semibold">
                Review →
              </Link>
            </Card>
          )}
          {contactUnanswered > 0 && (
            <Card>
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-fg-muted">
                Contact
              </div>
              <div className="mt-2 font-medium">
                {contactUnanswered} unanswered enquir{contactUnanswered === 1 ? "y" : "ies"}
              </div>
              <Link href="/admin/settings" className="mt-2 inline-block text-sm text-brand font-semibold">
                Review →
              </Link>
            </Card>
          )}
        </section>
      )}

      {/* Numbers */}
      <section aria-labelledby="numbers" className="mb-8">
        <h2 id="numbers" className="sr-only">Content overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Announcements" value={announcementCount} />
          <Stat label="Resource articles" value={resourceCount} />
          <Stat label="Directory listings" value={directoryCount} hint={`${directoryPending} pending`} />
          <Stat label="Lectures logged" value={lectureCount} />
          <Stat label="Submissions this year" value={submissionCount} hint={`Deadline ${COMPETITION.deadline}`} />
          <Stat label="Open forum flags" value={openFlags} />
          <Stat label="Contact enquiries" value={contactUnanswered} hint="unanswered" />
        </div>
      </section>

      {/* Next lecture */}
      <section aria-labelledby="next-lecture" className="mb-8">
        <h2 id="next-lecture" className="font-display text-lg font-medium mb-3">
          Next lecture
        </h2>
        {nextLecture ? (
          <Card>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] items-center">
              <div className="font-display text-2xl font-semibold text-brand tabular-nums">
                {new Date(nextLecture.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
              <div>
                <div className="font-medium">{nextLecture.topic ?? "Topic to be confirmed"}</div>
                <div className="text-sm text-fg-muted">{nextLecture.speaker ?? "Speaker to be confirmed"}</div>
              </div>
              <Link href="/admin/lectures" className="text-sm font-semibold text-brand hover:text-brand-hover">
                Manage →
              </Link>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No lecture scheduled"
            description="Add the next Monthly Lecture from the Lectures panel."
            action={<Link href="/admin/lectures" className="text-brand font-semibold">Add a lecture →</Link>}
          />
        )}
      </section>

      {/* Competition status */}
      <section aria-labelledby="competition" className="mb-8">
        <h2 id="competition" className="font-display text-lg font-medium mb-3">
          Writing Competition
        </h2>
        <Card>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-muted">Status</div>
              <div className="mt-1 font-medium capitalize">{COMPETITION.status.replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-muted">Submissions deadline</div>
              <div className="mt-1 font-medium">{COMPETITION.deadline}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-muted">Winners announced</div>
              <div className="mt-1 font-medium">{COMPETITION.announcement}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/competition/import"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Import submissions from Sculptform
            </Link>
            <Link
              href="/admin/competition"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-fg hover:border-brand hover:text-brand"
            >
              Manage competition
            </Link>
          </div>
        </Card>
      </section>
    </>
  );
}
