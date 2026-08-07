"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { CrisisButton } from "./CrisisButton";
import { ThemeToggle } from "./ThemeToggle";
import { TextSizeControl } from "./TextSizeControl";

// AI Companion isn't in the nav — a floating chat bubble handles it on
// every page (see components/ChatBubble.tsx). The bubble is more
// discoverable and consistent with modern chat UX than a nav link.
const NAV = [
  { href: "/about", label: "About" },
  { href: "/lectures", label: "Lectures" },
  { href: "/resources", label: "Resources" },
  { href: "/competition", label: "Writing Competition" },
  { href: "/directory", label: "Find Support" },
  { href: "/forum", label: "Community" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-sm border-b border-hairline">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-1 ml-6 flex-1"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-1.5 text-sm text-fg-muted hover:text-fg rounded-md hover:bg-bg-elevated transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <TextSizeControl />
          </div>
          <ThemeToggle />
          <CrisisButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-hairline text-fg-muted hover:text-fg"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              {open ? (
                <path d="M6.3 5a1 1 0 0 0-.7 1.7L8.6 10l-3 3a1 1 0 1 0 1.4 1.4l3-3 3 3a1 1 0 1 0 1.4-1.4l-3-3 3-3a1 1 0 1 0-1.4-1.4l-3 3-3-3A1 1 0 0 0 6.3 5z" />
              ) : (
                <path d="M3 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm1 3a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          aria-label="Primary mobile"
          className="lg:hidden border-t border-hairline bg-bg-surface"
        >
          <ul className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-fg hover:bg-bg-elevated"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <TextSizeControl />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
