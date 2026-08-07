/**
 * Seed content used before the DB is wired.
 * Each type mirrors the eventual DB schema so the pages don't change when
 * they're switched from these arrays to a Drizzle query (spec §4).
 */

export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: "Competition" | "Lectures" | "General" | "Community";
  publishAt: string; // ISO
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "wc-2026-open",
    title: "2026 JMHS National Writing Competition is now open",
    body: "Submissions close on 13 September 2026. Winners will be announced live at the September Monthly Lecture on 27 September 2026.",
    category: "Competition",
    publishAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "lecture-sept-2026",
    title: "September Monthly Lecture — 27 September 2026",
    body: "Details of the topic and speaker will be shared soon. The evening will also mark the announcement of the 2026 Writing Competition winners.",
    category: "Lectures",
    publishAt: "2026-07-15T09:00:00.000Z",
  },
  {
    id: "directory-launch",
    title: "Professional Support Directory now live",
    body: "Our first three verified practitioners are listed — a psychiatrist, a trauma-informed care specialist, and a clinical psychology practitioner.",
    category: "General",
    publishAt: "2026-08-01T09:00:00.000Z",
  },
];

// ---------- Resource Centre articles (spec §2.5) ----------

export type ResourceCategory =
  | "struggling-right-now"
  | "supporting-someone-else"
  | "learning-and-prevention";

export const RESOURCE_CATEGORIES: {
  key: ResourceCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "struggling-right-now",
    label: "I'm struggling right now",
    description: "Immediate, calming guidance for when things feel overwhelming.",
  },
  {
    key: "supporting-someone-else",
    label: "Supporting someone else",
    description: "How to help a friend, partner, or family member who is struggling.",
  },
  {
    key: "learning-and-prevention",
    label: "Learning & prevention",
    description: "Understand mental health and act early — for yourself and others.",
  },
];

export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory;
  readingMinutes: number;
  publishedAt: string;
  excerpt: string;
  body: string; // Markdown-lite (paragraphs separated by blank lines)
  tags: string[];
};

