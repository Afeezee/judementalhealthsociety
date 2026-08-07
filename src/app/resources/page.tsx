import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { getResources, RESOURCE_CATEGORIES } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Resource Centre",
  description:
    "Evidence-based articles on mental health — for people struggling now, for those supporting someone else, and for learning and prevention.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = RESOURCE_CATEGORIES.find((c) => c.key === cat) ?? null;
  const all = await getResources();
  const filtered = active ? all.filter((r) => r.category === active.key) : all;

  return (
    <>
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
          <div className="section-rule mb-6 justify-center"><span>Resource Centre</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Words that make it easier to reach out — or reach in.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Short, evidence-based articles written for real Nigerian contexts.
            Choose the path that fits where you are today.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Category chooser */}
      <section aria-label="Categories" className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 md:pt-14">
        <div className="grid gap-4 md:grid-cols-3">
          {RESOURCE_CATEGORIES.map((c) => {
            const isActive = active?.key === c.key;
            return (
              <Link
                key={c.key}
                href={isActive ? "/resources" : `/resources?cat=${c.key}`}
                className={`block rounded-2xl border p-6 transition-colors ${
                  isActive
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-hairline bg-bg-surface hover:border-brand"
                }`}
                aria-pressed={isActive}
              >
                <div className="font-display text-lg font-medium">{c.label}</div>
                <p className="mt-2 text-sm text-fg-muted">{c.description}</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="text-fg-muted">
            Showing <strong className="text-fg">{filtered.length}</strong>{" "}
            article{filtered.length === 1 ? "" : "s"}
            {active && (
              <>
                {" "}in <strong className="text-fg">{active.label}</strong>
              </>
            )}
          </span>
          {active && (
            <Link href="/resources" className="text-brand font-semibold hover:text-brand-hover">
              Clear filter
            </Link>
          )}
        </div>
      </section>

      {/* Article grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => {
            const category = RESOURCE_CATEGORIES.find((c) => c.key === r.category);
            return (
              <Reveal key={r.slug} delayMs={i * 60} as="li">
                <Link
                  href={`/resources/${r.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] font-semibold">
                    <span className="text-brand">{category?.label}</span>
                    <span className="text-fg-muted">{r.readingMinutes} min</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-medium leading-snug group-hover:text-brand transition-colors">
                    {r.title}
                  </h2>
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed flex-1">
                    {r.excerpt}
                  </p>
                  <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-between text-xs text-fg-muted">
                    <span>{formatDate(r.publishedAt)}</span>
                    <span className="text-brand font-semibold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Read →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </>
  );
}
