import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle } from "@/components/AdminChrome";
import { AnnouncementForm } from "@/components/AnnouncementForm";

export const metadata = { title: "Edit announcement" };

export default async function EditAnnouncement({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(schema.announcements)
    .where(eq(schema.announcements.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return notFound();

  return (
    <>
      <PageTitle kicker="Announcements" title="Edit announcement" />
      <AnnouncementForm row={row} />
    </>
  );
}
