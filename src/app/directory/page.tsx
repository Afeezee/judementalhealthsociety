import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { CrisisButton } from "@/components/CrisisButton";
import { getVerifiedDirectory } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Professional Support Directory",
  description:
    "A verified list of mental health professionals JMHS members can reach out to. Psychiatrists, psychologists, trauma specialists — each entry personally reviewed.",
};

const COST_LABEL: Record<string, string> = {
  "free": "Free",
  "low-cost": "Low cost",
  "paid": "Paid",
  "contact-for-details": "Contact for details",
};

export default async function DirectoryPage() {
  const verified = await getVerifiedDirectory();

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="section-rule mb-6 justify-center"><span>Professional Support Directory</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Real people. Real credentials. Verified by us.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Every practitioner listed here has been personally verified by
            JMHS. This directory is growing — if you're a professional who
            would like to be listed, get in touch.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Directory grid */}
      <section aria-labelledby="listings-heading" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 id="listings-heading" className="font-display text-2xl font-medium">
              {verified.length} verified professional{verified.length === 1 ? "" : "s"}
            </h2>
            <p className="text-sm text-fg-muted mt-1">
              More listings are added as we verify them.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
          >
            Suggest a professional
          </Link>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {verified.map((d, i) => (
            <Reveal key={d.id} delayMs={i * 60} as="li">
              <div className="flex flex-col h-full rounded-2xl border border-hairline bg-bg-surface p-6">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-brand">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                  Verified
                </div>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug">{d.name}</h3>
                <div className="mt-1 text-sm text-fg font-medium">{d.credentials}</div>
                <div className="mt-3 text-sm text-fg-muted">
                  <div><span className="text-fg font-medium">Affiliation:</span> {d.affiliation}</div>
                  {d.location && (
                    <div className="mt-1"><span className="text-fg font-medium">Location:</span> {d.location}</div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-hairline flex items-center justify-between text-xs">
                  <span className="rounded-full bg-brand/10 text-brand px-2.5 py-0.5 font-semibold">
                    {COST_LABEL[d.costTier]}
                  </span>
                  <Link
                    href="/contact"
                    className="font-semibold text-brand hover:text-brand-hover"
                  >
                    Request contact →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Safety footer */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 md:py-16">
          <div className="rounded-2xl border border-signal-red/30 bg-signal-red/5 p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">
              In a crisis right now?
            </div>
            <p className="mt-3 text-fg leading-relaxed">
              Do not wait for a directory contact to reach you. Go straight to
              our emergency support page.
            </p>
            <div className="mt-5">
              <CrisisButton />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
