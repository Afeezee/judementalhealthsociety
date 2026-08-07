import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db/client";
import { PageTitle, Card, EmptyState } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Forum moderation" };

async function resolveFlag(id: string, status: "reviewed_kept" | "reviewed_removed") {
  "use server";
  const gate = await requireRole("moderator");
  if (!gate.ok) throw new Error("Not authorised");
  await db.update(schema.forumFlags).set({ status, resolvedAt: new Date() }).where(eq(schema.forumFlags.id, id));
  if (status === "reviewed_removed") {
    const flags = await db.select().from(schema.forumFlags).where(eq(schema.forumFlags.id, id)).limit(1);
    if (flags[0]) {
      await db.update(schema.forumPosts).set({ removedAt: new Date() }).where(eq(schema.forumPosts.id, flags[0].postId));
    }
  }
  revalidatePath("/admin/forum");
}

export default async function ForumAdmin() {
  const gate = await requireRole("moderator");
  if (!gate.ok) redirect("/admin");

  const flags = await db
    .select({
      flag: schema.forumFlags,
      post: schema.forumPosts,
      thread: schema.forumThreads,
    })
    .from(schema.forumFlags)
    .leftJoin(schema.forumPosts, eq(schema.forumFlags.postId, schema.forumPosts.id))
    .leftJoin(schema.forumThreads, eq(schema.forumPosts.threadId, schema.forumThreads.id))
    .where(eq(schema.forumFlags.status, "open"))
    .orderBy(desc(schema.forumFlags.createdAt))
    .limit(50);

  return (
    <>
      <PageTitle
        kicker="Forum"
        title="Moderation queue"
        description="Open flags first. Removing a post soft-deletes it (sets removed_at) — the audit trail is preserved."
      />

      {flags.length === 0 ? (
        <EmptyState
          title="No open flags"
          description="The forum is quiet. When posts get reported they'll appear here for you to review."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-hairline">
            {flags.map(({ flag, post, thread }) => (
              <li key={flag.id} className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-signal-red font-semibold">
                      Reported {new Date(flag.createdAt).toLocaleDateString("en-GB")}
                    </div>
                    <div className="mt-1 font-display text-lg font-medium">
                      {thread?.title ?? "(thread deleted)"}
                    </div>
                    <p className="mt-2 text-sm text-fg whitespace-pre-wrap">{post?.body ?? "(post deleted)"}</p>
                    <div className="mt-3 text-sm">
                      <span className="text-fg-muted">Reason: </span>
                      <span className="text-fg">{flag.reason}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={resolveFlag.bind(null, flag.id, "reviewed_kept")}>
                      <button className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand">
                        Keep
                      </button>
                    </form>
                    <form action={resolveFlag.bind(null, flag.id, "reviewed_removed")}>
                      <button className="rounded-full bg-signal-red text-white px-3 py-1.5 text-xs font-semibold hover:bg-signal-red-strong">
                        Remove post
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
