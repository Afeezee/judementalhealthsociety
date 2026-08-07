"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { requireRole } from "@/lib/auth";

export async function saveLecture(formData: FormData) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");

  const id = (formData.get("id") as string | null) || null;
  const date = new Date(String(formData.get("date")));
  const topic = String(formData.get("topic") ?? "").trim() || null;
  const speaker = String(formData.get("speaker") ?? "").trim() || null;
  const joinLink = String(formData.get("joinLink") ?? "").trim() || null;
  const recordingUrl = String(formData.get("recordingUrl") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const isNext = formData.get("isNext") === "on";

  // Only one lecture can be flagged isNext at a time.
  if (isNext) {
    await db.update(schema.lectures).set({ isNext: false });
  }

  if (id) {
    await db
      .update(schema.lectures)
      .set({ date, topic, speaker, joinLink, recordingUrl, summary, isNext, updatedAt: new Date() })
      .where(eq(schema.lectures.id, id));
  } else {
    await db.insert(schema.lectures).values({
      date, topic, speaker, joinLink, recordingUrl, summary, isNext,
    });
  }
  revalidatePath("/admin/lectures");
  revalidatePath("/lectures");
  revalidatePath("/");
}

export async function deleteLecture(id: string) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  await db.delete(schema.lectures).where(eq(schema.lectures.id, id));
  revalidatePath("/admin/lectures");
  revalidatePath("/lectures");
}
