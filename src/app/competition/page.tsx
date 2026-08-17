import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { COMPETITION } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "JMHS National Writing Competition 2026",
  description:
    "An annual advocacy programme organised by the Jude Mental Health Society. Nine categories, blind judging, published to a permanent library. Open to everyone — deadline 13 September 2026.",
  openGraph: {
    title: "JMHS National Writing Competition 2026",
    description:
      "Using the Power of Words to Promote Mental Health and Prevent Suicide. Open to everyone. Deadline 13 September 2026.",
  },
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
    message: `Submissions are open now. The portal closes at 23:59 WAT on ${formatDate(COMPETITION.deadline)}.`,
    tone: "open",
  },
  judging: {
    label: "Judging in progress",
    message: "Submissions are closed. Our judges are reviewing entries blindly — winners will be announced at the September lecture.",
    tone: "judging",
  },
  winners_announced: {
    label: "Winners announced",
    message: `The ${COMPETITION.themeYear} winners have been announced. Published entries are in the archive.`,
    tone: "announced",
  },
};

const FAQ = [
  {
    q: "Who can enter?",
    a: COMPETITION.eligibility + " There are no fees. Non-Nigerians are welcome to enter.",
  },
  {
    q: "How is judging done?",
    a: "Every entry is judged blind — your identity is removed at the moment your submission is imported. Judges receive only the title and content of each entry, and score each on the four criteria below with a documented tie-break process.",
  },
  {
    q: "How and when will I know if I've won?",
    a: `Winners are contacted privately before the public announcement, which happens live at our September Monthly Mental Health Lecture on ${formatDate(COMPETITION.announcement)}. All shortlisted authors are told the outcome regardless of placement.`,
  },
  {
    q: "Will my entry be published?",
    a: "Only if you consent. Publication is opt-in. If you consent, your entry gets its own permanent page on this site — with moderated comments and share options — and you can choose whether it appears under your name or anonymously. You can change your mind up to the announcement date.",
  },
  {
    q: "Who owns the writing?",
    a: "You do. Copyright stays with the author. Consenting to publication grants JMHS a non-exclusive licence to publish and archive the work for advocacy and educational purposes — nothing more.",
  },
  {
    q: "Are there prizes?",
    a: "Winner, First Runner-up, Second Runner-up, and Honourable Mentions each year. Every entrant receives a digital certificate of participation. Cash and gift prizes are announced by the Organising Committee before the competition opens each year.",
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
          <div className="section-rule mb-6" style={{ maxWidth: "34rem" }}>
            <span>JMHS National Writing Competition {COMPETITION.themeYear}</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] max-w-4xl">
            Turn what you've lived through into something someone else needs to read.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-3xl leading-relaxed">
            An annual advocacy programme organised by the Jude Mental Health
            Society. Open to everyone. Blind-judged. Published to a permanent
            digital library so the writing keeps working long after the
            competition ends.
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
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Launch</dt>
              <dd className="mt-1 font-display text-xl font-medium">{formatDate(COMPETITION.opens)}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-muted">Deadline</dt>
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
            <a
              href={COMPETITION.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="sculptform-submit"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors"
            >
              Submit your entry
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
                <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
              </svg>
            </a>
            <Link
              href="/competition/submit"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-base font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
            >
              How the submission works
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
        <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>{COMPETITION.themeYear} Theme</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight">
          {COMPETITION.theme}
        </h2>
        <p className="mt-5 text-lg text-fg-muted leading-relaxed">
          A theme is not a prompt — it's a compass. We're looking for writing
          that treats mental health with honesty and care. Write towards what
          changes when the silence breaks.
        </p>
      </section>

      {/* Objectives */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Objectives</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-8 max-w-3xl">
            What this competition is trying to do.
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COMPETITION.objectives.map((o, i) => (
              <Reveal key={o} delayMs={i * 40} as="li">
                <div className="flex gap-3 rounded-xl border border-hairline bg-bg-surface p-5 h-full">
                  <span aria-hidden="true" className="mt-1 text-brand font-bold">→</span>
                  <span className="text-fg leading-relaxed">{o}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories with limits */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="section-rule mb-6" style={{ maxWidth: "22rem" }}><span>Accepted categories</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-4 max-w-3xl">
          Nine ways to write. Choose the one your voice fits best.
        </h2>
        <p className="text-fg-muted mb-10 max-w-3xl">
          Submit an original work in any format below. Every category is capped
          at <strong className="text-fg">2 pages</strong> except Short Story,
          which allows up to <strong className="text-fg">8 pages</strong>.
          Documents must be <strong className="text-fg">.doc, .docx, or PDF</strong>.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPETITION.categories.map((c, i) => (
            <Reveal key={c.label} delayMs={i * 40} as="li">
              <div className="rounded-2xl border border-hairline bg-bg-surface p-5 h-full">
                <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
                  Category
                </div>
                <div className="mt-2 font-display text-lg font-medium">{c.label}</div>
                <div className="mt-1 text-xs text-fg-muted">{c.limit}</div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Submission rules — the ten */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "16rem" }}><span>Submission rules</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">
            The rules are short. Read them twice.
          </h2>
          <p className="text-fg-muted mb-8">
            Not following these is the most common reason an otherwise
            excellent entry is disqualified.
          </p>
          <ol className="grid gap-3">
            {COMPETITION.submissionRules.map((r, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
                <span className="font-display text-2xl font-medium text-brand tabular-nums shrink-0 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-fg leading-relaxed pt-1">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Submission process — the four steps */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Submission process</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
            How the submission works — and how we keep it fair.
          </h2>
          <ul className="grid gap-3">
            {COMPETITION.submissionProcess.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
                <span className="font-display text-xl font-medium text-brand tabular-nums shrink-0 leading-none w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-fg leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Judging criteria — with weights */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "14rem" }}><span>Judging criteria</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">
          Every entry is scored on four things.
        </h2>
        <p className="text-fg-muted mb-8 max-w-2xl">
          Judges receive only your title and content — never your identity.
          Maximum score: 100.
        </p>
        <div className="overflow-hidden rounded-2xl border border-hairline">
          <table className="w-full text-left">
            <thead className="bg-bg-elevated">
              <tr>
                <th className="px-5 py-3 text-[11px] uppercase tracking-wider text-fg-muted font-semibold">Criterion</th>
                <th className="px-5 py-3 text-[11px] uppercase tracking-wider text-fg-muted font-semibold text-right">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-bg-surface">
              {COMPETITION.judgingCriteria.map((c) => (
                <tr key={c.criterion}>
                  <td className="px-5 py-4 font-medium">{c.criterion}</td>
                  <td className="px-5 py-4 text-right tabular-nums font-display text-lg text-brand font-medium">
                    {c.weight}%
                  </td>
                </tr>
              ))}
              <tr className="bg-bg-elevated">
                <td className="px-5 py-3 text-sm text-fg-muted font-semibold">Total</td>
                <td className="px-5 py-3 text-right text-sm text-fg-muted font-semibold tabular-nums">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Prizes */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "10rem" }}><span>Prizes</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
            Recognition, publication, a lasting byline.
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COMPETITION.prizeStructure.map((p, i) => (
              <li key={p} className={`rounded-xl border p-5 ${
                i === 0 ? "border-brand bg-brand/5" : "border-hairline bg-bg-surface"
              }`}>
                <div className="font-display text-lg font-medium">{p}</div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-fg-muted">
            Specific cash and gift prizes are announced by the Organising
            Committee before each year's competition opens.
          </p>
        </div>
      </section>

      {/* Publication */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "14rem" }}><span>Publication</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
          The competition doesn't end at the announcement.
        </h2>
        <ul className="space-y-3">
          {COMPETITION.publicationDetails.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-fg leading-relaxed">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Code of Conduct */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "16rem" }}><span>Code of conduct</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">
            What we ask of every entrant.
          </h2>
          <p className="text-fg-muted mb-8">
            Breaking any of these may result in disqualification.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COMPETITION.codeOfConduct.map((c) => (
              <li key={c} className="flex gap-3 rounded-xl border border-hairline bg-bg-surface p-5">
                <span aria-hidden="true" className="mt-1 text-brand font-bold">✓</span>
                <span className="text-fg leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
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
      </section>

      {/* Big CTA band */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-3xl border-2 border-brand bg-brand text-white p-10 md:p-14 text-center">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold opacity-80">
              Ready when you are
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium max-w-2xl mx-auto leading-tight">
              Submit your entry to the {COMPETITION.themeYear} JMHS National Writing Competition.
            </h2>
            <p className="mt-4 text-white/85 max-w-xl mx-auto">
              Submissions are handled through our secure Sculptform portal.
              Deadline: <strong>{formatDate(COMPETITION.deadline)}</strong> at 23:59 WAT.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href={COMPETITION.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="sculptform-submit"
                className="inline-flex items-center gap-2 rounded-full bg-white text-brand px-7 py-3.5 text-base font-semibold hover:bg-white/90 transition-colors"
              >
                Submit your entry now
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
                  <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                </svg>
              </a>
              <Link
                href="/competition/submit"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Pre-submission checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinators */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Competition coordinators</span></div>
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
