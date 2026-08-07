/**
 * PulseLine — the signature motion motif (spec §1.4).
 * Variants:
 *  - hero     : large, ambient, subtle drift
 *  - draw     : one-shot self-drawing (used behind the Impact Counter)
 *  - divider  : small, static, section divider
 */

type Variant = "hero" | "draw" | "divider";

// A single reusable heartbeat trace. Wide viewBox so it stretches
// across whatever container it sits in (preserveAspectRatio=none).
const PATH_D =
  "M0 40 L120 40 L150 40 L165 22 L175 60 L185 12 L195 68 L205 40 L240 40 L360 40 L380 40 L395 22 L405 58 L415 20 L425 60 L435 40 L520 40 L640 40 L660 40 L675 24 L685 56 L695 18 L705 62 L715 40 L800 40";

export function PulseLine({
  variant = "divider",
  className = "",
  ariaLabel,
}: {
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
}) {
  const height =
    variant === "hero" ? "h-40 md:h-56" : variant === "draw" ? "h-24" : "h-6";

  const motionClass =
    variant === "hero"
      ? "pulse-line-ambient"
      : variant === "draw"
      ? "pulse-line-anim"
      : "";

  return (
    <svg
      viewBox="0 0 800 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={`pulse-line-svg block w-full ${height} ${motionClass} ${className}`}
    >
      <path d={PATH_D} />
    </svg>
  );
}
