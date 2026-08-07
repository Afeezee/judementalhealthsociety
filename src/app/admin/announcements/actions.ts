"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { requireRole } from "@/lib/auth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function saveAnnouncement(formData: FormData) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");

  const id = (formData.get("id") as string | null) || null;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "General") as
    (typeof schema.announcementCategoryEnum.enumValues)[number];
  const publishAt = new Date(String(formData.get("publishAt") ?? new Date().toISOString()));
  const strip = formData.get("strip") === "on";
  const href = String(formData.get("href") ?? "").trim() || null;

  if (!title || !body) throw new Error("Title and body are required");

  if (id) {
    await db
      .update(schema.announcements)
      .set({ title, body, category, publishAt, strip, href, updatedAt: new Date() })
      .where(eq(schema.announcements.id, id));
  } else {
    const slug = slugify(title) || crypto.randomUUID().slice(0, 8);
    await db.insert(schema.announcements).values({
      slug: `${slug}-${Date.now().toString(36)}`,
      title,
      body,
      category,
      publishAt,
      strip,
      href,
      createdBy: gate.user.id,
    });
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");

  await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/admin/announcements");
}
