import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle } from "@/components/AdminChrome";
import { ResourceForm } from "@/components/ResourceForm";

export const metadata = { title: "Edit resource" };

export default async function EditResource({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db.select().from(schema.resources).where(eq(schema.resources.id, id)).limit(1);
  const row = rows[0];
  if (!row) return notFound();

  return (
    <>
      <PageTitle kicker="Resource Centre" title="Edit article" />
      <ResourceForm row={row} />
    </>
  );
}
