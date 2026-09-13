import { NextResponse } from "next/server";
import { db } from "@/db";
import { completions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const rows = await db
    .select()
    .from(completions)
    .where(eq(completions.userId, userId))
    .orderBy(desc(completions.createdAt))
    .limit(200);

  return NextResponse.json({ completions: rows });
}
