import type { Metadata } from "next";
import Link from "next/link";
import { PulseLine } from "@/components/PulseLine";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "About JMHS",
  description:
    "Founded in memory of Jude Anuoluwa. An independent Nigerian mental health advocacy initiative built on compassion, education, and community.",
};

const STORY_PARAGRAPHS = [
  "Jude Mental Health Society (JMHS) is a mental health awareness and advocacy initiative founded in memory of Jude Anuoluwa, a 300-level student of the University of Ilorin who died by suicide in 2021.",
  "His passing became a painful reminder of the silent emotional struggles many people experience every day. It highlighted the urgent need for safe spaces where individuals can openly discuss their mental health, receive accurate information, find encouragement, and be connected to appropriate support without fear of stigma or discrimination.",
  "Rather than allowing Jude's story to become another forgotten statistic, JMHS was established to transform tragedy into purpose. The organisation exists to promote conversations that educate, reduce stigma, encourage early intervention, and foster communities where seeking help is recognised as a sign of strength rather than weakness.",
  "Since its inception, JMHS has grown into a vibrant mental health community with over 200 members, bringing together students, professionals, mental health practitioners, advocates, researchers, educators, and individuals passionate about improving psychological well-being.",
  "Our flagship Monthly Mental Health Lecture Series creates opportunities for experts from different fields to share evidence-based knowledge on contemporary mental health issues. These sessions encourage meaningful dialogue, improve mental health literacy, and strengthen community resilience.",
  "Beyond lectures, JMHS is building a comprehensive digital ecosystem that includes educational resources, an AI-powered mental health assistant, professional support directories, community discussions, volunteer opportunities, awareness campaigns, and the annual JMHS National Writing Competition — all designed to expand access to mental health knowledge and encourage thoughtful conversations.",
  "At JMHS, we believe that every conversation has the power to create understanding, every act of compassion strengthens hope, and every informed community becomes better equipped to support those facing mental health challenges.",
  "Our vision is to build a society where mental well-being is valued, help is accessible, stigma is reduced, and no one feels alone in their struggles.",
];

const VALUES = [
  "Compassion", "Empathy", "Education", "Inclusion", "Advocacy",
  "Integrity", "Collaboration", "Hope", "Community", "Respect",
];

const WHAT_WE_DO = [
  "Monthly Mental Health Lectures",
  "Mental Health Awareness Campaigns",
  "Suicide Prevention Advocacy",
  "Community Discussions",
  "Educational Articles and Resources",
  "Professional Support Directory",
  "AI Mental Health Assistant",
  "Annual National Writing Competition",
  "Volunteer and Moderator Development",
  "Partnerships with mental health professionals and organisations",
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 30%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="section-rule mb-6 justify-center"><span>About JMHS</span></div>
          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight leading-[1.1]">
            Transforming tragedy into purpose.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
            An independent Nigerian mental health advocacy initiative, built by a
            community that refuses to let mental health stay silent.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story-heading" className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
        <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Our story</span></div>
        <h2 id="story-heading" className="font-display text-3xl md:text-4xl font-medium mb-8">
          In memory of Jude Anuoluwa.
        </h2>
        <div className="prose prose-neutral max-w-none">
          {STORY_PARAGRAPHS.map((p, i) => (
            <Reveal key={i} delayMs={i * 40}>
              <p className="text-lg leading-relaxed text-fg mb-6">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-bg-surface p-8 md:p-10 h-full">
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">Vision</div>
              <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">
                To create a society where mental well-being is prioritised, mental
                health conversations are normalised, stigma is eliminated, and
                everyone has access to the support they need to live healthier
                and more fulfilling lives.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="rounded-2xl border border-hairline bg-bg-surface p-8 md:p-10 h-full">
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">Mission</div>
              <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">
                Improve mental health awareness through education, advocacy,
                community engagement, and access to reliable resources —
                empowering individuals with knowledge, encouraging early
                help-seeking, reducing stigma, and fostering compassionate
                communities.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-2xl mb-10">
          <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Our values</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-medium">
            Ten commitments we hold ourselves to.
          </h2>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {VALUES.map((v, i) => (
            <Reveal key={v} delayMs={i * 30} as="li">
              <div className="rounded-xl border border-hairline bg-bg-surface p-5 text-center font-display text-lg font-medium hover:border-brand hover:text-brand transition-colors">
                {v}
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* What we do */}
      <section className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>What we do</span></div>
            <h2 className="font-display text-3xl md:text-4xl font-medium">
              The work, in ten sentences.
            </h2>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {WHAT_WE_DO.map((w, i) => (
              <Reveal key={w} delayMs={i * 40} as="li">
                <div className="flex items-start gap-3 rounded-xl bg-bg-surface border border-hairline p-4">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-bold mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-fg">{w}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Honesty statement */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24 text-center">
        <div className="rounded-2xl border border-hairline bg-bg-surface p-8 md:p-10">
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-fg-muted">
            Where we are right now
          </div>
          <p className="mt-4 font-display text-2xl md:text-3xl leading-snug">
            JMHS is currently an independent mental health advocacy initiative —
            not yet a registered NGO. We're honest about that, because trust
            starts with the truth.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl font-medium">
              Ready to be part of this?
            </h2>
            <p className="mt-3 text-fg-muted">
              Join the community, browse the resources, or volunteer with us.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton size="lg" />
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
