import type { Attribute, Difficulty } from "@/lib/rpg";

export interface Character {
  id: string;
  displayName: string;
  email: string;
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  vitality: number;
  charisma: number;
  discipline: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  equippedTheme: string;
  equippedBadge: string | null;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  attribute: Attribute;
  difficulty: Difficulty;
  isDone: boolean;
  isRecurring: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  kind: "theme" | "badge";
  cost: number;
}
