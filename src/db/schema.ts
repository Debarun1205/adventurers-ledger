import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  boolean,
  pgEnum,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const attributeEnum = pgEnum("attribute", [
  "strength",
  "intellect",
  "vitality",
  "charisma",
  "discipline",
]);

export const difficultyEnum = pgEnum("difficulty", [
  "trivial",
  "easy",
  "medium",
  "hard",
  "epic",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Character progression
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0), // XP earned toward the current level
  gold: integer("gold").notNull().default(50),

  // Attributes
  strength: integer("strength").notNull().default(1),
  intellect: integer("intellect").notNull().default(1),
  vitality: integer("vitality").notNull().default(1),
  charisma: integer("charisma").notNull().default(1),
  discipline: integer("discipline").notNull().default(1),

  // Streaks
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),

  equippedTheme: text("equipped_theme").notNull().default("tavern"),
  equippedBadge: text("equipped_badge"),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  notes: text("notes"),
  attribute: attributeEnum("attribute").notNull().default("discipline"),
  difficulty: difficultyEnum("difficulty").notNull().default("easy"),
  isDone: boolean("is_done").notNull().default(false),
  isRecurring: boolean("is_recurring").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const completions = pgTable("completions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  attribute: attributeEnum("attribute").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  xpAwarded: integer("xp_awarded").notNull(),
  goldAwarded: integer("gold_awarded").notNull(),
  completedOn: date("completed_on").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shopItems = pgTable("shop_items", {
  id: text("id").primaryKey(), // slug, e.g. "theme-cyberpunk"
  name: text("name").notNull(),
  description: text("description").notNull(),
  kind: text("kind").notNull(), // "theme" | "badge"
  cost: integer("cost").notNull(),
});

export const inventory = pgTable(
  "inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => shopItems.id, { onDelete: "cascade" }),
    purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("user_item_unique").on(t.userId, t.itemId)]
);

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  completions: many(completions),
  inventory: many(inventory),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  user: one(users, { fields: [inventory.userId], references: [users.id] }),
  item: one(shopItems, { fields: [inventory.itemId], references: [shopItems.id] }),
}));
