import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PUBLISHED_ENTRIES } from "@/lib/seed-content";
import { RenderMarkdown } from "@/lib/md";

export function generateStaticParams() {
  return PUBLISHED_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const e = PUBLISHED_ENTRIES.find((x) => x.slug === slug);
  if (!e) return {};
  return { title: `${e.title} — by ${e.author}`, description: e.excerpt };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = PUBLISHED_ENTRIES.find((e) => e.slug === slug);
  if (!entry) return notFound();

  return (
    <article>
      <header className="border-b border-hairline">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-fg-muted mb-6">
            <Link href="/competition/entries" className="hover:text-fg">
              Published Entries
            </Link>
            <span className="mx-2">/</span>
            <span>{entry.themeYear}</span>
          </nav>
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
            {entry.category.replace("-", " ")} · {entry.themeYear}
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            {entry.title}
          </h1>
          <p className="mt-4 text-fg-muted">by <span className="text-fg font-medium">{entry.author}</span></p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-14">
        <div className="prose prose-neutral max-w-none">
          <RenderMarkdown body={entry.body} />
        </div>
      </div>
    </article>
  );
}
