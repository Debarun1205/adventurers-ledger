import Link from "next/link";
import { ATTRIBUTE_META } from "@/lib/rpg";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-[var(--bg-deep)] text-[var(--parchment)]">
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-24">
        <nav className="flex items-center justify-between pb-16">
          <span className="font-display text-lg tracking-wide">
            Adventurer&apos;s Ledger
          </span>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/login" className="opacity-80 hover:opacity-100">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-[#1c140b] hover:bg-[var(--accent-glow)] transition-colors"
            >
              Start your ledger
            </Link>
          </div>
        </nav>

        <section className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <p className="mb-4 text-sm text-[var(--accent-glow)]">
              A life RPG, not another to-do list
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-6">
              Your chores are quests.
              <br />
              Your progress is a character sheet.
            </h1>
            <p className="max-w-md text-[var(--parchment-edge)] mb-8 leading-relaxed">
              Reading, the gym, studying, chores — the payoff usually takes
              months to show up. Adventurer&apos;s Ledger pays you back
              immediately: log a quest, watch the XP bar fill, hear the level
              chime. The real-world habit sticks because the feedback loop
              doesn&apos;t wait.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="rounded-md bg-[var(--accent)] px-5 py-3 font-medium text-[#1c140b] hover:bg-[var(--accent-glow)] transition-colors"
              >
                Create your character
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-[var(--parchment-edge)] px-5 py-3 font-medium hover:border-[var(--accent-glow)] transition-colors"
              >
                I already have one
              </Link>
            </div>
          </div>

          <div className="quest-card rounded-lg p-6 text-[var(--ink)] rotate-1">
            <p className="font-display text-lg mb-1">Today&apos;s Quest Board</p>
            <p className="text-xs text-[var(--ink-soft)] mb-4">Level 7 · 3-day streak</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between border-b border-[var(--parchment-edge)] pb-3">
                <span>Read 20 pages</span>
                <span className="text-[var(--accent-strong)]">+25 XP</span>
              </li>
              <li className="flex items-center justify-between border-b border-[var(--parchment-edge)] pb-3">
                <span>Leg day at the gym</span>
                <span className="text-[var(--accent-strong)]">+100 XP</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ship the feature</span>
                <span className="text-[var(--accent-strong)]">+55 XP</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-28 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--parchment-edge)]/30 p-5">
            <h2 className="font-display text-xl mb-2">Non-linear leveling</h2>
            <p className="text-sm text-[var(--parchment-edge)] leading-relaxed">
              Every level demands more XP than the last, so early wins come
              fast and late-game levels feel like a real achievement.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--parchment-edge)]/30 p-5">
            <h2 className="font-display text-xl mb-2">Attributes that mean something</h2>
            <p className="text-sm text-[var(--parchment-edge)] leading-relaxed">
              Tag quests by attribute and watch a specific stat grow —{" "}
              {Object.values(ATTRIBUTE_META)
                .map((a) => a.label)
                .join(", ")}
              .
            </p>
          </div>
          <div className="rounded-lg border border-[var(--parchment-edge)]/30 p-5">
            <h2 className="font-display text-xl mb-2">Streaks &amp; a real economy</h2>
            <p className="text-sm text-[var(--parchment-edge)] leading-relaxed">
              Consecutive days keep your streak lit. Gold earned from quests
              buys themes and badges in the shop.
            </p>
          </div>
        </section>

        <footer className="mt-24 text-xs text-[var(--parchment-edge)]">
          Your data is yours alone — every account is private and secured server-side.
        </footer>
      </div>
    </main>
  );
}
