import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { getCurrentDbUser, ROLE_LABEL, roleAtLeast, type Role } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";

/**
 * Admin layout — Clerk middleware guarantees the user is signed in before
 * this renders. We upsert the DB row (via getCurrentDbUser) so the founder
 * email lands as super_admin on first sign-in, then render the sidebar
 * filtered by the current user's role.
 */

type NavItem = { href: string; label: string; role?: Role };

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Analytics", role: "website_administrator" },
  { href: "/admin/announcements", label: "Announcements", role: "content_editor" },
  { href: "/admin/lectures", label: "Monthly Lectures", role: "content_editor" },
  { href: "/admin/resources", label: "Resource Centre", role: "content_editor" },
  { href: "/admin/competition", label: "Writing Competition", role: "competition_coordinator" },
  { href: "/admin/forum", label: "Forum moderation", role: "moderator" },
  { href: "/admin/directory", label: "Professional directory", role: "content_editor" },
  { href: "/admin/impact", label: "Impact counter", role: "content_editor" },
  { href: "/admin/content", label: "Content editor", role: "content_editor" },
  { href: "/admin/whatsapp", label: "WhatsApp settings", role: "website_administrator" },
  { href: "/admin/users", label: "Users & roles", role: "super_admin" },
  { href: "/admin/settings", label: "Site settings", role: "website_administrator" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const visible = NAV.filter((n) => !n.role || roleAtLeast(user.role, n.role));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-[240px_1fr] items-start">
      <aside className="lg:sticky lg:top-24 rounded-2xl border border-hairline bg-bg-surface p-4">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <LogoMark size={28} />
          <span className="font-display text-sm font-semibold text-fg leading-tight">
            JMHS Admin
          </span>
        </div>

        <div className="mt-3 mb-4 px-2">
          <div className="text-xs text-fg-muted">Signed in as</div>
          <div className="text-sm font-medium truncate">{user.email}</div>
          <div className="mt-1 inline-flex items-center rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {ROLE_LABEL[user.role]}
          </div>
        </div>

        <nav aria-label="Admin sections" className="mt-2">
          <ul className="flex flex-col gap-0.5">
            {visible.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="block px-3 py-2 rounded-md text-sm text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 pt-4 border-t border-hairline flex items-center justify-between px-2">
          <Link href="/" className="text-xs text-fg-muted hover:text-fg">
            ← Back to site
          </Link>
          <UserButton />
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
