# Deployment Guide

This walks through everything in the brief's "Required Deliverables" section:
a public GitHub repo, a live deployed URL, and a demo video.

Total time: roughly 30–45 minutes the first time.

---

## 1. Push the code to a public GitHub repository

```bash
cd life-rpg
git init
git add -A
git commit -m "Initial commit: Adventurer's Ledger life RPG"
```

Create a new **public** repo on GitHub (github.com → "New repository" → don't
initialize with a README, since you already have one), then:

```bash
git remote add origin https://github.com/<your-username>/adventurers-ledger.git
git branch -M main
git push -u origin main
```

**Commit history matters for grading** ("fewer than 3 chronological commits" is
disqualifying) — as you make changes over the next steps, commit them
separately rather than squashing everything into one commit. For example:
"Initial commit", "Add deployment config", "Fix theme equip bug", etc.

Double-check `.env` is **not** committed — it's already in `.gitignore`, but
run `git status` before your first commit to confirm only `.env.example`
shows up.

---

## 2. Create a hosted PostgreSQL database

Pick one (all have free tiers that are plenty for this project):

### Option A: Supabase (recommended — easiest connection string)
1. Go to [supabase.com](https://supabase.com) → New project.
2. Once it's provisioned, go to **Project Settings → Database → Connection string**.
3. Copy the **URI** under "Connection pooling" (mode: `transaction`) — it looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the database password you set at project creation.

### Option B: Neon
1. [neon.tech](https://neon.tech) → New project.
2. Copy the connection string shown on the dashboard (already includes `?sslmode=require`).

### Option C: Railway
1. [railway.app](https://railway.app) → New Project → Provision PostgreSQL.
2. Open the Postgres service → **Variables** tab → copy `DATABASE_URL`.

Save this connection string — you'll need it in two places below.

---

## 3. Run migrations against the production database

From your local machine, temporarily point at the production database to
create the tables (you only do this once, and again whenever the schema changes):

```bash
DATABASE_URL="<your production connection string>" npm run db:migrate
DATABASE_URL="<your production connection string>" npm run db:seed
```

This creates all tables and seeds the shop items on the real database —
completely separate from your local `.env`, which can keep pointing at your
local Postgres for day-to-day development.

---

## 4. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your
   GitHub repo (you'll authorize Vercel to access GitHub the first time).
2. Vercel auto-detects Next.js — leave build settings as default
   (`next build` / `.next`).
3. Before clicking Deploy, expand **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the production connection string from step 2 |
   | `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` (generate a **new** one for production, don't reuse your local dev secret) |
   | `NEXTAUTH_URL` | your Vercel URL, e.g. `https://adventurers-ledger.vercel.app` — you can add this *after* the first deploy once you know the URL, then redeploy |

4. Click **Deploy**. First deploy takes ~2 minutes.
5. Once deployed, copy the assigned URL (e.g. `adventurers-ledger.vercel.app`),
   go to **Settings → Environment Variables**, set `NEXTAUTH_URL` to that exact
   URL (with `https://`), and trigger a redeploy (**Deployments → ⋯ → Redeploy**).

### Verify it works
Open the live URL, register a new character, post a quest, complete it, and
**refresh the page** — the XP/gold/level should persist. That refresh-persists
check is exactly what the grading rubric looks for ("Fake Data Persistence").

---

## 5. Record the demo video

Requirements from the brief: 90–180 seconds, under 100MB, publicly viewable
without login (an unlisted YouTube link or a public Loom link both work —
avoid Google Drive links that require a sign-in prompt).

**Suggested screen-recording tools:**
- macOS: QuickTime (File → New Screen Recording) or Cmd+Shift+5
- Windows: Xbox Game Bar (Win+G) or ShareX
- Any OS: [Loom](https://loom.com) (free tier, gives you a shareable public link automatically — easiest option since it skips file upload entirely)

**A tight script that covers every required beat in ~2 minutes:**

1. *(0:00–0:20)* Show the landing page, click "Create your character," fill in
   the signup form, land on the dashboard as a fresh Level 1 character.
2. *(0:20–0:45)* Post a new quest (pick a visible difficulty like "hard" so the
   XP/gold reward is obvious), show it appear on the board.
3. *(0:45–1:10)* Click complete — narrate what you see: the XP bar animates,
   gold increases, the relevant attribute bar grows.
4. *(1:10–1:35)* Complete one more quest that pushes you over a level
   threshold, so the level-up overlay fires on camera.
5. *(1:35–1:55)* **Refresh the browser tab** and show the character, gold, and
   completed quest are all still there — this is the database-persistence proof.
6. *(1:55–2:00)* Quick pan through the Shop tab (buy/equip a theme) to show the
   economy, then done.

Once recorded, either:
- Upload to YouTube as **Unlisted** (not Private — private requires the
  viewer to be signed in and added) and put the link in your README, or
- Use Loom's share link directly, or
- Commit the video file to the repo (only if it's comfortably under 100MB and
  your repo host doesn't reject large files — GitHub itself caps individual
  files at 100MB, so this is the riskiest option; a hosted link is safer).

Add the link to the top of your `README.md`:

```markdown
## Demo video
[Watch the walkthrough](https://your-video-link-here)

## Live app
https://adventurers-ledger.vercel.app
```

---

## 6. Final checklist against the disqualification rules

- [ ] GitHub repo is **public**
- [ ] Repo has 3+ real commits (not squashed into one)
- [ ] Repo contains both frontend and backend code (it's one Next.js app, so this is automatic)
- [ ] `.env.example` is committed, `.env` is not
- [ ] Live Vercel URL loads without errors (check the browser console too)
- [ ] Data survives a hard refresh (tested in step 4)
- [ ] Video is 90–180 seconds, under 100MB, and the link works in a private/incognito browser window (to confirm it truly doesn't require login)
