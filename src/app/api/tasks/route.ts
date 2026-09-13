import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { requireUserId } from "@/lib/current-user";
import { toPublicCharacter } from "@/lib/sanitize";
import { eq, desc } from "drizzle-orm";

const createSchema = z.object({
  title: z.string().trim().min(1, "Quest needs a title").max(120),
  notes: z.string().trim().max(500).optional(),
  attribute: z.enum(["strength", "intellect", "vitality", "charisma", "discipline"]),
  difficulty: z.enum(["trivial", "easy", "medium", "hard", "epic"]),
});

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const rows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));

  const [me] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!me) return NextResponse.json({ error: "Character not found" }, { status: 404 });

  return NextResponse.json({ tasks: rows, character: toPublicCharacter(me) });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(tasks)
    .values({ ...parsed.data, userId })
    .returning();

  return NextResponse.json({ task: created }, { status: 201 });
}
