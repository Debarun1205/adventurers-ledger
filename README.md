# Adventurer's Ledger

Turn your to-do list into an RPG. Tasks become quests, completing them earns
XP/gold and grows one of five character attributes, and a non-linear leveling
curve makes early progress fast and late-game levels feel earned.

Built as a full-stack submission for the Life RPG brief: secure auth, a real
database, and a server-side progression engine (no client-side "cheating" the
XP counter).

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend:** Next.js API Routes (Node.js runtime)
- **Database:** PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/) (pure-JS driver, no native binaries to compile)
- **Auth:** [NextAuth v5](https://authjs.dev/) with a credentials provider, bcrypt password hashing, JWT sessions
- **Validation:** Zod on every API route

## Core systems

- **Auth & security** — signup/login, bcrypt-hashed passwords, JWT sessions. Every
  API route checks the session server-side and every task query is scoped to
  `WHERE user_id = <session user>` — one user can never read or modify another's data.
- **Progression engine** (`src/lib/rpg.ts`) — `xpToReachNextLevel(level)` returns a
  growing XP requirement per level (`80 * level^1.6 + 40`), so leveling is non-linear.
  Completing a quest calls `applyXp()`, which rolls XP over into as many level-ups
  as it earns in one shot.
- **Attributes** — each quest is tagged with one of five attributes (Strength,
  Intellect, Vitality, Charisma, Discipline). Completing it increments that stat.
- **Streaks** — `computeStreakUpdate()` compares the last active date (UTC) to
  today: consecutive days increment the streak, a gap resets it to 1, longest
  streak is tracked separately.
- **Economy** — gold earned from quests (scaled by difficulty) can be spent in
  the Shop on themes and badges. Purchases run inside a DB transaction so gold
  and inventory update atomically.
- **Persistent history** — every completion is logged to a `completions` table
  (independent from the live `tasks` table), visible in the "Log" tab, proving
  data survives refreshes and isn't just client state.

## Getting started locally

### 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (local install, Docker, or a free hosted one like
  [Supabase](https://supabase.com) or [Neon](https://neon.tech))

### 2. Install and configure

```bash
npm install
cp .env.example .env
```

Edit `.env` and set:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/liferpg"
NEXTAUTH_SECRET="paste output of: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npm run db:generate   # only needed if you change src/db/schema.ts
npm run db:migrate    # creates all tables
npm run db:seed       # adds the starter shop items (themes + badges)
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, create a character, and start posting quests.

## Project structure

```
src/
  app/
    page.tsx              landing page
    login/, register/     auth pages
    dashboard/             protected app shell (server-checks the session)
    api/
      register/            signup
      auth/[...nextauth]/  NextAuth handler
      tasks/               quest CRUD + complete action (awards XP/gold/streak)
      shop/                shop listing, buy, equip
      completions/         historical log
  components/               character panel, quest board, shop, log, level-up FX
  db/
    schema.ts               Drizzle schema (users, tasks, completions, shop, inventory)
    seed.ts                 shop item seed data
  lib/
    rpg.ts                  the progression engine (leveling curve, rewards, streaks)
    auth.ts                 NextAuth config
    sanitize.ts              strips passwordHash before any character data leaves the server
```

## Design notes

The visual language is a candlelit tavern quest-board — parchment cards,
brass and forest-green accents, a serif display face (Fraunces) paired with
Inter for body text — rather than a generic SaaS dashboard. Three equippable
palettes (Tavern / Deep Dungeon / Astral Scholar) are driven entirely by CSS
custom properties, so buying a theme in the shop re-skins the whole app
instantly.

## Deployment

See `DEPLOYMENT.md` for a full walkthrough of deploying this to Vercel with a
hosted Postgres database.
