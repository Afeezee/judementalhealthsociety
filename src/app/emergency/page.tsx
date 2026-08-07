import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Emergency Support — Get help now",
  description:
    "Crisis lines, grounding techniques, and step-by-step guidance for when you or someone else needs immediate mental health support.",
  robots: { index: true, follow: true },
};

// Emergency page renders as static HTML with zero animation and zero
// client JS (except the sitewide Quick Exit / theme toggle in the shell).
// Spec §6: reachable in one click, no login, no animation delay.

const REFERRALS: Array<{
  name: string;
  role: string;
  numbers: { label: string; tel: string; note?: string }[];
  about: string;
  cost: "free" | "private";
}> = [
  {
    name: "National Emergency Hotline",
    role: "Government emergency line — police, fire, ambulance, and life-threatening emergencies",
    numbers: [{ label: "112", tel: "112", note: "Toll-free, 24/7" }],
    about:
      "Nigeria's national emergency number. Reaches police, fire, ambulance and coordinates response for any life-threatening emergency, including active mental-health crises. Free to call from any phone, at any hour.",
    cost: "free",
  },
  {
    name: "Suicide Research and Prevention Initiative (SURPIN)",
    role: "Confidential suicide prevention support",
    numbers: [{ label: "0800 0787 7464", tel: "08000787746", note: "Toll-free" }],
    about:
      "A Nigerian initiative based at Lagos University Teaching Hospital, dedicated to preventing suicide through research, public education, and a confidential help line. Trained volunteers listen without judgement and connect callers with local support.",
    cost: "free",
  },
  {
    name: "Mentally Aware Nigeria Initiative (MANI)",
    role: "Peer-led mental health support and referrals (private)",
    numbers: [
      { label: "0809 111 6264", tel: "08091116264" },
      { label: "0811 168 0686", tel: "08111680686" },
    ],
    about:
      "A youth-driven non-profit that runs a Nigeria-wide peer support network. MANI offers immediate emotional support, safety planning, and warm-handoff referrals to licensed mental health professionals across the country.",
    cost: "private",
  },
];

