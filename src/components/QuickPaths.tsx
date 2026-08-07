import Link from "next/link";
import { Reveal } from "./Reveal";

const PATHS = [
  {
    href: "/emergency",
    kicker: "Right now",
    title: "I'm struggling right now",
    body: "Crisis lines, grounding techniques, and what to do in the next five minutes.",
    tone: "red",
  },
  {
    href: "/resources?cat=supporting-someone-else",
    kicker: "For a friend or family member",
    title: "I want to support someone else",
    body: "Practical guidance on listening, what not to say, and how to help without harm.",
    tone: "blue",
  },
  {
    href: "/resources?cat=learning-and-prevention",
    kicker: "Learn & prevent",
    title: "I want to learn",
    body: "Evidence-based articles on depression, stigma, grief, campus stress and more.",
    tone: "blue",
  },
  {
    href: "/assistant",
    kicker: "Just have a question",
    title: "I want to ask something",
    body: "The JMHS Mental Health Companion — general information in plain language, in your own time.",
    tone: "blue",
  },
] as const;

export function QuickPaths() {
  return (
    <section aria-labelledby="paths-heading" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl mb-10">
        <div className="section-rule mb-6"><span>Wherever you're starting from</span></div>
        <h2 id="paths-heading" className="font-display text-3xl md:text-4xl font-medium">
          Choose the path that fits you today.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Reveal key={p.href} delayMs={i * 60}>
            <Link
              href={p.href}
              className={`group block h-full rounded-2xl border p-6 md:p-8 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                p.tone === "red"
                  ? "border-signal-red/30 bg-signal-red/5 hover:border-signal-red"
                  : "border-hairline bg-bg-surface hover:border-brand"
              }`}
            >
              <div className={`text-[11px] uppercase tracking-[0.16em] font-semibold mb-3 ${
                p.tone === "red" ? "text-signal-red" : "text-brand"
              }`}>
                {p.kicker}
              </div>
              <h3 className="font-display text-xl md:text-2xl font-medium mb-2 group-hover:text-brand transition-colors">
                {p.title}
              </h3>
              <p className="text-fg-muted leading-relaxed">{p.body}</p>
              <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
                p.tone === "red" ? "text-signal-red" : "text-brand"
              }`}>
                Continue
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="currentColor" aria-hidden="true">
                  <path d="M4 10a1 1 0 0 1 1-1h8.6l-2.3-2.3a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L13.6 11H5a1 1 0 0 1-1-1z" />
                </svg>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