export const RESOURCES: Resource[] = [
  {
    slug: "understanding-depression",
    title: "Understanding Depression: Signs, Myths, and How to Start the Conversation",
    category: "learning-and-prevention",
    readingMinutes: 5,
    publishedAt: "2026-08-01",
    tags: ["depression", "stigma", "help-seeking"],
    excerpt:
      "Depression is much more than sadness. Recognising what it actually looks like — and letting go of the myths — is the first step in reaching someone who needs help.",
    body: `Depression is one of the most common and most misunderstood mental health conditions in Nigeria and around the world. It is not simply "feeling low for a while" or a phase that a determined person can push through. It is a real, treatable health condition that changes the way a person thinks, feels, sleeps, eats, and relates to the people around them.

**What it can look like**

Depression rarely announces itself as tears. More often, it looks like exhaustion that sleep does not fix, a quiet loss of interest in things that used to matter, difficulty concentrating on schoolwork or a job, irritability that seems to come out of nowhere, physical aches with no clear cause, and a heavy sense that the future has gone flat. In young people especially, it can look like anger, withdrawal from friends, or spending far more time alone than usual.

**The myths that keep people silent**

"It's just stress." "They're being dramatic." "Prayer alone will fix it." "Real men don't get depressed." Every one of these ideas has kept somebody from getting help who needed it. Depression is not weakness of faith, character, or willpower — it is a medical condition, and it responds to a combination of care, community, therapy, and, where appropriate, medication.

**How to start the conversation**

If you are worried about someone, you do not need the perfect words. What helps is simple and unhurried: "I've noticed you haven't been yourself lately. I'm not going anywhere. What's going on?" Then listen. Do not rush to fix, do not compare their pain to anyone else's, and do not go straight to advice. Ask what kind of support they'd like — a listening ear, help finding a professional, or just company.

**If it is you**

If you recognise yourself in this article, please know two things. First, what you are experiencing is real and it is not your fault. Second, help exists — from our [Professional Support Directory](/directory), from your nearest teaching hospital's mental health unit, and, if things feel unsafe, from our [emergency support page](/emergency). You do not have to walk this alone.`,
  },
  {
    slug: "suicide-prevention-101",
    title: "Suicide Prevention 101: What Every Family Should Know",
    category: "supporting-someone-else",
    readingMinutes: 6,
    publishedAt: "2026-08-01",
    tags: ["suicide-prevention", "family", "warning-signs"],
    excerpt:
      "The single most important thing a family can do is take talk of suicide seriously — every time. Here is what to look out for, what to say, and where to turn.",
    body: `JMHS exists because a family lost Jude Anuoluwa to suicide in 2021. Our founding conviction is simple: no other family should have to face what his did without first knowing what to look for and what to do. This article is written in that spirit.

**Warning signs that deserve a conversation**

Not everyone who is suicidal shows the same signs, but common ones include: talking or writing about wanting to die, feeling like a burden, expressing hopelessness or feeling trapped, withdrawing from family and friends, giving away possessions, saying goodbye in unusual ways, sudden calm after a period of deep distress, and increased use of alcohol or other substances. A single sign is a reason to check in. Several together are a reason to act.

**What to say**

You will not "put the idea in their head" by asking. Direct, warm questions save lives: "Are you thinking of ending your life?" "Are you safe right now?" "Do you have a plan?" Listen without panic. Do not argue. Do not promise to keep it a secret — you may need to involve others to keep them safe.

**What not to say**

Avoid dismissive lines like "you have so much to live for," "other people have it worse," "this is just a phase," or any suggestion that the pain is not real. These land as being unheard, which is often the opposite of what a struggling person needs.

**What to do**

Do not leave them alone. Remove immediate access to means of harm if you safely can. Contact a mental health professional — see our [directory](/directory). If there is immediate danger, go to your nearest emergency department or call the numbers on our [emergency support page](/emergency). Involve at least one other trusted adult; this is not something to carry alone.

**After a crisis**

Recovery is not linear. Continue to check in in small, regular ways. Ask how they are — and mean it. Encourage them to stay in professional care. And take care of yourself, too; supporting a loved one through a crisis is exhausting, and you deserve support of your own.`,
  },
  {
    slug: "breaking-the-silence",
    title: "Breaking the Silence: Why Stigma Keeps People From Seeking Help",
    category: "learning-and-prevention",
    readingMinutes: 4,
    publishedAt: "2026-08-01",
    tags: ["stigma", "culture", "help-seeking"],
    excerpt:
      "Stigma is not just an idea in people's heads — it is the specific reason many Nigerians do not reach out until things reach crisis. It can be undone.",
    body: `Ask anyone who works in mental health in Nigeria what the single biggest barrier to help is, and the answer will not be money, or waiting lists, or even distance. It will be stigma.

**What stigma actually is**

Stigma is the collection of quiet, everyday attitudes that turn a treatable health condition into a shameful secret. It is the neighbour who says "she just needs to pray more." It is the parent who says "we don't have depression in this family." It is the workplace where taking time off for therapy is career suicide. Individually, each of these is small. Together, they build a wall between people and the help they need.

**Why it lands harder here**

In many Nigerian communities, admitting to a mental health struggle can be read as weakness, as spiritual failing, or as evidence that a family is broken. It can affect marriage prospects, employment, and standing in the community. These are real costs, and people weigh them — often silently — before deciding whether to speak.

**Reframing help-seeking**

We can change this. Not by lecturing, but by changing the story we tell each other about strength. Going to therapy is not weakness — it is the same kind of ordinary maintenance as going to a dentist. Talking to a psychiatrist is not surrender — it is a person taking responsibility for their life. The strongest person in the room is often the one who has quietly built the support they need.

**What you can do this week**

Speak about mental health as you would about any other health issue. Do not lower your voice when you say "therapy." When someone shares that they are struggling, say "thank you for telling me" — the response they most fear is being pushed away. Share reliable information, including this Resource Centre. And, if you have your own story, consider telling it. Every honest conversation makes it easier for the next person.`,
  },
  {
    slug: "supporting-a-friend-in-crisis",
    title: "Supporting a Friend Through a Mental Health Crisis: A Practical Guide",
    category: "supporting-someone-else",
    readingMinutes: 5,
    publishedAt: "2026-08-01",
    tags: ["crisis-support", "friendship", "practical"],
    excerpt:
      "Step-by-step, calm, practical guidance for when a friend needs you and you don't know what to do.",
    body: `If a friend is in the middle of a mental health crisis, this article is for you. It is not a substitute for professional help; it is a bridge until that help arrives.

**Step 1: Get present, not perfect**

You do not need to have the right words. You need to be with them. Sit down. Put your phone away. Give them your full attention. The goal is not to fix — it is to make sure they do not feel alone.

**Step 2: Ask, and listen**

Ask open questions: "What's been going on?" "How long has it felt like this?" "Are you safe right now?" Then be quiet long enough for them to answer. Reflect what you hear back: "That sounds exhausting." "That is a lot to carry."

**Step 3: Take talk of self-harm seriously — every time**

If they mention suicide or self-harm, ask directly whether they have a plan. Do not leave them alone. Move to a safer space if possible. Call a family member they trust, or a mental health professional. In immediate danger, take them to the nearest emergency department. See our [emergency support page](/emergency) for numbers.

**Step 4: Help them take the next small step, not the whole staircase**

The next step is almost never "fix your life." It might be "let's book you an appointment," "let's tell your sister," or "let's get you home safely tonight." Small, concrete, together.

**Step 5: Look after yourself, too**

Holding space for someone in crisis is heavy work. Debrief with someone you trust. Take breaks. This is not selfish — it is what allows you to keep showing up.

You will not always know what to do. That is human. What matters is that you stayed, that you asked, and that you helped them take one step towards help. That is often the difference.`,
  },
  {
    slug: "stress-and-burnout-nigerian-campuses",
    title: "Stress and Burnout on Nigerian University Campuses",
    category: "learning-and-prevention",
    readingMinutes: 5,
    publishedAt: "2026-08-01",
    tags: ["students", "burnout", "campus-life"],
    excerpt:
      "Academic pressure, financial strain, uncertainty about the future — Nigerian students carry a lot. Here is how to notice burnout before it takes over.",
    body: `Jude Anuoluwa was a 300-level student. He was among peers carrying pressures that anyone who has studied on a Nigerian campus will recognise: overloaded semesters, strikes that disrupt plans, financial strain, family expectations, and a job market that shifts under your feet. This article is for the students in that same reality — and for the people who love them.

**Burnout is not the same as being tired**

Tiredness responds to rest. Burnout does not. It is a slow drain of motivation, meaning, and energy, and it often shows up as cynicism about things you used to care about, difficulty starting even small tasks, physical symptoms like headaches and stomach upsets, and a sense that no matter how much you do, it is not enough.

**Where it comes from on our campuses**

Chronically long semesters and back-to-back assessments. Financial precarity — deciding between transport and food. Family systems in which one student carries the hopes of an entire household. Uncertain post-graduation prospects. Housing that does not allow real rest. Any one of these is heavy; several at once is a recipe for burnout.

**Warning signs**

Sleeping much more or much less than usual. Losing interest in friendships and activities you used to enjoy. Snapping at people who don't deserve it. Feeling numb in class or unable to concentrate on reading you would normally handle easily. Persistent thoughts along the lines of "what's the point?"

**What actually helps**

Small, protected time off — even one afternoon a week that is not for coursework. Movement of any kind, even a brief walk. Talking honestly to at least one person: a friend, a chaplain or imam, a mentor, or a professional. Being realistic about workload — asking for extensions when you need them is a skill, not a failure. And if you are noticing signs of depression or thoughts of self-harm, please treat that as urgent — see our [emergency support page](/emergency) and our [directory](/directory).

**For families and lecturers**

Students in Nigeria do not always feel safe telling the adults in their lives that they are struggling. If you sense a change — grades slipping, unusual withdrawal, jokes about not being around much longer — take it seriously. The single most important thing you can offer is a conversation that does not begin with judgement.`,
  },
  {
    slug: "grief-and-loss",
    title: "Grief and Loss: Finding Language for the Unspeakable",
    category: "learning-and-prevention",
    readingMinutes: 5,
    publishedAt: "2026-08-01",
    tags: ["grief", "loss", "healing"],
    excerpt:
      "Grief has no timetable and no correct shape. What it needs is room — and, sometimes, words we didn't know we needed.",
    body: `Grief is the price of loving somebody. It is not a problem to be solved. It is not a symptom to be medicated away. It is a natural human response to loss — and the loss does not have to be a death for the grief to be real.

**What grief can look like**

Waves that come without warning — in the middle of a class, at the sound of a certain song, in the aisle of a supermarket. Days that feel almost normal followed by days that feel unbearable. Anger, sometimes at the person you have lost, sometimes at yourself. Physical exhaustion. Difficulty concentrating. A strange, quiet loneliness even in company.

**There is no correct shape**

Some people cry every day. Some do not cry at all. Some want to talk about the person constantly; some cannot bear to hear their name. All of this is grief. The idea of neat "stages" is a rough map, not a schedule — people move back and forth between them, and there is no gold star for reaching the last one.

**JMHS was born of grief**

JMHS itself exists because a family and a community lost Jude Anuoluwa in 2021. The founders chose not to let that loss become a statistic. If you are grieving, please know that people who understand are here. The wound does not disappear — but it becomes something you carry, rather than something that carries you.

**What helps**

Being with people who let you be sad without trying to cheer you up. Rituals, small and large, that honour the person you have lost. Movement, sleep, water — the body carries grief too. Writing, if you find it useful. And, when grief is dragging you into a place where you cannot function or you are having thoughts of self-harm, professional support — see our [directory](/directory) and, for anything urgent, our [emergency page](/emergency).

You are allowed to still be grieving. You are allowed to laugh again while you grieve. Both things are true.`,
  },
];

