import Link from "next/link";
import { PulseLine } from "./PulseLine";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient pulse line behind the hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-end justify-center pb-8 opacity-70"
      >
        <PulseLine variant="hero" className="pulse-line-anim" />
      </div>

      {/* Soft radial wash — subtle depth without a photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 20%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28 lg:py-36">
        <div className="hero-stagger max-w-4xl">
          <div className="section-rule mb-6" style={{ maxWidth: "20rem" }}>
            <span>Jude Mental Health Society</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05]">
            Every word can make a difference.{" "}
            <span className="text-brand">Every voice matters.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-fg-muted max-w-2xl leading-relaxed">
            An independent Nigerian mental health advocacy initiative founded in
            memory of Jude Anuoluwa. We promote conversations that educate,
            reduce stigma, and foster communities where seeking help is
            recognised as a sign of strength.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/competition"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover transition-colors"
            >
              Enter the 2026 Writing Competition
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M4 10a1 1 0 0 1 1-1h8.6l-2.3-2.3a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L13.6 11H5a1 1 0 0 1-1-1z" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-6 py-3 text-base font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
            >
              Read our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
