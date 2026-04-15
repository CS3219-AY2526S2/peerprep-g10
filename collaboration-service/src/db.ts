import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function pingDb() {
  const res = await pool.query("SELECT 1 as ok");
  return res.rows[0]?.ok === 1;
}
