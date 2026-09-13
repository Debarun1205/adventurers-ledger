import { NextResponse } from "next/server";
import { db } from "@/db";
import { shopItems, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/current-user";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const items = await db.select().from(shopItems);
  const owned = await db
    .select({ itemId: inventory.itemId })
    .from(inventory)
    .where(eq(inventory.userId, userId));

  return NextResponse.json({ items, ownedIds: owned.map((o) => o.itemId) });
}
