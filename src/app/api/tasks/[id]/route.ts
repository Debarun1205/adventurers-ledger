import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tasks, users, completions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/current-user";
import { getOwnedTask } from "@/lib/ownership";
import { toPublicCharacter } from "@/lib/sanitize";
import {
  applyXp,
  computeStreakUpdate,
  todayUtcStr,
  DIFFICULTY_REWARDS,
} from "@/lib/rpg";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  notes: z.string().trim().max(500).optional(),
  attribute: z
    .enum(["strength", "intellect", "vitality", "charisma", "discipline"])
    .optional(),
  difficulty: z.enum(["trivial", "easy", "medium", "hard", "epic"]).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;

  const owned = await getOwnedTask(userId, id);
  if (!owned) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // A dedicated "complete" action performs the RPG reward logic.
  if (typeof body === "object" && body !== null && "action" in body && (body as { action?: string }).action === "complete") {
    if (owned.isDone) {
      return NextResponse.json({ error: "Quest already completed" }, { status: 409 });
    }

    const reward = DIFFICULTY_REWARDS[owned.difficulty];
    const [me] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!me) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    const { level, xp, didLevelUp, levelsGained } = applyXp(me.level, me.xp, reward.xp);
    const today = todayUtcStr();
    const streak = computeStreakUpdate(me.lastActiveDate, me.currentStreak, me.longestStreak, today);

    const attrColumn = owned.attribute; // strength | intellect | vitality | charisma | discipline
    const attrIncrement = 1;

    const [updatedUser] = await db
      .update(users)
      .set({
        level,
        xp,
        gold: me.gold + reward.gold,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActiveDate: streak.lastActiveDate,
        [attrColumn]: (me[attrColumn] as number) + attrIncrement,
      })
      .where(eq(users.id, userId))
      .returning();

    const [updatedTask] = await db
      .update(tasks)
      .set({ isDone: true, completedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    await db.insert(completions).values({
      userId,
      taskId: id,
      title: owned.title,
      attribute: owned.attribute,
      difficulty: owned.difficulty,
      xpAwarded: reward.xp,
      goldAwarded: reward.gold,
      completedOn: today,
    });

    return NextResponse.json({
      task: updatedTask,
      character: toPublicCharacter(updatedUser),
      reward,
      didLevelUp,
      levelsGained,
    });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const [updated] = await db
    .update(tasks)
    .set(parsed.data)
    .where(eq(tasks.id, id))
    .returning();

  return NextResponse.json({ task: updated });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;

  const owned = await getOwnedTask(userId, id);
  if (!owned) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

  await db.delete(tasks).where(eq(tasks.id, id));
  return NextResponse.json({ ok: true });
}
