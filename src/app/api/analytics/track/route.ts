import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db/client";

/**
 * Lightweight analytics beacon endpoint.
 *
 * Called via `navigator.sendBeacon` from AnalyticsBeacon on every route
 * change and on tracked link clicks. We intentionally do NOT store IP,
 * user agent, or Clerk userId — see schema.ts for the privacy stance.
 *
 * Always returns 204 (No Content) even on validation error, so a bad
 * client payload can never break a user's navigation.
 */

export const runtime = "nodejs";

// Anything longer than this from the client is truncated rather than
// rejected — /admin URLs and query strings can get long.
const MAX_STR = 500;

type Body = {
  type?: string;
  path?: string;
  target?: string;
  sessionId?: string;
  referrer?: string;
};

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json().catch(() => ({}))) as Body;
    const type = raw.type === "link_click" ? "link_click" : "page_view";
    const path = clean(raw.path, MAX_STR);
    if (!path) return new NextResponse(null, { status: 204 });

    // Only keep same-origin referrer — never log where visitors came from.
    let referrer = "";
    const rawRef = clean(raw.referrer, MAX_STR);
    if (rawRef) {
      try {
        const url = new URL(rawRef);
        if (url.origin === req.nextUrl.origin) referrer = url.pathname + url.search;
      } catch {
        // Not a valid URL — drop it.
      }
    }

    // Ignore admin routes so admin browsing doesn't skew the numbers.
    if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

    await db.insert(schema.analyticsEvents).values({
      type,
      path,
      target: clean(raw.target, 200),
      sessionId: clean(raw.sessionId, 32),
      referrer,
    });
  } catch {
    // Analytics must never break the app. Swallow all errors —
    // missing table, connection failure, whatever — and return 204.
  }
  return new NextResponse(null, { status: 204 });
}
