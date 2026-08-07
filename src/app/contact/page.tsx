import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CrisisButton } from "@/components/CrisisButton";
import { CONTACT } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact JMHS",
  description:
    "Get in touch with JMHS for general enquiries, competition questions, professional listings, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <>
      {/* Explicit distinction from the crisis line — spec §2.14 */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 md:py-20">
          <div className="section-rule mb-6" style={{ maxWidth: "12rem" }}><span>Contact us</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            We read every message.
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl leading-relaxed">
            This form is for general enquiries — partnerships, competition
            questions, professional listing suggestions, media, or anything
            else. We usually reply within 3–5 working days.
          </p>

          <div className="mt-8 rounded-2xl border-2 border-signal-red bg-signal-red/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-signal-red">
                This is not a crisis line
              </div>
              <p className="mt-2 text-fg max-w-xl">
                If you or someone else needs immediate help, please use our
                emergency support page — do not wait for a reply here.
              </p>
            </div>
            <CrisisButton />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-14 md:py-20 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <ContactForm />

        <aside className="space-y-6">
          <div className="rounded-2xl border border-hairline bg-bg-surface p-6">
            <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">
              Other ways to reach us
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="text-fg-muted">General phone:</span>{" "}
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="text-fg font-semibold hover:text-brand">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <span className="text-fg-muted">Email:</span>{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-fg font-semibold hover:text-brand break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <span className="text-fg-muted">Instagram:</span>{" "}
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-fg font-semibold hover:text-brand">
                  {CONTACT.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-hairline bg-bg-elevated p-6 text-sm text-fg-muted">
            JMHS is an independent mental health advocacy initiative — not a
            registered NGO and not an emergency service.
          </div>
        </aside>
      </section>
    </>
  );
}
