"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Client-side analytics beacon.
 *
 * Fires a page_view on every route change, and captures link_click for
 * any <a data-track="..."> elements bubbled up to the document. Uses
 * `navigator.sendBeacon` where available so tracking never blocks
 * navigation.
 *
 * A short random session id lives in sessionStorage — it dies when the
 * tab closes, so we get useful "did this person visit two pages?" data
 * without any cross-session tracking. No cookies, no IP, no user agent.
 *
 * Never renders anything.
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem("jmhs-session");
    if (existing) return existing;
    // 12 random base36 characters — enough entropy for de-dup, tiny on wire.
    const fresh =
      Math.random().toString(36).slice(2, 8) +
      Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem("jmhs-session", fresh);
    return fresh;
  } catch {
    return "";
  }
}

function send(payload: Record<string, string>) {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
      return;
    }
    // Fallback — fire-and-forget fetch, keepalive so it survives navigation.
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Ignore. Analytics must never break the app.
  }
}

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Page view on every route change.
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return; // don't count admin browsing
    const qs = searchParams?.toString();
    send({
      type: "page_view",
      path: qs ? `${pathname}?${qs}` : pathname,
      sessionId: getSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [pathname, searchParams]);

  // Delegated link_click capture — any <a data-track="key"> click is logged.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as Element | null)?.closest?.("a[data-track]");
      if (!anchor) return;
      const target = anchor.getAttribute("data-track") || "";
      const href = anchor.getAttribute("href") || "";
      send({
        type: "link_click",
        path: pathname || "",
        target: `${target}${href ? `|${href}` : ""}`.slice(0, 200),
        sessionId: getSessionId(),
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
