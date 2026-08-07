import type { Metadata } from "next";
import Link from "next/link";
import { COMPETITION } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Enter the Writing Competition",
  description:
    "How to submit your entry to the JMHS National Writing Competition.",
};

/**
 * Submission is hosted on Sculptform (spec §2.11). This page frames it,
 * links to the form, and explains what happens next. The env variable
 * NEXT_PUBLIC_SCULPTFORM_URL points to the actual form.
 */
const SCULPTFORM_URL =
  process.env.NEXT_PUBLIC_SCULPTFORM_URL || "https://sculptform.live";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "To be announced";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function SubmitPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6" style={{ maxWidth: "16rem" }}><span>Enter the competition</span></div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
        Ready to submit your entry?
      </h1>
      <p className="mt-6 text-lg text-fg-muted leading-relaxed">
        Submissions for the {new Date(COMPETITION.deadline).getFullYear()} JMHS
        National Writing Competition are handled through our secure Sculptform
        portal. You'll be asked for your entry, your category, and contact
        details — all of which are separated from your writing before any
        judge reads it.
      </p>

      <div className="mt-8 rounded-2xl border-2 border-brand bg-brand text-white p-8 md:p-10">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold opacity-80">
          Submission deadline
        </div>
        <div className="mt-2 font-display text-3xl md:text-4xl font-medium">
          {formatDate(COMPETITION.deadline)}
        </div>
        <p className="mt-4 text-white/85 leading-relaxed">
          Late entries cannot be accepted — the portal closes automatically at
          23:59 WAT on the deadline date.
        </p>
        <a
          href={SCULPTFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-brand px-6 py-3 text-base font-semibold hover:bg-white/90 transition-colors"
        >
          Open the submission form
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
            <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
          </svg>
        </a>
      </div>

      <div className="mt-10 space-y-6">
        <h2 className="font-display text-2xl font-medium">
          What happens after you submit
        </h2>
        <ol className="space-y-4">
          {[
            {
              t: "Your entry is anonymised at ingest",
              d: "Your name, email, and contact details are separated from your writing at the moment your submission is processed — before any human reads it.",
            },
            {
              t: "Judges receive only the writing",
              d: "Three judges independently score your entry on relevance, originality, clarity, and emotional impact. Ties are broken by a documented process, not by any of us.",
            },
            {
              t: "Winners are told privately",
              d: `Shortlisted authors are contacted privately before the public announcement, which happens live at our September lecture on ${formatDate(COMPETITION.announcement)}.`,
            },
            {
              t: "You control publication",
              d: "You choose whether your entry is published under your name, anonymously, or not at all. You can change your mind up to the announcement date.",
            },
          ].map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
              <span className="font-display text-2xl font-medium text-brand tabular-nums shrink-0 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-display text-lg font-medium">{s.t}</div>
                <div className="mt-1 text-fg-muted leading-relaxed">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 pt-8 border-t border-hairline flex flex-wrap gap-3">
        <Link
          href="/competition"
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
        >
          ← Back to competition overview
        </Link>
        <Link
          href="/competition/entries"
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
        >
          Read past entries
        </Link>
      </div>
    </section>
  );
}
