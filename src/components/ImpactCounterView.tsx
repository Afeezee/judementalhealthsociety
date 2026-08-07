"use client";

import { useEffect, useRef, useState } from "react";
import { PulseLine } from "./PulseLine";

type Metric = { key: string; label: string; value: number; suffix: string; note: string };

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduce) {
            setValue(target);
            io.disconnect();
            return;
          }
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / durationMs);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

function Counter({ target, suffix, label, note }: { target: number; suffix: string; label: string; note: string }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="font-display text-5xl md:text-6xl font-medium text-fg tabular-nums leading-none">
        {value.toLocaleString()}
        <span className="text-brand">{suffix}</span>
      </div>
      <div className="text-sm font-semibold text-fg">{label}</div>
      <div className="text-xs text-fg-muted">{note}</div>
    </div>
  );
}

export function ImpactCounterView({ metrics }: { metrics: Metric[] }) {
  return (
    <section aria-labelledby="impact-heading" className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-40">
        <PulseLine variant="draw" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="section-rule mb-6"><span>Our Impact</span></div>
          <h2 id="impact-heading" className="font-display text-3xl md:text-4xl font-medium">
            A growing community of people who refuse to let mental health stay silent.
          </h2>
          <p className="mt-4 text-fg-muted max-w-xl">
            Every number here represents a conversation started, a resource shared,
            or a person who now knows help is available.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:gap-8 md:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <Counter key={m.key} target={m.value} suffix={m.suffix} label={m.label} note={m.note} />
          ))}
        </div>
      </div>
    </section>
  );
}
