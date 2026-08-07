"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { requireRole } from "@/lib/auth";

export async function setDirectoryStatus(id: string, status: "verified" | "pending" | "rejected") {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  await db
    .update(schema.directoryListings)
    .set({
      status,
      verifiedAt: status === "verified" ? new Date() : null,
      verifiedBy: status === "verified" ? gate.user.id : null,
      updatedAt: new Date(),
    })
    .where(eq(schema.directoryListings.id, id));
  revalidatePath("/admin/directory");
  revalidatePath("/directory");
}

export async function deleteDirectoryListing(id: string) {
  const gate = await requireRole("content_editor");
  if (!gate.ok) throw new Error("Not authorised");
  await db.delete(schema.directoryListings).where(eq(schema.directoryListings.id, id));
  revalidatePath("/admin/directory");
  revalidatePath("/directory");
}
