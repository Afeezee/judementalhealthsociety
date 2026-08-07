import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole, ROLE_LABEL, type Role, SUPER_ADMIN_EMAIL } from "@/lib/auth";

export const metadata = { title: "Users & roles" };

// Only super_admin sees this page (spec §3).

async function setRole(formData: FormData) {
  "use server";
  const gate = await requireRole("super_admin");
  if (!gate.ok) throw new Error("Not authorised");
  const id = String(formData.get("id"));
  const role = String(formData.get("role")) as Role;

  // Belt-and-braces: prevent demoting the founder email out of super_admin.
  const target = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  if (target[0]?.email.toLowerCase() === SUPER_ADMIN_EMAIL && role !== "super_admin") {
    throw new Error("Cannot demote the founder Super Admin");
  }

  await db.update(schema.users).set({ role, updatedAt: new Date() }).where(eq(schema.users.id, id));
  revalidatePath("/admin/users");
}

async function deleteUser(id: string) {
  "use server";
  const gate = await requireRole("super_admin");
  if (!gate.ok) throw new Error("Not authorised");
  const target = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  if (target[0]?.email.toLowerCase() === SUPER_ADMIN_EMAIL) {
    throw new Error("Cannot delete the founder Super Admin");
  }
  await db.delete(schema.users).where(eq(schema.users.id, id));
  revalidatePath("/admin/users");
}

const ROLES: Role[] = [
  "super_admin",
  "website_administrator",
  "competition_coordinator",
  "content_editor",
  "moderator",
];

export default async function UsersAdmin() {
  const gate = await requireRole("super_admin");
  if (!gate.ok) redirect("/admin");

  const users = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));

  return (
    <>
      <PageTitle
        kicker="Super Admin only"
        title="Users & roles"
        description={`New admins sign up at /sign-up and land here with the Content Editor role. Promote them from this page. ${SUPER_ADMIN_EMAIL} is protected from demotion.`}
      />

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated">
            <tr className="text-left">
              <th className="p-3 font-semibold">Name / email</th>
              <th className="p-3 font-semibold">Role</th>
              <th className="p-3 font-semibold">Change to…</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isFounder = u.email.toLowerCase() === SUPER_ADMIN_EMAIL;
              return (
                <tr key={u.id} className="border-t border-hairline">
                  <td className="p-3">
                    <div className="font-medium">{u.fullName ?? "—"}</div>
                    <div className="text-fg-muted text-xs">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {ROLE_LABEL[u.role]}
                    </span>
                    {isFounder && <span className="ml-2 text-[10px] text-fg-muted">(founder)</span>}
                  </td>
                  <td className="p-3">
                    <form action={setRole} className="flex gap-2 items-center">
                      <input type="hidden" name="id" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        disabled={isFounder}
                        className="rounded-lg border border-hairline bg-bg px-2 py-1"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={isFounder}
                        className="rounded-full bg-brand text-white px-3 py-1 text-xs font-semibold hover:bg-brand-hover disabled:opacity-40"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="p-3 text-right">
                    <form action={deleteUser.bind(null, u.id)}>
                      <button
                        disabled={isFounder}
                        className="text-xs font-semibold text-signal-red hover:text-signal-red-strong disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
