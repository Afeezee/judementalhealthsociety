import { PageTitle } from "@/components/AdminChrome";
import { ResourceForm } from "@/components/ResourceForm";

export const metadata = { title: "New resource" };

export default function NewResource() {
  return (
    <>
      <PageTitle kicker="Resource Centre" title="New article" />
      <ResourceForm row={null} />
    </>
  );
}
