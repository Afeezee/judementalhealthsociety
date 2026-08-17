/**
 * Site-wide settings — single source of truth used across the public site.
 *
 * These values back the About page copy, contact details, competition
 * details, and next lecture. Anything DB-editable from the admin dashboard
 * lives as a fallback here so pages render even when the DB row is missing.
 *
 * Structured to be edited from /admin/settings and /admin/content without
 * pages having to be recompiled.
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
 * Home hero copy — editable from /admin/content.
 * Kept short: the hero should breathe.
 */
export const HOME_HERO = {
  eyebrow: "Jude Mental Health Society",
  headline: "Every word can make a difference.",
  headlineAccent: "Every voice matters.",
  subhead:
    "An independent Nigerian mental health advocacy initiative founded in memory of Jude Anuoluwa. We promote conversations that educate, reduce stigma, and foster communities where seeking help is recognised as a sign of strength.",
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
 * Writing Competition — full details from the 2026 handbook.
 * The submission URL is the specific Sculptform form for this year.
 * Override via NEXT_PUBLIC_SCULPTFORM_URL for future years.
 */
export const COMPETITION = {
  themeYear: 2026,
  theme: "Using the Power of Words to Promote Mental Health and Prevent Suicide",
  opens: "2026-08-07",
  deadline: "2026-09-13",
  announcement: "2026-09-27",
  publication: "Week following the announcement",
  submissionUrl:
    process.env.NEXT_PUBLIC_SCULPTFORM_URL ||
    "https://www.sculptform.live/f/31NiLd0fbuJU",

  eligibility:
    "Open to everyone — regardless of age, profession, or educational background.",

  objectives: [
    "Promote conversations about mental health.",
    "Encourage empathy and compassion.",
    "Reduce stigma.",
    "Inspire hope.",
    "Encourage creative expression.",
    "Build a permanent digital library of mental health writings on the JMHS website.",
  ],

  /**
   * Nine formats from the 2026 handbook. Length limits: everything except
   * short story is capped at 2 pages; short story is capped at 8 pages.
   */
  categories: [
    { label: "Essay", limit: "Max 2 pages" },
    { label: "Poetry", limit: "Max 2 pages" },
    { label: "Spoken Word Script", limit: "Max 2 pages" },
    { label: "Short Story", limit: "Max 8 pages" },
    { label: "Personal Reflection", limit: "Max 2 pages" },
    { label: "Letter", limit: "Max 2 pages" },
    { label: "Creative Non-fiction", limit: "Max 2 pages" },
    { label: "Inspirational Writing", limit: "Max 2 pages" },
    { label: "Any other original literary format", limit: "Max 2 pages" },
  ],

  judgingCriteria: [
    { criterion: "Relevance to Theme", weight: 40 },
    { criterion: "Originality", weight: 30 },
    { criterion: "Clarity and Structure", weight: 20 },
    { criterion: "Emotional Impact", weight: 10 },
  ],

  prizeStructure: [
    "Winner",
    "First Runner-up",
    "Second Runner-up",
    "Honourable Mentions",
    "Digital certificate of participation for every entrant",
  ],

  submissionRules: [
    "Each participant may submit one entry only.",
    "Your entry must be your own original work — no plagiarism, no AI-only writing passed off as your own.",
    "Written in English.",
    "Relates to this year's theme.",
    "Has a unique title.",
    "Contains no participant name or any identifying information inside the manuscript file.",
    "Contains nothing offensive, discriminatory, or hateful.",
    "Does not promote self-harm or suicide as a solution.",
    "All categories except Short Story are max 2 pages. Short Story is max 8 pages.",
    "Submitted as a Word document (.doc / .docx) or PDF.",
  ],

  submissionProcess: [
    "Your written work — the manuscript itself, containing no identifying information.",
    "A separate registration form — your name, contact details, and demographics.",
    "Your consent — whether we may publish your entry on the JMHS website.",
    "The writing itself stays anonymous throughout judging.",
  ],

  codeOfConduct: [
    "Respect others.",
    "Submit truthful and original work.",
    "Avoid plagiarism.",
    "Promote hope and responsible mental health conversations.",
  ],

  publicationDetails: [
    "Entries where the author consents will be published on the JMHS website.",
    "Each entry gets its own permanent page — title, content, publication date, moderated comments, and share options.",
    "Authors retain copyright. Consenting to publication grants JMHS a non-exclusive licence to publish and archive the work for advocacy and educational purposes.",
  ],

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
