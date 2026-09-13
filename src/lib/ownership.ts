import { db } from "@/db";
import { tasks } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/** Confirms a task belongs to the given user before any read/update/delete. */
export async function getOwnedTask(userId: string, taskId: string) {
  const [row] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .limit(1);
  return row ?? null;
}
