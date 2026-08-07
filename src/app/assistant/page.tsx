import type { Metadata } from "next";
import { Chat } from "@/components/Chat";
import { CrisisButton } from "@/components/CrisisButton";
import { PulseLine } from "@/components/PulseLine";

export const metadata: Metadata = {
  title: "JMHS Mental Health Companion",
  description:
    "Ask a general mental health question and get warm, plain-language guidance. Not a crisis service. Not a substitute for professional care.",
};

export default function AssistantPage() {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
          <div className="section-rule mb-6" style={{ maxWidth: "22rem" }}>
            <span>Mental Health Companion</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Ask a question. Get plain, evidence-based information.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl leading-relaxed">
            This is a general information companion — not a therapist,
            not a crisis line, and not a substitute for professional care.
            If you or someone else is in immediate danger, please use the
            emergency support page instead.
          </p>

          {/* Persistent crisis exit — always one click, above the fold */}
          <div className="mt-6 rounded-2xl border-2 border-signal-red bg-signal-red/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">
                In crisis right now?
              </div>
              <p className="mt-1 text-sm text-fg">
                Don't wait for an AI reply. Open the emergency page — real
                numbers, real people, right now.
              </p>
            </div>
            <CrisisButton />
          </div>

          <div className="mt-8">
            <PulseLine variant="divider" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
        <Chat />
      </section>
    </>
  );
}
