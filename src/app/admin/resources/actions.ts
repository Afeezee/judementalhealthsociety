"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { requireRole } from "@/lib/auth";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

export async function saveResource(formData: FormData) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");

  const id = (formData.get("id") as string | null) || null;
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "learning-and-prevention") as
    (typeof schema.resourceCategoryEnum.enumValues)[number];
  const readingMinutes = Number(formData.get("readingMinutes") ?? 5);
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const publishedAt = new Date(String(formData.get("publishedAt") ?? new Date().toISOString()));

  if (!title || !excerpt || !body) throw new Error("Title, excerpt and body are required");

  if (id) {
    await db
      .update(schema.resources)
      .set({ title, excerpt, body, category, readingMinutes, tags, publishedAt, updatedAt: new Date() })
      .where(eq(schema.resources.id, id));
    revalidatePath(`/resources/${(await db.select({ slug: schema.resources.slug }).from(schema.resources).where(eq(schema.resources.id, id)).limit(1))[0]?.slug ?? ""}`);
  } else {
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    await db.insert(schema.resources).values({
      slug, title, excerpt, body, category, readingMinutes, tags, publishedAt,
    });
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function deleteResource(id: string) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  await db.delete(schema.resources).where(eq(schema.resources.id, id));
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}
