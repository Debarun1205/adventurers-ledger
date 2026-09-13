import type { users } from "@/db/schema";

type UserRow = typeof users.$inferSelect;

/** Never send passwordHash to the client. Use this on every character response. */
export function toPublicCharacter(user: UserRow) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- deliberately dropping this field
  const { passwordHash, ...safe } = user;
  return safe;
}
