// The RPG Progression Engine
// ---------------------------------------------------------------
// A non-linear leveling curve: every level costs more XP than the last,
// so early levels feel fast and later levels feel earned.

export function xpToReachNextLevel(currentLevel: number): number {
  // e.g. L1->2 needs 100xp, L5->6 needs ~750xp, L20->21 needs ~5200xp
  return Math.round(80 * Math.pow(currentLevel, 1.6) + 40);
}

export const DIFFICULTY_REWARDS = {
  trivial: { xp: 10, gold: 3 },
  easy: { xp: 25, gold: 8 },
  medium: { xp: 55, gold: 18 },
  hard: { xp: 100, gold: 35 },
  epic: { xp: 220, gold: 80 },
} as const;

export type Difficulty = keyof typeof DIFFICULTY_REWARDS;
export type Attribute =
  | "strength"
  | "intellect"
  | "vitality"
  | "charisma"
  | "discipline";

export const ATTRIBUTE_META: Record<
  Attribute,
  { label: string; icon: string; sample: string }
> = {
  strength: { label: "Strength", icon: "⚔️", sample: "Gym, sports, chores" },
  intellect: { label: "Intellect", icon: "📖", sample: "Study, coding, reading" },
  vitality: { label: "Vitality", icon: "❤️", sample: "Sleep, meals, health" },
  charisma: { label: "Charisma", icon: "🗣️", sample: "Social, networking" },
  discipline: { label: "Discipline", icon: "🕯️", sample: "Habits, chores, focus" },
};

interface LevelUpResult {
  level: number;
  xp: number;
  didLevelUp: boolean;
  levelsGained: number;
}

/** Applies earned XP to a character, rolling over into as many level-ups as needed. */
export function applyXp(
  currentLevel: number,
  currentXp: number,
  xpEarned: number
): LevelUpResult {
  let level = currentLevel;
  let xp = currentXp + xpEarned;
  let levelsGained = 0;

  let threshold = xpToReachNextLevel(level);
  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    levelsGained += 1;
    threshold = xpToReachNextLevel(level);
  }

  return { level, xp, didLevelUp: levelsGained > 0, levelsGained };
}

/** Streak logic: comparing the last active date (UTC, date-only) to today. */
export function computeStreakUpdate(
  lastActiveDateStr: string | null,
  currentStreak: number,
  longestStreak: number,
  todayStr: string
): { currentStreak: number; longestStreak: number; lastActiveDate: string } {
  if (!lastActiveDateStr) {
    return { currentStreak: 1, longestStreak: Math.max(1, longestStreak), lastActiveDate: todayStr };
  }

  if (lastActiveDateStr === todayStr) {
    // Already logged activity today; streak doesn't change further.
    return { currentStreak, longestStreak, lastActiveDate: todayStr };
  }

  const last = new Date(lastActiveDateStr + "T00:00:00Z");
  const today = new Date(todayStr + "T00:00:00Z");
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

  const nextStreak = diffDays === 1 ? currentStreak + 1 : 1;
  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(nextStreak, longestStreak),
    lastActiveDate: todayStr,
  };
}

export function todayUtcStr(): string {
  return new Date().toISOString().slice(0, 10);
}