export default function EmergencyPage() {
  return (
    <>
      {/* Red alert band — instantly recognisable */}
      <section className="bg-signal-red text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold opacity-90">
            Emergency support
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-medium leading-tight">
            You're in the right place. Help is a phone call away.
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-2xl leading-relaxed">
            If you or someone else is in immediate danger, contact your local
            emergency services or go to the nearest healthcare facility now.
            JMHS is not an emergency service — the numbers below can connect
            you with people trained to help.
          </p>
        </div>
      </section>

      {/* Primary numbers — big, tap-friendly on mobile */}
      <section aria-labelledby="primary-numbers" className="mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-14">
        <h2 id="primary-numbers" className="sr-only">Crisis phone numbers</h2>

        {/* National emergency — most prominent */}
        <div className="rounded-2xl border-2 border-signal-red bg-signal-red/5 p-6 md:p-8 mb-4">
          <div className="flex items-center gap-3 text-signal-red font-semibold text-[11px] uppercase tracking-[0.16em]">
            <span className="inline-block h-2 w-2 rounded-full bg-signal-red animate-pulse" aria-hidden="true" />
            Immediate life-threatening emergency
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-display text-xl md:text-2xl font-medium">
                National Emergency Hotline
              </div>
              <p className="mt-1 text-fg-muted">
                Police, fire, ambulance — reaches the right responder for you.
              </p>
            </div>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 rounded-2xl bg-signal-red text-white px-6 py-4 font-display text-3xl font-bold tracking-tight hover:bg-signal-red-strong transition-colors"
              aria-label="Call 112 — National Emergency Hotline"
            >
              📞 112
            </a>
          </div>
          <div className="mt-3 text-xs text-signal-red font-semibold uppercase tracking-wider">
            Toll-free · 24/7 · from any phone
          </div>
        </div>

        {/* Mental-health specific lines */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-bg-surface p-6">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
              Suicide prevention · Toll-free
            </div>
            <div className="mt-2 font-display text-lg font-medium">
              Suicide Research and Prevention Initiative (SURPIN)
            </div>
            <a
              href="tel:08000787746"
              className="mt-3 inline-block font-display text-2xl md:text-3xl font-semibold text-fg hover:text-brand transition-colors"
            >
              0800 0787 7464
            </a>
            <p className="mt-3 text-sm text-fg-muted leading-relaxed">
              Confidential support with trained volunteers. Nigerian initiative
              based at Lagos University Teaching Hospital.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-bg-surface p-6">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
              Peer support · Private
            </div>
            <div className="mt-2 font-display text-lg font-medium">
              Mentally Aware Nigeria Initiative (MANI)
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="tel:08091116264"
                className="block font-display text-xl font-semibold text-fg hover:text-brand transition-colors"
              >
                0809 111 6264
              </a>
              <a
                href="tel:08111680686"
                className="block font-display text-xl font-semibold text-fg hover:text-brand transition-colors"
              >
                0811 168 0686
              </a>
            </div>
            <p className="mt-3 text-sm text-fg-muted leading-relaxed">
              Youth-driven peer support network. Referrals to licensed
              professionals across Nigeria.
            </p>
          </div>
        </div>

        {/* JMHS fallback */}
        <div className="mt-4 rounded-xl border border-hairline bg-bg-elevated p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-fg-muted">
              JMHS emergency contact (community fallback)
            </div>
            <div className="mt-1 text-sm text-fg-muted">
              For members of the JMHS community if the numbers above are unreachable.
            </div>
          </div>
          <a
            href={`tel:${CONTACT.emergencyPhone.replace(/\s+/g, "")}`}
            className="font-display text-xl font-semibold text-fg hover:text-brand transition-colors"
          >
            {CONTACT.emergencyPhone}
          </a>
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-lg border border-hairline bg-bg-elevated px-5 py-4 text-sm text-fg-muted italic">
          JMHS is not an emergency service. If you or someone else is in
          immediate danger, contact your local emergency services or the nearest
          healthcare facility immediately.
        </div>
      </section>

      {/* If you're worried about someone */}
      <section aria-labelledby="worried-heading" className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
        <div className="section-rule mb-6" style={{ maxWidth: "26rem" }}><span>If you're worried about someone</span></div>
        <h2 id="worried-heading" className="font-display text-3xl md:text-4xl font-medium mb-6">
          Show up. Ask. Stay.
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Reach out with empathy and without judgement.",
            "Listen more than you speak.",
            "Encourage them to seek professional support.",
            "Stay connected and check in regularly.",
            "Avoid dismissing their feelings or offering quick solutions.",
            "If they express thoughts of suicide or appear to be in immediate danger, do not leave them alone. Contact emergency services, a trusted family member, or a recognised crisis support service immediately.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-hairline bg-bg-surface p-5"
            >
              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-fg">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* If you're overwhelmed right now */}
      <section aria-labelledby="overwhelmed-heading" className="border-t border-hairline bg-bg-elevated">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
          <div className="section-rule mb-6" style={{ maxWidth: "28rem" }}><span>If you're feeling overwhelmed right now</span></div>
          <h2 id="overwhelmed-heading" className="font-display text-3xl md:text-4xl font-medium mb-6">
            Slow down. Right here. Right now.
          </h2>
          <ol className="grid gap-3">
            {[
              "Pause and take slow, deep breaths.",
              "Move to a safe and quiet environment.",
              "Contact someone you trust.",
              "Drink water and focus on your breathing.",
              "Try the 5-4-3-2-1 grounding technique.",
              "Remind yourself that difficult emotions can pass.",
              "If you feel unable to keep yourself safe, seek immediate emergency support.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl border border-hairline bg-bg-surface p-5"
              >
                <span className="font-display text-3xl font-medium text-brand tabular-nums shrink-0 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-fg leading-relaxed pt-1">{item}</span>
              </li>
            ))}
          </ol>

          {/* 5-4-3-2-1 detail box */}
          <div className="mt-8 rounded-2xl border border-hairline bg-bg-surface p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
              5-4-3-2-1 grounding technique
            </div>
            <p className="mt-3 text-fg-muted">
              A short exercise you can do anywhere to bring yourself back into
              the present moment.
            </p>
            <ul className="mt-5 space-y-2 text-fg">
              <li><strong>5</strong> — things you can <em>see</em></li>
              <li><strong>4</strong> — things you can <em>touch</em></li>
              <li><strong>3</strong> — things you can <em>hear</em></li>
              <li><strong>2</strong> — things you can <em>smell</em></li>
              <li><strong>1</strong> — thing you can <em>taste</em></li>
            </ul>
          </div>
        </div>
      </section>

      {/* About the referral organisations */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
        <div className="section-rule mb-6" style={{ maxWidth: "24rem" }}><span>About these organisations</span></div>
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-6">
          Who's on the other end of the line.
        </h2>
        <div className="space-y-4">
          {REFERRALS.map((r) => (
            <div key={r.name} className="rounded-xl border border-hairline bg-bg-surface p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-display text-lg md:text-xl font-medium">{r.name}</div>
                  <div className="mt-1 text-sm text-brand font-semibold">{r.role}</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  r.cost === "free" ? "bg-brand/10 text-brand" : "bg-bg-elevated text-fg-muted"
                }`}>
                  {r.cost === "free" ? "Free" : "Private"}
                </span>
              </div>
              <p className="mt-3 text-sm text-fg leading-relaxed">{r.about}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.numbers.map((n) => (
                  <a
                    key={n.tel}
                    href={`tel:${n.tel}`}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline bg-bg px-3 py-1.5 text-sm font-semibold text-fg hover:border-brand hover:text-brand transition-colors"
                  >
                    📞 {n.label}
                    {n.note && (
                      <span className="text-[10px] uppercase tracking-wider text-fg-muted">{n.note}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm text-fg-muted italic">
            More partner organisations will be added here as JMHS expands its
            referral network.
          </p>
        </div>
      </section>

      {/* Next steps */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-6">
            When the moment passes, take one next step.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/directory"
              className="rounded-xl border border-hairline bg-bg-surface p-5 hover:border-brand transition-colors"
            >
              <div className="font-display text-lg font-medium">Find a professional</div>
              <div className="mt-1 text-sm text-fg-muted">
                Browse our Professional Support Directory of verified practitioners.
              </div>
            </Link>
            <Link
              href="/resources"
              className="rounded-xl border border-hairline bg-bg-surface p-5 hover:border-brand transition-colors"
            >
              <div className="font-display text-lg font-medium">Read a resource</div>
              <div className="mt-1 text-sm text-fg-muted">
                Practical articles for you and for anyone supporting you.
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
