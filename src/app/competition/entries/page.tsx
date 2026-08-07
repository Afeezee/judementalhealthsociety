import type { Metadata } from "next";
import Link from "next/link";
import { PUBLISHED_ENTRIES } from "@/lib/seed-content";
import { COMPETITION } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Published Entries — Writing Competition",
  description:
    "Winners and shortlisted entries from the JMHS National Writing Competition. Filter by year, theme, and category.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function EntriesPage() {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Published entries</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            A growing library of honest writing on mental health.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl leading-relaxed">
            Winning and shortlisted entries appear here the week after each
            year's announcement. Every author has personally consented to
            publication.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
        {PUBLISHED_ENTRIES.length === 0 ? (
          <div className="rounded-2xl border border-hairline bg-bg-surface p-10 md:p-16 text-center">
            <div className="font-display text-2xl md:text-3xl font-medium">
              The first entries will appear here soon.
            </div>
            <p className="mt-4 text-fg-muted max-w-xl mx-auto leading-relaxed">
              Winners of the {new Date(COMPETITION.announcement).getFullYear()}{" "}
              JMHS National Writing Competition will be announced on{" "}
              <strong className="text-fg">{formatDate(COMPETITION.announcement)}</strong>,
              live at our September Monthly Lecture. Selected entries will be
              published the following week.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/competition"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
              >
                About the competition
              </Link>
              <Link
                href="/competition/submit"
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
              >
                Enter this year
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {PUBLISHED_ENTRIES.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/competition/entries/${e.slug}`}
                  className="group block h-full rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-semibold">
                    <span className="text-brand">{e.category.replace("-", " ")}</span>
                    <span className="text-fg-muted">{e.themeYear}</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-medium group-hover:text-brand transition-colors">
                    {e.title}
                  </h2>
                  <p className="mt-2 text-sm text-fg-muted">by {e.author}</p>
                  <p className="mt-4 text-sm text-fg-muted leading-relaxed">
                    {e.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
