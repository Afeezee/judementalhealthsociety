/**
 * Site-wide settings that are ultimately editable from the admin dashboard's
 * Site Settings section (spec §3, §5). Until the DB is wired, this file is
 * the single source of truth so we don't hardcode these values into
 * components — swap this out for a DB read later without touching pages.
 */

export const WHATSAPP_INVITE =
  "https://chat.whatsapp.com/IkB8sF0vISwETjXgfRpLY4";

export const CONTACT = {
  phone: "+234 701 462 3270",
  emergencyPhone: "+234 813 958 2323",
  email: "hello@judementalhealthsociety.org",
  instagram: "https://instagram.com/judementalhealthsociety",
  instagramHandle: "@judementalhealthsociety",
  domain: "judementalhealthsociety.org",
};

/**
 * Impact Counter seed values (spec §2.10).
 * `isManual: true` means the admin sets this by hand — the rest will be
 * auto-computed from the database once wired.
 */
export const IMPACT_METRICS = [
  {
    key: "members",
    label: "Community members",
    value: 200,
    suffix: "+",
    isManual: true,
    note: "Students, professionals, practitioners, advocates, researchers",
  },
  {
    key: "lectures",
    label: "Monthly lectures held",
    value: 0,
    suffix: "",
    isManual: true,
    note: "Evidence-based mental health knowledge, monthly",
  },
  {
    key: "resources",
    label: "Resource articles published",
    value: 6,
    suffix: "",
    isManual: false,
    note: "Auto-tracked from the Resource Centre",
  },
  {
    key: "directory",
    label: "Verified professionals",
    value: 3,
    suffix: "",
    isManual: false,
    note: "Auto-tracked from the Professional Support Directory",
  },
  {
    key: "submissions",
    label: "Writing competition entries",
    value: 0,
    suffix: "",
    isManual: false,
    note: "Auto-tracked once the import pipeline is live",
  },
];

/**
 * Writing Competition timeline (spec §2.11 — confirmed).
 * `opens` and `prizes` remain TBD until confirmed.
 */
export const COMPETITION = {
  opens: null as string | null,
  deadline: "2026-09-13",
  announcement: "2026-09-27",
  publication: "Following week (per Handbook default)",
  prizes: null as string | null,
  coordinators: ["Latifat Abisola Olagoke", "Nwafor Miracle Chisom"],
  status: "submissions_open" as
    | "not_open"
    | "submissions_open"
    | "judging"
    | "winners_announced",
};

/**
 * Next monthly lecture. TBD state is supported (spec §2.4).
 */
export const NEXT_LECTURE = {
  date: "2026-09-27",
  topic: null as string | null,   // TBD — coordinators to confirm
  speaker: null as string | null, // TBD
  joinLink: null as string | null,
  note: "Winners of the 2026 JMHS National Writing Competition will be announced live during this lecture.",
};
