import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ImpactCounter } from "@/components/ImpactCounter";
import { QuickPaths } from "@/components/QuickPaths";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PulseLine } from "@/components/PulseLine";
import { getAnnouncements, getHomeHero, getResources, getUpcomingLectures } from "@/lib/public-data";
import { COMPETITION } from "@/lib/site-settings";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function Home() {
  const [announcements, resources, upcomingLectures, hero] = await Promise.all([
    getAnnouncements(),
    getResources(),
    getUpcomingLectures(),
    getHomeHero(),
  ]);
  const latest = announcements.slice(0, 3);
  const featuredResources = resources.slice(0, 3);
  const teaserLectures = upcomingLectures.slice(0, 2);

  return (
    <>
      <Hero {...hero} />
      <ImpactCounter />

      {/* Latest from JMHS */}
      <section aria-labelledby="latest-heading" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 border-t border-hairline">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div className="max-w-2xl">
            <div className="section-rule mb-6"><span>Latest from JMHS</span></div>
            <h2 id="latest-heading" className="font-display text-3xl md:text-4xl font-medium">
              What's happening across the community right now.
            </h2>
          </div>
          <Link href="/announcements" className="text-sm font-semibold text-brand hover:text-brand-hover">
            All announcements →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal key={a.id} delayMs={i * 80}>
              <article className="h-full rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors">
                <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                  {a.category}
                </div>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed">{a.body}</p>
                <p className="mt-4 text-xs text-fg-muted">{formatDate(a.publishAt)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <QuickPaths />

      {/* Upcoming lectures teaser */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div className="max-w-2xl">
              <div className="section-rule mb-6" style={{ maxWidth: "22rem" }}><span>Monthly Mental Health Lecture</span></div>
              <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight">
                {teaserLectures.length > 1
                  ? "Two upcoming lectures. Save both dates."
                  : "Our next lecture is scheduled."}
              </h2>
              <p className="mt-4 text-fg-muted max-w-xl">
                Every month, experts across mental health share evidence-based
                knowledge with our community — free to attend.
              </p>
            </div>
            <Link href="/lectures" className="text-sm font-semibold text-brand hover:text-brand-hover">
              All lectures →
            </Link>
          </div>

          {teaserLectures.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-hairline bg-bg-surface p-10 text-center">
                <div className="font-display text-2xl font-medium">Announcement coming soon.</div>
                <p className="mt-3 text-fg-muted">The next lecture is being scheduled.</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {teaserLectures.map((l, i) => (
                <Reveal key={l.id} delayMs={i * 80}>
                  <article className={`rounded-2xl border-2 p-6 md:p-8 h-full ${
                    i === 0 ? "border-brand bg-brand/5" : "border-hairline bg-bg-surface"
                  }`}>
                    <div className="flex items-baseline gap-3">
                      <span className={`font-display text-5xl font-medium tabular-nums leading-none ${
                        i === 0 ? "text-brand" : "text-fg"
                      }`}>
                        {new Date(l.date).toLocaleDateString("en-GB", { day: "2-digit" })}
                      </span>
                      <span className="font-display text-lg font-medium">
                        {new Date(l.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div className="text-sm text-fg-muted mt-1">
                      {new Date(l.date).toLocaleDateString("en-GB", { weekday: "long" })}
                    </div>
                    <div className="mt-5 pt-5 border-t border-hairline">
                      <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                        {i === 0 ? "Next up" : "Coming after"}
                      </div>
                      <h3 className="mt-2 font-display text-xl font-medium leading-snug">
                        {l.topic ?? "Topic to be confirmed"}
                      </h3>
                      <p className="mt-2 text-sm text-fg-muted">
                        Speaker: <span className="text-fg font-medium">{l.speaker ?? "to be confirmed"}</span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <PulseLine variant="divider" />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured resources */}
      <section aria-labelledby="resources-heading" className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div className="max-w-2xl">
              <div className="section-rule mb-6"><span>Resource Centre</span></div>
              <h2 id="resources-heading" className="font-display text-3xl md:text-4xl font-medium">
                Words that make it easier to reach out — or reach in.
              </h2>
            </div>
            <Link href="/resources" className="text-sm font-semibold text-brand hover:text-brand-hover">
              Browse all resources →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredResources.map((r, i) => (
              <Reveal key={r.slug} delayMs={i * 80}>
                <Link
                  href={`/resources/${r.slug}`}
                  className="group block h-full rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors"
                >
                  <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                    {r.readingMinutes} min read
                  </div>
                  <h3 className="mt-3 font-display text-xl font-medium leading-snug group-hover:text-brand transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                    {r.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Writing competition teaser */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-3xl border border-hairline bg-gradient-to-br from-brand/8 to-transparent p-10 md:p-14">
            <div className="max-w-3xl">
              <div className="section-rule mb-6" style={{ maxWidth: "22rem" }}><span>JMHS National Writing Competition</span></div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium">
                Turn what you've lived through into something someone else needs to read.
              </h2>
              <p className="mt-5 text-fg-muted text-lg leading-relaxed max-w-2xl">
                Essays, poetry, short stories, spoken-word scripts, letters,
                personal reflections — nine categories, open to everyone. Every
                consenting entry becomes part of an advocacy library that
                reduces stigma and helps people feel less alone.
              </p>
              <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Submissions close</dt>
                  <dd className="mt-1 font-display text-2xl font-medium">{formatDate(COMPETITION.deadline)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Winners announced</dt>
                  <dd className="mt-1 font-display text-2xl font-medium">{formatDate(COMPETITION.announcement)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Live at</dt>
                  <dd className="mt-1 font-display text-2xl font-medium">September Lecture</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/competition"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors"
                >
                  How to enter
                </Link>
                <Link
                  href="/competition/entries"
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-base font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
                >
                  Read published entries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp community band */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="section-rule mb-4" style={{ maxWidth: "18rem" }}><span>Community</span></div>
            <h2 className="font-display text-2xl md:text-3xl font-medium">
              200+ people already gather here every week.
            </h2>
            <p className="mt-3 text-fg-muted">
              Students, professionals, practitioners, advocates, researchers.
              Come as you are.
            </p>
          </div>
          <WhatsAppButton size="lg" />
        </div>
      </section>
    </>
  );
}
