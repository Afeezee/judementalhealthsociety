import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getUpcomingLectures, getPastLectures } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Monthly Mental Health Lecture Series",
  description:
    "Every month, experts from across mental health share evidence-based knowledge on the issues affecting our community. JMHS's flagship programme.",
};

function fmtDay(iso: string)   { return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit" }); }
function fmtMonth(iso: string) { return new Date(iso).toLocaleDateString("en-GB", { month: "long" }); }
function fmtYear(iso: string)  { return new Date(iso).toLocaleDateString("en-GB", { year: "numeric" }); }
function fmtWeekday(iso: string) { return new Date(iso).toLocaleDateString("en-GB", { weekday: "long" }); }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function LecturesPage() {
  const [upcoming, past] = await Promise.all([getUpcomingLectures(), getPastLectures()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 30%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="section-rule mb-6 justify-center"><span>Monthly Mental Health Lecture Series</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Evidence-based knowledge, delivered by the people who know it best.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            JMHS's flagship programme brings experts across psychiatry,
            psychology, trauma care, and lived-experience advocacy together with
            our community — once every month.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Upcoming lectures */}
      <section aria-labelledby="upcoming-heading" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Upcoming lectures</span></div>
        <h2 id="upcoming-heading" className="font-display text-3xl md:text-4xl font-medium mb-8">
          {upcoming.length > 1
            ? "The next two are already on the calendar."
            : "Save the date."}
        </h2>

        {upcoming.length === 0 ? (
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-bg-surface p-10 text-center">
              <div className="font-display text-2xl font-medium">
                We're between lectures right now.
              </div>
              <p className="mt-3 text-fg-muted max-w-xl mx-auto">
                Join our WhatsApp community to be the first to know when the next
                one is scheduled.
              </p>
              <div className="mt-6 flex justify-center"><WhatsAppButton /></div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {upcoming.map((l, i) => (
              <Reveal key={l.id} delayMs={i * 80}>
                <article className={`rounded-2xl border-2 p-8 h-full flex flex-col ${
                  i === 0 ? "border-brand bg-brand/5" : "border-hairline bg-bg-surface"
                }`}>
                  <div className="flex items-baseline gap-3">
                    <span className={`font-display text-5xl font-medium tabular-nums leading-none ${
                      i === 0 ? "text-brand" : "text-fg"
                    }`}>
                      {fmtDay(l.date)}
                    </span>
                    <span className="font-display text-lg font-medium">
                      {fmtMonth(l.date)} {fmtYear(l.date)}
                    </span>
                  </div>
                  <div className="text-sm text-fg-muted mt-1">{fmtWeekday(l.date)}</div>

                  <div className="mt-6 pt-6 border-t border-hairline">
                    <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                      {i === 0 ? "Next up" : "Coming after"}
                    </div>
                    <h3 className="mt-2 font-display text-xl md:text-2xl font-medium leading-snug">
                      {l.topic ?? "Topic to be confirmed"}
                    </h3>
                    <p className="mt-3 text-sm text-fg-muted">
                      Speaker: <span className="text-fg font-medium">{l.speaker ?? "to be confirmed"}</span>
                    </p>
                    {l.summary && (
                      <p className="mt-3 text-sm text-fg leading-relaxed">{l.summary}</p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {l.joinLink ? (
                      <a
                        href={l.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                          i === 0
                            ? "bg-brand text-white hover:bg-brand-hover"
                            : "border border-hairline text-fg hover:border-brand hover:text-brand"
                        }`}
                      >
                        Join link
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-hairline px-4 py-2 text-xs text-fg-muted">
                        Joining details coming soon
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Archive */}
      <section id="archive" aria-labelledby="archive-heading" className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Lecture archive</span></div>
          <h2 id="archive-heading" className="font-display text-3xl md:text-4xl font-medium mb-8">
            Every lecture, saved for the people who couldn't be there live.
          </h2>

          {past.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-hairline bg-bg-surface p-10 md:p-14 text-center">
                <div className="font-display text-2xl font-medium">
                  The archive is being built.
                </div>
                <p className="mt-3 text-fg-muted max-w-xl mx-auto">
                  Recordings, summaries, and speaker notes from past lectures
                  will live here as we publish them.
                </p>
              </div>
            </Reveal>
          ) : (
            <ul className="grid gap-4">
              {past.map((l) => (
                <li
                  key={l.id}
                  className="rounded-xl border border-hairline bg-bg-surface p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wider text-fg-muted">
                      {formatDate(l.date)}
                    </div>
                    <div className="mt-1 font-display text-lg font-medium">
                      {l.topic ?? "Topic to be confirmed"}
                    </div>
                    {l.speaker && (
                      <div className="mt-1 text-sm text-fg-muted">{l.speaker}</div>
                    )}
                  </div>
                  {l.recordingUrl && (
                    <a
                      href={l.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
                    >
                      Watch recording →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
