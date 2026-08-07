import { redirect } from "next/navigation";
import { PageTitle, Card } from "@/components/AdminChrome";
import { requireRole } from "@/lib/auth";
import { ImportForm } from "@/components/ImportForm";

export const metadata = { title: "Import submissions" };

export default async function ImportPage() {
  const gate = await requireRole("competition_coordinator");
  if (!gate.ok) redirect("/admin");

  return (
    <>
      <PageTitle
        kicker="Writing Competition"
        title="Import from Sculptform"
        description="Upload the Sculptform export (CSV or XLSX). Every row is split into a manuscript and an identity record at ingest — before any human here reads it. Judges only ever see the manuscript side."
      />

      <Card className="mb-6 bg-brand/5 border-brand/30">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand">Expected columns</div>
        <p className="mt-2 text-sm">
          Column names are matched case-insensitively. Aliases in parentheses.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-fg-muted">
          <li><strong className="text-fg">title</strong> (entry title, submission title)</li>
          <li><strong className="text-fg">content</strong> (entry, body, submission, text)</li>
          <li><strong className="text-fg">category</strong> (entry category, type)</li>
          <li><strong className="text-fg">submitted at</strong> (date, timestamp)</li>
          <li><strong className="text-fg">full name</strong> (name, author)</li>
          <li><strong className="text-fg">email</strong></li>
          <li><strong className="text-fg">phone</strong> (whatsapp)</li>
          <li><strong className="text-fg">country</strong>, <strong className="text-fg">state</strong>, <strong className="text-fg">occupation</strong></li>
          <li><strong className="text-fg">consent to publish</strong> — "yes" / "anonymous" / "no"</li>
        </ul>
      </Card>

      <ImportForm />
    </>
  );
}
