import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { getAnnouncements } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Everything happening at JMHS — the Writing Competition, Monthly Lectures, community events, and more.",
};

const CATEGORIES = ["Competition", "Lectures", "General", "Community"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = CATEGORIES.find((c) => c === cat) ?? null;
  const list = await getAnnouncements();
  const filtered = active ? list.filter((a) => a.category === active) : list;

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="section-rule mb-6 justify-center"><span>Announcements</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Everything happening across JMHS.
          </h1>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Link
            href="/announcements"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              !active
                ? "bg-brand text-white border-brand"
                : "bg-bg-surface text-fg-muted border-hairline hover:border-brand hover:text-brand"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/announcements?cat=${c}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active === c
                  ? "bg-brand text-white border-brand"
                  : "bg-bg-surface text-fg-muted border-hairline hover:border-brand hover:text-brand"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <ul className="space-y-4">
          {filtered.map((a) => (
            <li key={a.id}>
              <article className="rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-semibold">
                  <span className="text-brand">{a.category}</span>
                  <span className="text-fg-muted">{formatDate(a.publishAt)}</span>
                </div>
                <h2 className="mt-3 font-display text-xl md:text-2xl font-medium leading-snug">
                  {a.title}
                </h2>
                <p className="mt-3 text-fg-muted leading-relaxed">{a.body}</p>
              </article>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-xl border border-hairline bg-bg-surface p-8 text-center text-fg-muted">
              No announcements in this category yet.
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
