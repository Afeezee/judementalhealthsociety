/**
 * Neon HTTP driver + Drizzle. HTTP (not the WS pool) is the right choice
 * for Next.js server components and route handlers because each request
 * fetches on its own and there's no long-lived connection to leak on
 * cold start / cold shutdown.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export { schema };
