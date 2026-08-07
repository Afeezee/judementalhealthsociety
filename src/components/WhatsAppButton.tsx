import { getActiveWhatsAppInvite } from "@/lib/public-data";

/**
 * Server component — pulls the currently-active invite link from the DB.
 * All pages that surface this button are server components too, so the
 * fetch happens at render time with no client waterfall.
 */
export async function WhatsAppButton({
  className = "",
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "lg";
}) {
  const href = await getActiveWhatsAppInvite();
  const cls =
    size === "lg"
      ? "px-5 py-3 text-sm"
      : "px-3 py-1.5 text-xs";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1EBE5A] transition-colors ${cls} ${className}`}
    >
      <svg viewBox="0 0 24 24" className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.5-1.5c-.9-.8-1.5-1.9-1.7-2.2s0-.5.1-.6c.1-.1.3-.3.4-.5s.2-.3.3-.5 0-.4 0-.5-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4S6 7.6 6 9s1 2.7 1.1 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4z"/>
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3C4 15 3.4 13.5 3.4 12 3.4 7.3 7.3 3.4 12 3.4S20.6 7.3 20.6 12 16.7 20.1 12 20.1z"/>
      </svg>
      Join our WhatsApp community
    </a>
  );
}
