import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource, getResources, RESOURCE_CATEGORIES } from "@/lib/public-data";
import { RenderMarkdown } from "@/lib/md";
import { CrisisButton } from "@/components/CrisisButton";

// Dynamic — DB-backed. generateStaticParams removed so admin edits appear
// without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const r = await getResource(slug);
  if (!r) return {};
  return { title: r.title, description: r.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function ResourceArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getResource(slug);
  if (!article) return notFound();
  const category = RESOURCE_CATEGORIES.find((c) => c.key === article.category);
  const all = await getResources();
  const related = all
    .filter((r) => r.category === article.category && r.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-hairline">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
            <nav aria-label="Breadcrumb" className="text-sm text-fg-muted mb-6">
              <Link href="/resources" className="hover:text-fg">
                Resource Centre
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/resources?cat=${article.category}`}
                className="hover:text-fg"
              >
                {category?.label}
              </Link>
            </nav>
            <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
              <span className="text-brand font-semibold uppercase tracking-wider text-[11px]">
                {category?.label}
              </span>
              <span>{article.readingMinutes} min read</span>
              <span>Published {formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 md:py-14">
          <div className="prose prose-neutral max-w-none">
            <RenderMarkdown body={article.body} />
          </div>

          {/* Safety footer specific to each article */}
          <div className="mt-12 rounded-2xl border border-signal-red/30 bg-signal-red/5 p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">
              A note on safety
            </div>
            <p className="mt-3 text-fg leading-relaxed">
              This article is educational and does not replace professional
              care. If you or someone else is in immediate danger, please reach
              out for help right now.
            </p>
            <div className="mt-5">
              <CrisisButton />
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-hairline px-3 py-1 text-xs text-fg-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-hairline bg-bg-elevated">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
            <h2 className="font-display text-2xl font-medium mb-6">
              More in {category?.label}
            </h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/resources/${r.slug}`}
                    className="group block h-full rounded-2xl border border-hairline bg-bg-surface p-6 hover:border-brand transition-colors"
                  >
                    <h3 className="font-display text-lg font-medium leading-snug group-hover:text-brand transition-colors">
                      {r.title}
                    </h3>
                    <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                      {r.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
