import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { shopItems, inventory, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUserId } from "@/lib/current-user";
import { toPublicCharacter } from "@/lib/sanitize";

const schema = z.object({ itemId: z.string().min(1) });

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid item" }, { status: 400 });

  const [owned] = await db
    .select()
    .from(inventory)
    .innerJoin(shopItems, eq(inventory.itemId, shopItems.id))
    .where(and(eq(inventory.userId, userId), eq(inventory.itemId, parsed.data.itemId)))
    .limit(1);

  if (!owned) return NextResponse.json({ error: "You don't own this item" }, { status: 403 });

  const field = owned.shop_items.kind === "theme" ? "equippedTheme" : "equippedBadge";

  const [updated] = await db
    .update(users)
    .set({ [field]: parsed.data.itemId })
    .where(eq(users.id, userId))
    .returning();

  return NextResponse.json({ character: toPublicCharacter(updated) });
}
