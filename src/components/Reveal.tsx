"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-triggered reveal (spec §1.5).
 * Adds .is-visible when the child scrolls into view.
 * Respects prefers-reduced-motion via the CSS in globals.css.
 *
 * `as` picks between div and li (the two contexts we actually use).
 * We deliberately avoid a fully-generic tag to keep the TS union small.
 */
export function Reveal({
  children,
  as = "div",
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  as?: "div" | "li" | "section";
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = delayMs ? { transitionDelay: `${delayMs}ms` } : undefined;
  const cls = `reveal ${seen ? "is-visible" : ""} ${className}`;

  if (as === "li") {
    return (
      <li
        ref={ref as React.RefObject<HTMLLIElement>}
        style={style}
        className={cls}
      >
        {children}
      </li>
    );
  }
  if (as === "section") {
    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        style={style}
        className={cls}
      >
        {children}
      </section>
    );
  }
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={style}
      className={cls}
    >
      {children}
    </div>
  );
}
