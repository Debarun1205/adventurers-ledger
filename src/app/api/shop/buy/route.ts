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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const result = await db.transaction(async (tx) => {
    const [item] = await tx.select().from(shopItems).where(eq(shopItems.id, parsed.data.itemId)).limit(1);
    if (!item) return { error: "Item not found", status: 404 } as const;

    const [already] = await tx
      .select({ id: inventory.id })
      .from(inventory)
      .where(and(eq(inventory.userId, userId), eq(inventory.itemId, item.id)))
      .limit(1);
    if (already) return { error: "Already owned", status: 409 } as const;

    const [me] = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!me) return { error: "Character not found", status: 404 } as const;
    if (me.gold < item.cost) return { error: "Not enough gold", status: 402 } as const;

    const [updatedUser] = await tx
      .update(users)
      .set({ gold: me.gold - item.cost })
      .where(eq(users.id, userId))
      .returning();

    await tx.insert(inventory).values({ userId, itemId: item.id });

    return { character: updatedUser, item } as const;
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({
    character: toPublicCharacter(result.character),
    item: result.item,
  });
}
