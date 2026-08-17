import Link from "next/link";
import { LogoMark } from "./Logo";
import { QuickExitButton } from "./QuickExitButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { ImpactStrip } from "./ImpactStrip";
import { getContactInfo } from "@/lib/public-data";
import { CONTACT as CONTACT_DEFAULT } from "@/lib/site-settings";

const COLS = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About JMHS" },
      { href: "/lectures", label: "Monthly Lectures" },
      { href: "/resources", label: "Resource Centre" },
      { href: "/competition", label: "Writing Competition" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { href: "/assistant", label: "Ask the AI Companion" },
      { href: "/forum", label: "Community Forum" },
      { href: "/directory", label: "Find a Professional" },
      { href: "/whatsapp", label: "Join our WhatsApp community" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/emergency", label: "Emergency support" },
      { href: "/privacy", label: "Privacy & data" },
      { href: "/moderation", label: "Moderation policy" },
    ],
  },
];

export async function Footer() {
  // Contact info comes from the DB with the file-level default as fallback,
  // so /admin/content edits show up in the footer without a code deploy.
  const CONTACT = { ...CONTACT_DEFAULT, ...(await getContactInfo()) };
  return (
    <footer className="mt-24 border-t border-hairline bg-bg-surface">
      {/* Condensed impact strip (spec §2.10) */}
      <ImpactStrip />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        {/* About */}
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="font-display text-lg font-semibold text-fg">
              Jude Mental Health Society
            </span>
          </div>
          <p className="mt-4 text-sm text-fg-muted leading-relaxed">
            An independent mental health advocacy initiative founded in memory of
            Jude Anuoluwa. We promote conversations that educate, reduce stigma,
            and foster communities where seeking help is recognised as strength.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <WhatsAppButton />
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg hover:border-fg-muted transition-colors"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 2A4.5 4.5 0 1 1 5.5 10 4.5 4.5 0 0 1 10 5.5zm4.75-.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                <path d="M6.25 2h7.5A4.25 4.25 0 0 1 18 6.25v7.5A4.25 4.25 0 0 1 13.75 18h-7.5A4.25 4.25 0 0 1 2 13.75v-7.5A4.25 4.25 0 0 1 6.25 2zm0 2A2.25 2.25 0 0 0 4 6.25v7.5A2.25 2.25 0 0 0 6.25 16h7.5A2.25 2.25 0 0 0 16 13.75v-7.5A2.25 2.25 0 0 0 13.75 4h-7.5z" />
              </svg>
              {CONTACT.instagramHandle}
            </a>
          </div>
        </div>

        {/* Link columns */}
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-display text-sm font-semibold text-fg mb-4">
              {c.title}
            </h4>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-fg-muted">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} Jude Mental Health Society ·{" "}
              <span className="font-medium">{CONTACT.domain}</span>
            </p>
            <p>
              General enquiries:{" "}
              <a className="hover:text-fg" href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}>
                {CONTACT.phone}
              </a>{" "}
              ·{" "}
              <a className="hover:text-fg" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>
            <p>
              JMHS is an independent mental health advocacy initiative — not a
              registered NGO and not an emergency service. If you or someone else
              is in immediate danger, contact local emergency services.
            </p>
          </div>
          <QuickExitButton />
        </div>
      </div>
    </footer>
  );
}
