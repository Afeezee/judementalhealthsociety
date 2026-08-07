"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

/**
 * Sets data-theme on <html>; persists to localStorage.
 * Companion inline script in <head> (see layout.tsx) applies the
 * stored value pre-hydration so there's no flash of wrong theme.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("jmhs-theme") as Theme | null) ?? "system";
    setTheme(stored);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    localStorage.setItem("jmhs-theme", next);
    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
  }

  // Cycle: system -> light -> dark -> system
  function cycle() {
    const order: Theme[] = ["system", "light", "dark"];
    const i = order.indexOf(theme);
    apply(order[(i + 1) % order.length]);
  }

  const label =
    theme === "system" ? "System theme" : theme === "light" ? "Light theme" : "Dark theme";

  return (
    <button
      type="button"
      onClick={cycle}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-md border border-hairline text-fg-muted hover:text-fg hover:border-fg-muted transition-colors ${className}`}
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label}`}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M17.3 12.9a7 7 0 0 1-9.4-9.4A7 7 0 1 0 17.3 12.9z" />
        </svg>
      ) : theme === "light" ? (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M10 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm4.24 1.76a1 1 0 0 1 0 1.42l-.7.7a1 1 0 0 1-1.42-1.4l.7-.72a1 1 0 0 1 1.42 0zM16 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm-1.76 4.24a1 1 0 0 1-1.42 0l-.7-.7a1 1 0 1 1 1.4-1.42l.72.7a1 1 0 0 1 0 1.42zM10 14a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-4.24-.24a1 1 0 0 1 0-1.42l.7-.7a1 1 0 1 1 1.42 1.4l-.7.72a1 1 0 0 1-1.42 0zM4 10a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm1.76-4.24a1 1 0 0 1 1.42 0l.7.7A1 1 0 1 1 6.46 7.9l-.7-.72a1 1 0 0 1 0-1.42zM10 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M4 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3v1h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h2v-1H6a2 2 0 0 1-2-2V5zm2 0v7h8V5H6z" />
        </svg>
      )}
    </button>
  );
}
