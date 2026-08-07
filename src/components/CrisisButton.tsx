import Link from "next/link";

/**
 * The single most important control on the site (spec §6).
 * Filled red pill, sticky-visible in the header on every page.
 * Never used decoratively — red is reserved for the crisis system.
 * Prefetch enabled so the destination loads instantly with no animation.
 */
export function CrisisButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/emergency"
      prefetch
      className={`inline-flex items-center gap-2 rounded-full bg-signal-red px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-signal-red-strong/20 hover:bg-signal-red-strong focus-visible:outline-signal-red transition-colors ${className}`}
      aria-label="Get help now — emergency support"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H3a1 1 0 1 1 0-2h6V3a1 1 0 0 1 1-1z" />
      </svg>
      Get Help Now
    </Link>
  );
}
