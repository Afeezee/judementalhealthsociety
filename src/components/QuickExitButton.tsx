"use client";

/**
 * Quick Exit — spec §1.6.
 * One click: instantly navigates away AND replaces the current history entry
 * so a single back-press cannot return the user here.
 * Present on every page.
 */
export function QuickExitButton({ className = "" }: { className?: string }) {
  function exit() {
    try {
      // Replace so back-navigation doesn't return here.
      window.location.replace("https://www.google.com");
    } catch {
      window.location.href = "https://www.google.com";
    }
  }

  return (
    <button
      type="button"
      onClick={exit}
      className={`inline-flex items-center gap-1.5 rounded-md border border-hairline bg-bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted hover:text-fg hover:border-fg-muted transition-colors ${className}`}
      aria-label="Quick exit — leave this site immediately"
      title="Quick exit — leaves this site and clears this page from your back button"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M4 4a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H6v10h4a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1V4z"/>
        <path d="M13.3 5.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L15.6 11H8a1 1 0 1 1 0-2h7.6l-2.3-2.3a1 1 0 0 1 0-1.4z"/>
      </svg>
      Quick exit
    </button>
  );
}
