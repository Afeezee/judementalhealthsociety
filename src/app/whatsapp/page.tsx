import type { Metadata } from "next";
import { PulseLine } from "@/components/PulseLine";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "WhatsApp Community",
  description:
    "Join 200+ people who talk about mental health honestly and kindly. Guidelines before you join.",
};

const GUIDELINES = [
  "Be kind. Assume good faith. Disagree without dismissing.",
  "Confidentiality by default — nothing shared here should be repeated outside.",
  "No graphic detail on self-harm or method.",
  "This community is not a substitute for professional help. In emergencies, use our emergency page.",
  "Report concerning behaviour to moderators privately — don't retaliate.",
  "Students, professionals, and everyone in between are welcome. Come as you are.",
];

export default function WhatsAppPage() {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <div className="section-rule mb-6 justify-center"><span>Community · WhatsApp</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            200+ people already gather here every week.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Students, professionals, practitioners, advocates, and researchers.
            Come as you are. Before you join, please read the community
            guidelines below — they exist to keep this a safe place for
            everyone.
          </p>
          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14 md:py-20">
        <div className="section-rule mb-6" style={{ maxWidth: "18rem" }}><span>Community guidelines</span></div>
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">
          The rules of the room.
        </h2>
        <ul className="grid gap-3">
          {GUIDELINES.map((g, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-hairline bg-bg-surface p-5">
              <span className="font-display text-xl font-medium text-brand tabular-nums shrink-0 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-fg leading-relaxed pt-0.5">{g}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-hairline bg-bg-surface p-8 md:p-10 text-center">
          <div className="font-display text-2xl md:text-3xl font-medium">
            Ready to join?
          </div>
          <p className="mt-3 text-fg-muted max-w-md mx-auto">
            One tap. You'll be added to the group and welcomed by a
            moderator.
          </p>
          <div className="mt-6">
            <WhatsAppButton size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
