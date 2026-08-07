import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & data",
  description: "How JMHS collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
      <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Privacy & data</span></div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
        Your data, plainly stated.
      </h1>
      <div className="prose prose-neutral max-w-none mt-8 space-y-5 text-lg text-fg leading-relaxed">
        <p>
          JMHS collects the smallest amount of information we can. This page
          explains what we collect, why, and what your rights are.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">What we collect</h3>
        <p>
          <strong>Contact form:</strong> your name, email, chosen topic, and
          message. We keep this only as long as needed to respond and follow
          up.
        </p>
        <p>
          <strong>Writing competition submissions:</strong> at the moment your
          entry is imported, your contact details are separated from your
          writing and stored in a distinct table. Judges only ever see your
          manuscript. If you win or are shortlisted, we ask before publishing
          under your name.
        </p>
        <p>
          <strong>Newsletter / community subscriptions:</strong> email only,
          and only if you sign up. Unsubscribe is one click, any time.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">What we don't do</h3>
        <p>
          We do not sell your data. We do not share it with third parties for
          marketing. We do not use your writing to train third-party AI
          models.
        </p>
        <h3 className="font-display text-xl md:text-2xl font-medium mt-8 mb-2">Your rights</h3>
        <p>
          You can ask for a copy of what we hold about you, correct it, or
          request deletion at any time — use our contact form and choose
          "General enquiry".
        </p>
        <p className="text-sm text-fg-muted italic">
          This is a plain-language summary. A full policy will be published
          alongside our registration as JMHS's organisational status evolves.
        </p>
      </div>
    </section>
  );
}
