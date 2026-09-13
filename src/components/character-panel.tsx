"use client";

import { motion } from "framer-motion";
import { ATTRIBUTE_META, xpToReachNextLevel } from "@/lib/rpg";
import type { Character } from "@/lib/types";
import { signOut } from "next-auth/react";

export function CharacterPanel({ character }: { character: Character }) {
  const threshold = xpToReachNextLevel(character.level);
  const pct = Math.min(100, Math.round((character.xp / threshold) * 100));

  const attrs: { key: keyof typeof ATTRIBUTE_META; value: number }[] = [
    { key: "strength", value: character.strength },
    { key: "intellect", value: character.intellect },
    { key: "vitality", value: character.vitality },
    { key: "charisma", value: character.charisma },
    { key: "discipline", value: character.discipline },
  ];
  const maxAttr = Math.max(10, ...attrs.map((a) => a.value));

  return (
    <aside
      className="quest-card rounded-lg p-6 text-[var(--ink)] h-fit lg:sticky lg:top-6"
      aria-label="Character sheet"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-xl leading-tight">{character.displayName}</h2>
          <p className="text-xs text-[var(--ink-soft)]">
            Level {character.level} adventurer
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs text-[var(--ink-soft)] underline hover:text-[var(--ink)]"
        >
          Log out
        </button>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs mb-1">
          <span>XP</span>
          <span>
            {character.xp} / {threshold}
          </span>
        </div>
        <div className="xp-bar-track h-3 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-glow))" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 text-sm">
        <div className="flex items-center gap-1.5" title="Gold">
          <span aria-hidden>🪙</span>
          <span className="font-medium">{character.gold}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Current streak">
          <span aria-hidden>🔥</span>
          <span className="font-medium">{character.currentStreak}-day streak</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {attrs.map((a) => {
          const meta = ATTRIBUTE_META[a.key];
          const width = Math.max(6, Math.round((a.value / maxAttr) * 100));
          return (
            <div key={a.key}>
              <div className="flex justify-between text-xs mb-1">
                <span>
                  <span aria-hidden>{meta.icon}</span> {meta.label}
                </span>
                <span>{a.value}</span>
              </div>
              <div className="xp-bar-track h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[var(--accent-strong)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 20 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[11px] text-[var(--ink-soft)]">
        Longest streak: {character.longestStreak} days
      </p>
    </aside>
  );
}
