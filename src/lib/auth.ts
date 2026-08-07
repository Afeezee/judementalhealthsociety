import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";

/**
 * The one email that boots to super_admin on first sign-in (spec §3).
 * Kept lowercase; comparison is case-insensitive.
 */
export const SUPER_ADMIN_EMAIL = "olagunjuafeez@gmail.com";

export type Role = typeof schema.users.$inferSelect["role"];

const ROLE_RANK: Record<Role, number> = {
  super_admin: 5,
  website_administrator: 4,
  competition_coordinator: 3,
  content_editor: 2,
  moderator: 1,
};

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

/**
 * Load (or upsert) the internal user row for the current Clerk session.
 * Returns null if not signed in. On first-ever sign-in, the row is created
 * with the special-case super_admin role for the founder email, or the
 * default `content_editor` role for everyone else — a super_admin can
 * upgrade them from the Users & Roles panel later.
 */
export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Fast-path: existing user
  const rows = await db.query.users.findMany({
    where: eq(schema.users.clerkId, userId),
    limit: 1,
  });
  if (rows[0]) return rows[0];

  // First sign-in — fetch Clerk profile and upsert.
  const cu = await currentUser();
  if (!cu) return null;
  const primaryEmail =
    cu.primaryEmailAddress?.emailAddress ??
    cu.emailAddresses?.[0]?.emailAddress ??
    "";
  const isSuper = primaryEmail.trim().toLowerCase() === SUPER_ADMIN_EMAIL;

  const [created] = await db
    .insert(schema.users)
    .values({
      clerkId: userId,
      email: primaryEmail,
      fullName: [cu.firstName, cu.lastName].filter(Boolean).join(" ") || null,
      role: isSuper ? "super_admin" : "content_editor",
    })
    .onConflictDoUpdate({
      target: schema.users.clerkId,
      set: { email: primaryEmail, updatedAt: new Date() },
    })
    .returning();

  return created;
}

/** Throws (via redirect on the caller) if not at least the given role. */
export async function requireRole(minimum: Role) {
  const user = await getCurrentDbUser();
  if (!user) return { ok: false as const, reason: "signed-out" as const };
  if (!roleAtLeast(user.role, minimum))
    return { ok: false as const, reason: "insufficient-role" as const, user };
  return { ok: true as const, user };
}

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  website_administrator: "Website Administrator",
  competition_coordinator: "Competition Coordinator",
  content_editor: "Content Editor",
  moderator: "Moderator",
};
