import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __liferpg_pg_client: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

// Reuse the connection across hot-reloads in dev so we don't exhaust the pool.
const client =
  global.__liferpg_pg_client ??
  postgres(connectionString, { max: 10, prepare: false });

if (process.env.NODE_ENV !== "production") {
  global.__liferpg_pg_client = client;
}

export const db = drizzle(client, { schema });
