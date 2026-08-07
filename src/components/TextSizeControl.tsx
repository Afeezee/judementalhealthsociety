"use client";

import { useEffect, useState } from "react";

/**
 * Accessibility control: adjustable text size (spec §1.6).
 * Writes to --type-scale on <html>; persists to localStorage.
 * The inline theme script in layout.tsx applies the stored value pre-hydration.
 */
const SCALES = [0.9, 1.0, 1.15, 1.3] as const;
type Scale = (typeof SCALES)[number];

export function TextSizeControl({ className = "" }: { className?: string }) {
  const [scale, setScale] = useState<Scale>(1.0);

  useEffect(() => {
    const raw = localStorage.getItem("jmhs-type-scale");
    const n = raw ? Number(raw) : 1.0;
    const found = (SCALES as readonly number[]).includes(n) ? (n as Scale) : 1.0;
    setScale(found);
  }, []);

  function apply(next: Scale) {
    setScale(next);
    localStorage.setItem("jmhs-type-scale", String(next));
    document.documentElement.style.setProperty("--type-scale", String(next));
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-md border border-hairline p-0.5 ${className}`}
      role="group"
      aria-label="Text size"
    >
      {SCALES.map((s, i) => (
        <button
          key={s}
          type="button"
          onClick={() => apply(s)}
          aria-label={`Text size ${["small", "default", "large", "extra large"][i]}`}
          aria-pressed={scale === s}
          className={`inline-flex items-center justify-center h-7 w-7 rounded font-semibold transition-colors ${
            scale === s
              ? "bg-brand text-white"
              : "text-fg-muted hover:text-fg hover:bg-bg-elevated"
          }`}
          style={{ fontSize: `${10 + i * 2}px` }}
        >
          A
        </button>
      ))}
    </div>
  );
}