// ---------- Professional Support Directory (spec §2.7) ----------

export type DirectoryListing = {
  id: string;
  name: string;
  credentials: string;
  affiliation: string;
  location?: string;
  costTier: "free" | "low-cost" | "paid" | "contact-for-details";
  contact?: string;
  status: "verified" | "pending";
};

export const DIRECTORY: DirectoryListing[] = [
  {
    id: "ayoyinka-ayorinde",
    name: "Dr. Ayoyinka Ayorinde",
    credentials: "Psychiatrist",
    affiliation: "OAUTHC (Obafemi Awolowo University Teaching Hospitals Complex)",
    location: "Ile-Ife, Osun State",
    costTier: "contact-for-details",
    status: "verified",
  },
  {
    id: "latifat-abisola-olagoke",
    name: "Latifat Abisola Olagoke",
    credentials: "Trauma-Informed Care Specialist",
    affiliation: "EcoMind",
    costTier: "contact-for-details",
    status: "verified",
  },
  {
    id: "marvellous-arogundade",
    name: "Marvellous Arogundade",
    credentials: "Clinical Psychology-based Mental Health Practitioner",
    affiliation: "Obafemi Awolowo University Teaching Hospitals Complex",
    location: "Ile-Ife, Osun State",
    costTier: "contact-for-details",
    status: "verified",
  },
];

// ---------- Published writing entries (empty until judging complete) ----------

export type PublishedEntry = {
  slug: string;
  title: string;
  author: string;
  category: "poetry" | "short-story" | "essay" | "personal-narrative";
  themeYear: number;
  excerpt: string;
  body: string;
  publishedAt: string;
};

export const PUBLISHED_ENTRIES: PublishedEntry[] = [];

// ---------- Lecture archive ----------

export type Lecture = {
  id: string;
  date: string;
  topic: string | null;
  speaker: string | null;
  summary?: string;
  recordingUrl?: string;
  joinLink?: string;
};

export const LECTURES: Lecture[] = [];
