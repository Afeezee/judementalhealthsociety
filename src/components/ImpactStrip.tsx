import { getImpactMetrics } from "@/lib/public-data";

/** Condensed impact strip used in the footer (spec §2.10). */
export async function ImpactStrip() {
  const metrics = await getImpactMetrics();
  return (
    <div className="border-b border-hairline bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.key} className="flex flex-col">
            <span className="font-display text-xl font-semibold text-fg tabular-nums">
              {m.value.toLocaleString()}
              <span className="text-brand">{m.suffix}</span>
            </span>
            <span className="text-[11px] uppercase tracking-wider text-fg-muted">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
