"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type StripAnnouncement = {
  id: string;
  label?: string;         // e.g. "Writing Competition"
  message: string;
  href?: string;
};

/**
 * Slim, dismissible bar for time-sensitive items (spec §2.1).
 * Dismissal is per-announcement id, persisted to localStorage —
 * a new announcement re-appears.
 * Content ultimately comes from admin; for now we accept a prop.
 */
export function AnnouncementsStrip({ items }: { items: StripAnnouncement[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("jmhs-dismissed-announcements");
      if (raw) setDismissed(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const visible = items.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;
  const cur = visible[idx % visible.length];

  function dismiss() {
    const next = new Set(dismissed);
    next.add(cur.id);
    setDismissed(next);
    try {
      localStorage.setItem("jmhs-dismissed-announcements", JSON.stringify([...next]));
    } catch {}
  }

  const inner = (
    <>
      {cur.label && (
        <span className="hidden sm:inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          {cur.label}
        </span>
      )}
      <span className="truncate">{cur.message}</span>
    </>
  );

  return (
    <div className="bg-brand text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {cur.href ? (
            <Link href={cur.href} className="flex items-center gap-2 flex-1 min-w-0 hover:underline underline-offset-2">
              {inner}
            </Link>
          ) : (
            <span className="flex items-center gap-2 flex-1 min-w-0">{inner}</span>
          )}
        </div>
        {visible.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] opacity-80">
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + visible.length) % visible.length)}
              className="px-1.5 py-0.5 rounded hover:bg-white/10"
              aria-label="Previous announcement"
            >
              ‹
            </button>
            <span aria-live="polite">
              {(idx % visible.length) + 1} / {visible.length}
            </span>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % visible.length)}
              className="px-1.5 py-0.5 rounded hover:bg-white/10"
              aria-label="Next announcement"
            >
              ›
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="rounded p-1 hover:bg-white/10"
          aria-label="Dismiss announcement"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6.3 5a1 1 0 0 0-.7 1.7L8.6 10l-3 3a1 1 0 1 0 1.4 1.4l3-3 3 3a1 1 0 1 0 1.4-1.4l-3-3 3-3a1 1 0 1 0-1.4-1.4l-3 3-3-3A1 1 0 0 0 6.3 5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
