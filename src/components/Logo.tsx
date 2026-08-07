import Image from "next/image";
import Link from "next/link";

/**
 * JMHS Brain Mark — the actual brain from the official JMHS Logo PNG,
 * extracted with a transparent background by scripts/extract-logo.ts.
 *
 * Because the brain is solid blue on transparency, it shows correctly
 * on BOTH light and dark surfaces without any theme-aware swapping.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/jmhs-brain.png"
      alt=""
      width={size}
      height={Math.round(size * (368 / 406))} // preserve extracted aspect
      priority
      className={className}
    />
  );
}

/**
 * Header wordmark.
 *  - Brain via the extracted PNG (always blue, always visible).
 *  - Text via HTML — inherits text-fg, so it turns navy in light mode
 *    and light grey in dark mode.
 *  - Compact layout: JUDE hugs "Mental Health" underneath (leading-none
 *    zero-gap stack). "Mental Health" is kept together on one line via
 *    whitespace-nowrap; "Society" wraps to its own line. `min-w-0` on
 *    the flex row protects the nav from ever getting squeezed.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group min-w-0 ${className}`}
      aria-label="Jude Mental Health Society — home"
    >
      <span className="shrink-0 transition-transform group-hover:scale-105">
        <LogoMark size={40} />
      </span>
      <span className="flex flex-col leading-none text-fg group-hover:text-brand transition-colors">
        <span className="font-display text-[19px] font-extrabold tracking-tight">
          JUDE
        </span>
        <span className="font-display text-[9px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap leading-[1.1]">
          Mental Health
        </span>
        <span className="font-display text-[9px] font-semibold uppercase tracking-[0.14em] leading-[1.1]">
          Society
        </span>
      </span>
    </Link>
  );
}
