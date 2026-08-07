import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { PageTitle } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { LectureForm } from "@/components/LectureForm";

export const metadata = { title: "Admin — Lectures" };

export default async function AdminLectures() {
  const gate = await requireRole("content_editor");
  if (!gate.ok) redirect("/admin");

  const rows = await db.select().from(schema.lectures).orderBy(desc(schema.lectures.date));

  return (
    <>
      <PageTitle
        kicker="Monthly Lecture Series"
        title="Lectures"
        description='The lecture marked "Is next" appears on the homepage teaser and the /lectures page.'
      />

      <div className="space-y-4">
        <LectureForm row={null} />

        {rows.length > 0 && (
          <div className="pt-6">
            <h2 className="font-display text-lg font-medium mb-3">All lectures</h2>
            <ul className="space-y-3">
              {rows.map((l) => (
                <li key={l.id}>
                  <LectureForm row={l} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
