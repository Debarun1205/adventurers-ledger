# ⚔️ Adventurer's Ledger

**Turn your to-do list into an RPG.** Tasks become quests, completing them earns XP and gold, grows one of five character attributes, and a non-linear leveling curve makes early wins fast and late-game levels feel earned.

Built full-stack — secure auth, a real Postgres database, and a server-side progression engine, so there's no client-side way to "cheat" your own stats.

**[🔴 Live Demo](#)** &nbsp;·&nbsp; **[🎥 Demo Video](#)** &nbsp;·&nbsp; **[📄 Deployment Guide](./DEPLOYMENT.md)**

> Replace the two `#` links above with your deployed URL and video link before submitting.

---

## 📸 Screenshots

<!--
  Add screenshots here before submitting — a couple of PNGs dropped in a
  /screenshots folder and linked like this go a long way for a first impression:

  ![Landing page](./screenshots/landing.png)
  ![Dashboard](./screenshots/dashboard.png)
  ![Level up](./screenshots/levelup.png)
-->

## ✨ Features

| | |
|---|---|
| 🧙 **Character progression** | Non-linear XP curve — each level demands more than the last, so progress never feels flat. |
| 🗡️ **Five attributes** | Strength, Intellect, Vitality, Charisma, Discipline — each quest you tag grows a specific stat. |
| 🔥 **Streaks** | Consecutive days of activity build a streak; a missed day resets it, longest streak is tracked forever. |
| 🪙 **A real economy** | Gold earned from quests (scaled by difficulty) spends in an in-app shop on themes and badges. |
| 🎨 **Equippable themes** | Three full visual palettes — Tavern, Deep Dungeon, Astral Scholar — swap instantly on purchase. |
| 🔒 **Secure by default** | bcrypt-hashed passwords, JWT sessions, and every query scoped to the logged-in user — no cross-account data leakage. |
| 📜 **Persistent history** | Every completed quest is logged permanently, independent of the live task list — survives refreshes, browser changes, devices. |
| ♿ **Accessible & responsive** | Full keyboard navigation, visible focus states, ARIA labeling, and a layout that works from phone to desktop. |

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Backend | Next.js API Routes (Node.js runtime) |
| Database | PostgreSQL, via [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [NextAuth v5](https://authjs.dev/) — credentials provider, bcrypt hashing, JWT sessions |
| Validation | Zod on every API route |
| Hosting | Vercel (app) + Supabase (managed Postgres) |

## 🏗️ How the RPG systems work

**Leveling curve** (`src/lib/rpg.ts`)
```ts
xpToReachNextLevel(level) = 80 * level^1.6 + 40
```
Completing a quest calls `applyXp()`, which rolls earned XP over into as many level-ups as it earns in a single action — no cap on multi-leveling from one big quest.

**Rewards by difficulty**

| Difficulty | XP | Gold |
|---|---|---|
| Trivial | 10 | 3 |
| Easy | 25 | 8 |
| Medium | 55 | 18 |
| Hard | 100 | 35 |
| Epic | 220 | 80 |

**Streaks** — `computeStreakUpdate()` compares the last active date (UTC) to today: a consecutive day increments the streak, a gap resets it to 1, and the longest streak is tracked separately from the current one.

**Security model** — every API route re-derives the user from the server-side session (never trusts a client-supplied user ID), and every task/inventory query is filtered by `WHERE user_id = <session user>`. Character data returned to the client is passed through a sanitizer that strips the password hash before it ever leaves the server.

## 📂 Project Structure

```
src/
├─ app/
│  ├─ page.tsx                 # landing page
│  ├─ login/, register/        # auth pages
│  ├─ dashboard/                # protected app shell (server-checks session)
│  └─ api/
│     ├─ register/              # signup
│     ├─ auth/[...nextauth]/    # NextAuth handler
│     ├─ tasks/                 # quest CRUD + complete action (awards XP/gold/streak)
│     ├─ shop/                  # shop listing, buy, equip
│     └─ completions/           # historical log
├─ components/                  # character panel, quest board, shop, log, level-up FX
├─ db/
│  ├─ schema.ts                 # Drizzle schema (users, tasks, completions, shop, inventory)
│  └─ seed.ts                   # shop item seed data
└─ lib/
   ├─ rpg.ts                    # the progression engine (leveling curve, rewards, streaks)
   ├─ auth.ts                   # NextAuth config
   └─ sanitize.ts               # strips passwordHash before any character data leaves the server
```

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+
- A PostgreSQL database — local install, Docker, or a free hosted one ([Supabase](https://supabase.com), [Neon](https://neon.tech))

### Install & configure

```bash
git clone https://github.com/<your-username>/adventurers-ledger.git
cd adventurers-ledger
npm install
cp .env.example .env
```

Fill in `.env`:

```bash
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/liferpg"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

### Set up the database

```bash
npm run db:migrate   # creates all tables
npm run db:seed      # adds starter shop items
```

### Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, create a character, and start posting quests.

## ☁️ Deployment

Full step-by-step guide (GitHub → Supabase → Vercel, with exact env vars and troubleshooting for common connection errors) lives in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## 🗺️ Design Notes

The visual direction is a candlelit tavern quest-board — parchment cards, brass and forest-green accents, a serif display face (Fraunces) paired with Inter for body text — deliberately steering away from a generic SaaS dashboard look. All three equippable palettes are driven entirely by CSS custom properties, so buying a theme in the shop re-skins the whole app instantly with no page reload.

## 📝 License

Built as a project submission. Feel free to fork and adapt.
