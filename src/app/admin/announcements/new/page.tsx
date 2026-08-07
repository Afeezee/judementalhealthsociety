import { PageTitle } from "@/components/AdminChrome";
import { AnnouncementForm } from "@/components/AnnouncementForm";

export const metadata = { title: "New announcement" };

export default function NewAnnouncement() {
  return (
    <>
      <PageTitle kicker="Announcements" title="New announcement" />
      <AnnouncementForm row={null} />
    </>
  );
}
