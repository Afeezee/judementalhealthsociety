import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle, Card, Stat, EmptyState } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Analytics" };
// Analytics is a live counter — never cache this page.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Range = 7 | 30 | 90;

function rangeFromQuery(v: string | string[] | undefined): Range {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return n === 7 || n === 90 ? n : 30;
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function labelShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * Inline SVG bar chart — no library, no client JS. Handles empty state
 * gracefully (returns a low-opacity flat baseline).
 */
function DailyBars({
  data,
  color,
}: {
  data: Array<{ day: string; label: string; count: number }>;
  color: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const W = 900;
  const H = 220;
  const pad = { top: 12, right: 8, bottom: 32, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const barW = chartW / data.length;
  // Show at most ~8 day labels so they don't overlap
  const labelStride = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Daily counts, max ${max}`}
        className="w-full h-auto min-w-[600px]"
      >
        {/* Y axis: 0 / mid / max */}
        {[0, max / 2, max].map((v, i) => {
          const y = pad.top + chartH - (v / max) * chartH;
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
              />
              <text
                x={pad.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="currentColor"
                fillOpacity={0.5}
              >
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barH = (d.count / max) * chartH;
          const x = pad.left + i * barW + 1;
          const y = pad.top + chartH - barH;
          return (
            <g key={d.day}>
              <rect
                x={x}
                y={y}
                width={Math.max(1, barW - 2)}
                height={Math.max(0, barH)}
                fill={color}
                opacity={d.count === 0 ? 0.15 : 0.9}
                rx={2}
              >
                <title>{`${d.label}: ${d.count}`}</title>
              </rect>
              {i % labelStride === 0 && (
                <text
                  x={x + barW / 2}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize={11}
                  fill="currentColor"
                  fillOpacity={0.6}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const gate = await requireRole("website_administrator");
  if (!gate.ok) redirect("/admin");

  const params = await searchParams;
  const range = rangeFromQuery(params.range);

  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (range - 1));

  // -------- Aggregate queries --------
  // Wrapped in try/catch so a missing analytics table (before db:push)
  // doesn't crash the whole admin dashboard.

  let totals = { pageViews: 0, linkClicks: 0, uniqueSessions: 0 };
  let daily: Array<{ day: string; label: string; count: number }> = [];
  let topPages: Array<{ path: string; count: number }> = [];
  let topLinks: Array<{ target: string; count: number }> = [];
  let tableMissing = false;

  try {
    // Neon HTTP driver returns { rows, rowCount, ... } — pull .rows out.
    const pvRes = await db.execute(
      sql`select count(*)::int as count from ${schema.analyticsEvents}
          where type = 'page_view' and created_at >= ${since}`
    );
    totals.pageViews = Number((pvRes.rows[0] as { count?: number })?.count ?? 0);

    const lcRes = await db.execute(
      sql`select count(*)::int as count from ${schema.analyticsEvents}
          where type = 'link_click' and created_at >= ${since}`
    );
    totals.linkClicks = Number((lcRes.rows[0] as { count?: number })?.count ?? 0);

    const usRes = await db.execute(
      sql`select count(distinct session_id)::int as count from ${schema.analyticsEvents}
          where session_id <> '' and created_at >= ${since}`
    );
    totals.uniqueSessions = Number((usRes.rows[0] as { count?: number })?.count ?? 0);

    const dailyRes = await db.execute(
      sql`select to_char(date_trunc('day', created_at at time zone 'UTC'), 'YYYY-MM-DD') as day,
                 count(*)::int as count
          from ${schema.analyticsEvents}
          where type = 'page_view' and created_at >= ${since}
          group by 1
          order by 1`
    );
    const dayMap = new Map<string, number>();
    for (const r of dailyRes.rows as Array<{ day: string; count: number }>) {
      dayMap.set(r.day, Number(r.count));
    }

    // Fill missing days with 0 so the chart has a continuous X axis.
    daily = [];
    for (let i = 0; i < range; i++) {
      const d = new Date(since);
      d.setUTCDate(d.getUTCDate() + i);
      const key = dayKey(d);
      daily.push({ day: key, label: labelShort(d), count: dayMap.get(key) ?? 0 });
    }

    const pagesRes = await db.execute(
      sql`select path, count(*)::int as count
          from ${schema.analyticsEvents}
          where type = 'page_view' and created_at >= ${since}
          group by 1 order by count desc, path asc limit 10`
    );
    topPages = (pagesRes.rows as Array<{ path: string; count: number }>).map((r) => ({
      path: r.path,
      count: Number(r.count),
    }));

    const linksRes = await db.execute(
      sql`select target, count(*)::int as count
          from ${schema.analyticsEvents}
          where type = 'link_click' and created_at >= ${since} and target <> ''
          group by 1 order by count desc, target asc limit 10`
    );
    topLinks = (linksRes.rows as Array<{ target: string; count: number }>).map((r) => ({
      target: r.target,
      count: Number(r.count),
    }));
  } catch {
    tableMissing = true;
  }

  return (
    <>
      <PageTitle
        kicker="Analytics"
        title="Traffic and engagement"
        description="PII-free page-view and link-click totals for the public site. Admin browsing is excluded from these numbers."
        actions={
          <div className="flex gap-1 rounded-full border border-hairline bg-bg-surface p-1">
            {([7, 30, 90] as Range[]).map((r) => (
              <a
                key={r}
                href={`/admin/analytics?range=${r}`}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  range === r
                    ? "bg-brand text-white"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                Last {r} days
              </a>
            ))}
          </div>
        }
      />

      {tableMissing ? (
        <EmptyState
          title="Analytics table not yet created"
          description="Run `npm run db:push` to add the analytics_events table. Once created, this dashboard will populate as visitors interact with the site."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3 mb-8">
            <Stat label="Page views" value={totals.pageViews.toLocaleString("en-GB")} hint={`Last ${range} days`} />
            <Stat label="Tracked link clicks" value={totals.linkClicks.toLocaleString("en-GB")} hint="Get Help, WhatsApp, Sculptform, etc." />
            <Stat label="Unique sessions" value={totals.uniqueSessions.toLocaleString("en-GB")} hint="Per-tab, no cross-session tracking" />
          </section>

          <section className="mb-10">
            <h2 className="font-display text-lg font-medium mb-3">
              Daily page views
            </h2>
            <Card>
              {totals.pageViews === 0 ? (
                <p className="text-sm text-fg-muted py-8 text-center">
                  No page views yet in this range. Data starts arriving as
                  soon as a visitor navigates the public site.
                </p>
              ) : (
                <div className="text-brand">
                  <DailyBars data={daily} color="currentColor" />
                </div>
              )}
            </Card>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="font-display text-lg font-medium mb-3">
                Top pages
              </h2>
              <Card className="p-0 overflow-hidden">
                {topPages.length === 0 ? (
                  <p className="text-sm text-fg-muted p-6 text-center">
                    No page views yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-hairline">
                    {topPages.map((p) => (
                      <li key={p.path} className="flex items-center justify-between px-5 py-3 gap-4">
                        <span className="truncate font-mono text-xs text-fg-muted">
                          {p.path}
                        </span>
                        <span className="tabular-nums font-semibold text-fg shrink-0">
                          {p.count.toLocaleString("en-GB")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium mb-3">
                Top link clicks
              </h2>
              <Card className="p-0 overflow-hidden">
                {topLinks.length === 0 ? (
                  <p className="text-sm text-fg-muted p-6 text-center">
                    No tracked link clicks yet. Only links with a
                    <code className="mx-1 rounded bg-bg px-1 py-0.5 text-[10px]">data-track</code>
                    attribute are logged.
                  </p>
                ) : (
                  <ul className="divide-y divide-hairline">
                    {topLinks.map((l) => {
                      const [key, href] = l.target.split("|");
                      return (
                        <li key={l.target} className="flex items-center justify-between px-5 py-3 gap-4">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{key}</div>
                            {href && (
                              <div className="text-[11px] font-mono text-fg-muted truncate">
                                {href}
                              </div>
                            )}
                          </div>
                          <span className="tabular-nums font-semibold text-fg shrink-0">
                            {l.count.toLocaleString("en-GB")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </section>
          </div>
        </>
      )}
    </>
  );
}
