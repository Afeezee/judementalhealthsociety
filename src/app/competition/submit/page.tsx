import type { Metadata } from "next";
import Link from "next/link";
import { COMPETITION } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Submit your entry",
  description:
    "Pre-submission checklist and the secure submission portal for the JMHS National Writing Competition 2026.",
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return "To be announced";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/**
 * Pre-flight checklist for entrants. This page's whole purpose is to
 * make the Sculptform button impossible to miss, and to catch the
 * three most common disqualifying mistakes before the entrant clicks
 * through (name in manuscript, wrong format, wrong length).
 */
export default function SubmitPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}>
        <span>Submit your entry</span>
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
        Ready to send your writing to the judges?
      </h1>
      <p className="mt-6 text-lg text-fg-muted leading-relaxed">
        Submissions for the {COMPETITION.themeYear} JMHS National Writing
        Competition are handled through our secure Sculptform portal. Before
        you click through, run down the checklist below — the three items
        marked <strong className="text-signal-red">important</strong> are
        the most common reasons an otherwise excellent entry is disqualified.
      </p>

      {/* Sculptform CTA — big, above the checklist so it's the first thing you see */}
      <div className="mt-8 rounded-2xl border-2 border-brand bg-brand text-white p-8 md:p-10">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold opacity-80">
          Submission portal — deadline {formatDate(COMPETITION.deadline)}
        </div>
        <div className="mt-2 font-display text-3xl md:text-4xl font-medium">
          Submit your entry
        </div>
        <p className="mt-3 text-white/85 leading-relaxed">
          The portal closes automatically at 23:59 WAT on the deadline date.
          Late entries cannot be accepted.
        </p>
        <a
          href={COMPETITION.submissionUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="sculptform-submit"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-brand px-7 py-3.5 text-base font-semibold hover:bg-white/90 transition-colors"
        >
          Open the submission portal
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
            <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
          </svg>
        </a>
        <p className="mt-4 text-xs text-white/70 break-all">
          {COMPETITION.submissionUrl}
        </p>
      </div>

      {/* Pre-flight checklist */}
      <div className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl font-medium">
          Pre-submission checklist
        </h2>
        <p className="mt-2 text-fg-muted">
          Tick these off before you click through.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            {
              t: "My manuscript file contains no name and no identifying information",
              d: "Not in the title, not in the body, not in the header/footer, not in the document properties. Blind judging depends on this.",
              important: true,
            },
            {
              t: "My file is .doc, .docx or PDF",
              d: "Other formats (Pages, Google Docs share links, plain .txt) cannot be accepted.",
              important: true,
            },
            {
              t: "My entry is within the length limit",
              d: "Max 2 pages for every category except Short Story, which allows up to 8 pages.",
              important: true,
            },
            {
              t: "My writing is original and my own",
              d: "No plagiarism. No AI-generated writing passed off as your own.",
            },
            {
              t: "My entry relates to this year's theme",
              d: `"${COMPETITION.theme}"`,
            },
            {
              t: "My entry has a unique title",
            },
            {
              t: "Nothing in my writing promotes self-harm or suicide as a solution",
              d: "Writing about these experiences honestly is welcome and encouraged — see our safe-writing guidelines. Promoting them is not.",
            },
            {
              t: "I'm ready to state my publication consent",
              d: "You'll be asked whether we may publish your entry — under your name, anonymously, or not at all. You can change your mind up to the announcement date.",
            },
          ].map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
              <span className={`shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-white text-sm font-bold ${
                s.important ? "bg-signal-red" : "bg-brand"
              }`}>
                {i + 1}
              </span>
              <div>
                <div className="font-display text-base font-medium leading-snug flex items-center gap-2 flex-wrap">
                  <span>{s.t}</span>
                  {s.important && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-signal-red-strong">
                      Important
                    </span>
                  )}
                </div>
                {s.d && <div className="mt-1 text-sm text-fg-muted leading-relaxed">{s.d}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* What happens after */}
      <div className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl font-medium">
          What happens after you submit
        </h2>
        <ol className="mt-6 space-y-4">
          {[
            {
              t: "Your entry is anonymised at ingest",
              d: "Your name, email, and contact details are separated from your writing at the moment your submission is processed — before any human reads it.",
            },
            {
              t: "Judges receive only the writing",
              d: "Judges score your entry on relevance to theme (40%), originality (30%), clarity and structure (20%), and emotional impact (10%). Ties are broken by a documented process.",
            },
            {
              t: "Winners are told privately",
              d: `Shortlisted authors are contacted privately before the public announcement, which happens live at our September lecture on ${formatDate(COMPETITION.announcement)}.`,
            },
            {
              t: "You control publication",
              d: "You choose whether your entry is published under your name, anonymously, or not at all. You retain copyright either way.",
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

      {/* Second CTA — after the checklist, for people who scrolled */}
      <div className="mt-12 rounded-2xl border border-hairline bg-bg-elevated p-8 text-center">
        <div className="font-display text-xl font-medium">Checklist done? Submit now.</div>
        <a
          href={COMPETITION.submissionUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="sculptform-submit"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand text-white px-7 py-3.5 text-base font-semibold hover:bg-brand-hover transition-colors"
        >
          Open the submission portal
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6 4a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v6a1 1 0 1 1-2 0V6.4L6.7 13.7a1 1 0 0 1-1.4-1.4L12.6 5H7a1 1 0 0 1-1-1z" />
            <path d="M3 8a2 2 0 0 1 2-2h1a1 1 0 1 1 0 2H5v7h7v-1a1 1 0 1 1 2 0v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
          </svg>
        </a>
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
