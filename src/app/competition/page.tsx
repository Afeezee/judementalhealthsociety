import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { COMPETITION } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "JMHS National Writing Competition",
  description:
    "An annual advocacy programme that turns lived experience into writing that reduces stigma and helps people feel less alone. Poetry, essays, short stories, and personal narratives.",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "To be announced";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const STATUS_COPY: Record<typeof COMPETITION.status, {
  label: string;
  message: string;
  tone: "open" | "judging" | "announced";
}> = {
  not_open: {
    label: "Not yet open",
    message: "The next call for submissions is being prepared.",
    tone: "judging",
  },
  submissions_open: {
    label: "Submissions open",
    message: `The submission portal is live. Deadline: ${formatDate(COMPETITION.deadline)}.`,
    tone: "open",
  },
  judging: {
    label: "Judging in progress",
    message: "Submissions are closed. Our judges are reviewing entries blindly — winners will be announced at the September lecture.",
    tone: "judging",
  },
  winners_announced: {
    label: "Winners announced",
    message: "The 2026 winners have been announced. Published entries are available in the archive.",
    tone: "announced",
  },
};

const CATEGORIES = [
  { key: "poetry", label: "Poetry" },
  { key: "short-story", label: "Short Story" },
  { key: "essay", label: "Essay" },
  { key: "personal-narrative", label: "Personal Narrative" },
];

const RULES = [
  "Submissions must be your own original, unpublished work.",
  "One entry per person, per category.",
  "Word limits vary by category — check the Participant Pack before you submit.",
  "Entries must be relevant to the year's theme and centred on mental health.",
  "No graphic descriptions of self-harm or suicide methods — refer to our safe-writing guidelines.",
  "All identifying information is stripped from your entry before judges see it. Judging is fully blind.",
  "By submitting, you consent to publication under your name if selected. You can withdraw consent up until the announcement date.",
];

const FAQ = [
  {
    q: "Who can enter?",
    a: "Anyone aged 16 and above. You do not need to be Nigerian, and you do not need to be a JMHS member — though we'd love it if you joined the community.",
  },
  {
    q: "How is judging done?",
    a: "Every entry is judged blind — your identity is removed at the moment your submission is imported. A panel of three judges scores each shortlisted entry on relevance, originality, clarity, and emotional impact, with a documented tie-break process.",
  },
  {
    q: "How and when will I know if I've won?",
    a: `Winners are contacted privately before the public announcement, which happens live at our September Monthly Lecture on ${formatDate(COMPETITION.announcement)}. All shortlisted authors are told the outcome regardless of placement.`,
  },
  {
    q: "Will my entry be published?",
    a: "Winning entries and select shortlisted pieces are published on this site the week after the announcement. You always control whether your name appears; anonymous publication is available.",
  },
  {
    q: "What are the prizes?",
    a: COMPETITION.prizes
      ? COMPETITION.prizes
      : "Prizes are finalised annually by the Organising Committee and will be announced before the competition opens. In every year, published authors also gain a byline on a growing advocacy library.",
  },
];

export default function CompetitionPage() {
  const status = STATUS_COPY[COMPETITION.status];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 25%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 md:py-28">
          <div className="section-rule mb-6" style={{ maxWidth: "26rem" }}><span>JMHS National Writing Competition</span></div>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] max-w-4xl">
            Turn what you've lived through into something someone else needs to read.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-2xl leading-relaxed">
            An annual advocacy programme that grows JMHS's library of writing on
            mental health — one carefully judged, honestly published entry at a
            time.
          </p>

          {/* Status banner */}
          <div
            className={`mt-8 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold ${
              status.tone === "open"
                ? "bg-brand text-white"
                : status.tone === "announced"
                ? "bg-signal-red text-white"
                : "bg-bg-elevated text-fg border border-hairline"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                status.tone === "open" ? "bg-white animate-pulse" : "bg-current"
              }`}
              aria-hidden="true"
            />
            {status.label}
          </div>
          <p className="mt-3 text-fg-muted max-w-2xl">{status.message}</p>

          {/* Timeline strip */}
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-hairline pt-8">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Opens</dt>
              <dd className="mt-1 font-display text-xl font-medium">{formatDate(COMPETITION.opens)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Submissions close</dt>
              <dd className="mt-1 font-display text-xl font-medium">{formatDate(COMPETITION.deadline)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Winners announced</dt>
              <dd className="mt-1 font-display text-xl font-medium">{formatDate(COMPETITION.announcement)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Publication</dt>
              <dd className="mt-1 font-display text-xl font-medium">{COMPETITION.publication}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/competition/submit"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors"
            >
              Enter the competition
            </Link>
            <Link
              href="/competition/entries"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-base font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
            >
              Read published entries
            </Link>
          </div>

          <div className="mt-10">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "14rem" }}><span>This year's theme</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight">
          Every Word Can Make a Difference. Every Voice Matters.
        </h2>
        <p className="mt-5 text-lg text-fg-muted leading-relaxed">
          A theme is not a prompt — it's a compass. We're looking for writing
          that treats mental health with the honesty and care Jude's memory
          deserves. Write towards what changes when the silence breaks.
        </p>
      </section>

      {/* Categories */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="section-rule mb-6" style={{ maxWidth: "14rem" }}><span>Categories</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-10 max-w-2xl">
            Four ways to write. Choose the one your voice fits best.
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.key} delayMs={i * 60} as="li">
                <div className="rounded-2xl border border-hairline bg-bg-surface p-6 h-full">
                  <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                    Category
                  </div>
                  <div className="mt-2 font-display text-xl font-medium">{c.label}</div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Rules */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Rules</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
          The rules are short. Read them twice.
        </h2>
        <ol className="grid gap-3">
          {RULES.map((r, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
              <span className="font-display text-2xl font-medium text-brand tabular-nums shrink-0 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-fg leading-relaxed pt-1">{r}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "6rem" }}><span>FAQ</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
            The questions we hear most.
          </h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-hairline bg-bg-surface p-5 open:border-brand"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-display text-lg font-medium">{f.q}</span>
                  <span className="text-brand transition-transform group-open:rotate-45 text-2xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-fg-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Coordinators */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "16rem" }}><span>Competition coordinators</span></div>
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">
          The people running this year's competition.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {COMPETITION.coordinators.map((c) => (
            <div key={c} className="rounded-xl border border-hairline bg-bg-surface p-5">
              <div className="font-display text-lg font-medium">{c}</div>
              <div className="text-sm text-fg-muted mt-1">Competition Coordinator</div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-fg-muted">
          For competition enquiries, please use our{" "}
          <Link href="/contact" className="text-brand underline underline-offset-2">
            contact form
          </Link>{" "}
          and select "Writing Competition".
        </p>
      </section>
    </>
  );
}
