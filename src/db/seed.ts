import "dotenv/config";
import { db } from "./index";
import { shopItems } from "./schema";

const ITEMS: (typeof shopItems.$inferInsert)[] = [
  { id: "theme-tavern", name: "Tavern (default)", description: "Warm candlelight and old oak.", kind: "theme", cost: 0 },
  { id: "theme-dungeon", name: "Deep Dungeon", description: "Torches, stone, and green witchlight.", kind: "theme", cost: 120 },
  { id: "theme-astral", name: "Astral Scholar", description: "Ink-blue night sky and silver runes.", kind: "theme", cost: 220 },
  { id: "badge-scribe", name: "Scribe's Quill", description: "Awarded to the studious.", kind: "badge", cost: 60 },
  { id: "badge-forged", name: "Forged Gauntlet", description: "Awarded to the disciplined.", kind: "badge", cost: 60 },
  { id: "badge-comet", name: "Comet Sigil", description: "A rare mark of a long streak.", kind: "badge", cost: 300 },
];

async function main() {
  for (const item of ITEMS) {
    await db.insert(shopItems).values(item).onConflictDoNothing();
  }
  console.log(`Seeded ${ITEMS.length} shop items.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
