import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Community Forum",
  description:
    "A moderated space for JMHS members to talk with each other — with care, cooling-off periods on sensitive threads, and human moderation.",
};

const GUIDELINES = [
  {
    t: "Be kind. This is the first rule and the last.",
    d: "Assume good faith. Disagree without dismissing. Everyone here is dealing with something.",
  },
  {
    t: "Confidentiality by default.",
    d: "Nothing shared here should be repeated outside — not names, not stories, not screenshots.",
  },
  {
    t: "No graphic detail on self-harm or method.",
    d: "You can share your experience without describing how. This protects you and everyone reading.",
  },
  {
    t: "Not a substitute for professional help.",
    d: "If you or someone else is in immediate danger, use our emergency page or your local emergency service.",
  },
  {
    t: "Report, don't retaliate.",
    d: "Every post has a report button. Our moderators read every report — usually within a day.",
  },
];

export default function ForumPage() {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="section-rule mb-6 justify-center"><span>Community Forum</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            A slower, kinder place to talk.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Threaded discussions, visibly moderated, with cooling-off periods on
            sensitive threads for new accounts. We're rebuilding the space,
            piece by piece — thank you for your patience.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Coming-soon state */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <div className="rounded-2xl border border-hairline bg-bg-surface p-10 md:p-14 text-center">
          <div className="font-display text-2xl md:text-3xl font-medium">
            The forum opens in phases.
          </div>
          <p className="mt-4 text-fg-muted max-w-xl mx-auto leading-relaxed">
            While the moderation team is being trained, community conversation
            is happening in our WhatsApp community — 200+ members strong.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <WhatsAppButton size="lg" />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
            >
              Volunteer as a moderator
            </Link>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Community guidelines</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-8">
            The rules of the room.
          </h2>
          <ul className="grid gap-3">
            {GUIDELINES.map((g, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
                <span className="font-display text-2xl font-medium text-brand tabular-nums shrink-0 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-display text-lg font-medium">{g.t}</div>
                  <div className="mt-1 text-fg-muted leading-relaxed">{g.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
