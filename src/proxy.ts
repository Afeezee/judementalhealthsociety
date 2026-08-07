import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Public site is entirely login-free. Only /admin/* and its API are gated.
 * (Public spec §2 — the crisis page must be reachable without auth.)
 */
const isAdmin = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdmin(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Match everything except static/image/asset files and _next internals.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
