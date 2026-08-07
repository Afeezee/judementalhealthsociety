# Jude Mental Health Society

Official website of the **Jude Mental Health Society (JMHS)** — an independent
Nigerian mental health advocacy initiative founded in memory of Jude Anuoluwa.

- **Public site:** homepage, About, Emergency Support, Resource Centre, Monthly
  Lecture Series, JMHS National Writing Competition, Professional Support
  Directory, Community Forum, Announcements, Contact, WhatsApp community.
- **Admin dashboard** (Clerk-gated, role-based): announcements, lectures,
  resources, directory approvals, competition submissions with a **Sculptform
  spreadsheet import tool that splits identity from manuscript at ingest**
  (blind judging enforced at the data layer), forum moderation, impact
  counter, WhatsApp settings, users & roles, site settings.
- **AI Mental Health Companion**: streaming chat against Groq-hosted
  Llama 3.3 70B. Crisis-language detection surfaces the emergency page
  inline before any model tokens. Floating bubble on every public page.

## Stack

- **Framework:** Next.js 16 App Router · React 19 · TypeScript · Turbopack
- **Styling:** Tailwind v4 with brand tokens as CSS variables; theme-aware
  via `data-theme` on `<html>`
- **Database:** Neon Postgres · Drizzle ORM
- **Auth:** Clerk (admin routes only; public site is login-free)
- **AI:** Groq Chat Completions API (Llama 3.3 70B), server-side crisis
  detection in [`src/lib/crisis-detect.ts`](src/lib/crisis-detect.ts)
- **Submissions:** Sculptform export → CSV/XLSX parsed via `xlsx`, split
  at ingest into `submission_manuscripts` and `submission_identities`

## Getting started

```bash
# 1. Install
npm install

# 2. Env
cp .env.example .env.local
#  fill in Neon DATABASE_URL, Clerk keys, GROQ_API, Sculptform URL

# 3. Push schema to Neon (creates all 17 tables)
npm run db:push

# 4. Seed initial content (6 articles, 3 directory listings, impact metrics,
#    2026 lectures, strip announcements)
npm run db:seed
npm run db:seed-lectures
npm run db:seed-announcements

# 5. Dev
npm run dev
```

Sign up at `/sign-up` with the email `olagunjuafeez@gmail.com` — that account
is automatically promoted to `super_admin` on first sign-in
(see [`src/lib/auth.ts`](src/lib/auth.ts)). Then head to `/admin`.

## Safety non-negotiables

The site is built for people in real distress. A few things are
architecturally enforced, not just polite convention:

- **`Get Help Now`** (red pill, top-right) is on every page including
  admin. `/emergency` renders instantly, no animation, no auth.
- **Quick Exit** on every page — replaces history so a single back-press
  cannot return here.
- **Red is reserved** for the crisis system. Never decorative.
- **Blind judging is enforced at the data layer.** The Sculptform import
  tool in [`src/lib/submissions-import.ts`](src/lib/submissions-import.ts)
  splits each row into `submission_manuscripts` (judge-visible) and
  `submission_identities` (not) *at ingest*, before any human here sees
  the spreadsheet. Judge-facing queries never join through the identity
  table.
- **AI Companion never role-plays a crisis counsellor.** Server-side regex
  detects self-harm language and prepends a JMHS-authored safety block
  (real Nigerian crisis numbers) to the streamed response — before any
  model tokens arrive.
- **`prefers-reduced-motion` respected** everywhere.
- Site never implies registered-NGO status.

## Emergency numbers surfaced

- **National Emergency Hotline · 112** — toll-free, 24/7
- **SURPIN · 0800 0787 7464** — toll-free
- **MANI · 0809 111 6264 / 0811 168 0686** — private peer support

## Scripts

| Command                          | What it does                             |
| -------------------------------- | ---------------------------------------- |
| `npm run dev`                    | Local dev server                         |
| `npm run build`                  | Production build                         |
| `npm run db:generate`            | Generate a new Drizzle migration         |
| `npm run db:push`                | Sync schema to Neon                      |
| `npm run db:migrate`             | Apply migrations                         |
| `npm run db:seed`                | Seed initial content                     |
| `npm run db:seed-lectures`       | Sync 2026 Aug + Sept lectures            |
| `npm run db:seed-announcements`  | Sync sitewide strip announcements        |
| `npm run db:studio`              | Open Drizzle Studio                      |

## Repo structure

```
src/
├── app/                   # Next.js App Router
│   ├── (public pages)     # /, /about, /emergency, /resources, /lectures,
│   │                      # /competition, /directory, /forum, /contact,
│   │                      # /whatsapp, /announcements, /privacy, /moderation
│   ├── assistant/         # Full-page AI Companion
│   ├── admin/             # Clerk-gated admin dashboard
│   ├── api/
│   │   ├── contact/       # Contact form
│   │   ├── assistant/     # Streaming Groq chat
│   │   └── admin/         # Submissions import etc.
│   └── sign-in, sign-up/  # Clerk pages
├── components/            # UI (Header, Footer, ChatBubble, Logo, forms…)
├── db/
│   ├── schema.ts          # 17-table Drizzle schema
│   ├── client.ts          # Neon HTTP driver
│   ├── seed.ts            # Initial content
│   ├── seed-lectures.ts   # Lecture sync
│   └── seed-announcements.ts
├── lib/
│   ├── auth.ts            # Clerk ↔ users table, role helpers
│   ├── crisis-detect.ts   # Self-harm / suicide language detection
│   ├── submissions-import.ts # Identity-blind Sculptform ingest
│   ├── public-data.ts     # Server helpers pages use for DB reads
│   ├── site-settings.ts   # Constants that back Site Settings admin
│   └── seed-content.ts    # Content that falls back if DB is empty
├── proxy.ts               # Clerk middleware (Next 16 file convention)
└── scripts/               # One-off asset builds, e.g. extract-logo.ts
```

## Roles

| Role                       | Can do                                     |
| -------------------------- | ------------------------------------------ |
| `super_admin`              | Everything, incl. add/promote/remove admins|
| `website_administrator`    | Site settings, WhatsApp, everything below  |
| `competition_coordinator`  | Competition + submissions + everything below|
| `content_editor`           | Announcements, resources, lectures, impact, directory |
| `moderator`                | Forum moderation                           |

`olagunjuafeez@gmail.com` is protected from demotion.
