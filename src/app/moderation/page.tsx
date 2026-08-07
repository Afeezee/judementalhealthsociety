import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderation policy",
  description: "How comments, forum posts, and community contributions are moderated on JMHS.",
};

export default function ModerationPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6" style={{ maxWidth: "14rem" }}><span>Moderation policy</span></div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
        How we keep this a safe place.
      </h1>
      <div className="prose prose-neutral max-w-none mt-8 space-y-5 text-lg text-fg leading-relaxed">
        <p>
          Every space JMHS runs — the forum, comments on published entries,
          our WhatsApp community — is moderated by real people. This page
          explains the rules and what happens when they're broken.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">Ground rules</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Be kind. Assume good faith. Disagree without dismissing.</li>
          <li>Confidentiality by default — nothing shared inside JMHS spaces should be repeated outside.</li>
          <li>No graphic descriptions of self-harm or suicide methods.</li>
          <li>No harassment, hate speech, or targeting of individuals.</li>
          <li>No promotion of unverified "cures" or dangerous advice.</li>
          <li>These spaces are not a substitute for professional care.</li>
        </ul>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">What happens if a rule is broken</h3>
        <p>
          Depending on severity: a private note from a moderator, an edit or
          removal of the post, a temporary cooling-off period on the account,
          or, in serious cases, permanent removal from the community.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">Cooling-off on sensitive threads</h3>
        <p>
          New accounts have a short waiting period before they can post in
          threads flagged as sensitive. This exists to prevent drive-by
          harm — not to gatekeep anyone from asking for help. Anyone can
          always read.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">How to report</h3>
        <p>
          Every post has a report button. Reports are read by our moderators,
          usually within 24 hours. Please report instead of retaliating.
        </p>
      </div>
    </section>
  );
}
