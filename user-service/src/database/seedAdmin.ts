import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import pool from '../config/db';

const SALT_ROUNDS = 12;

export async function seedAdminIfNotExists(db: Pool): Promise<void> {
  const password = process.env.ADMIN_SEED_PASSWORD;
  const email    = process.env.ADMIN_SEED_EMAIL    || 'admin@peerprep.com';
  const username = process.env.ADMIN_SEED_USERNAME || 'admin';
  const profile_url = process.env.ADMIN_SEED_PROFILE_URL || 'https://storage.googleapis.com/peerprep/avatars/default.png';

  if (!password) {
    console.warn('[Seed] ADMIN_SEED_PASSWORD is not set — skipping admin seed.');
    return;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await db.query(
    `INSERT INTO users (username, email, password, profile_icon,access_role, is_verified)
     VALUES ($1, $2, $3, $4, 'admin', TRUE)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, username, email`,
    [username, email, hashed, profile_url]
  );

  if (result.rowCount === 0) {
    console.log(`[Seed] Admin already exists for ${email} — skipping.`);
  } else {
    console.log(`[Seed] Admin created: ${result.rows[0].email} (id=${result.rows[0].id})`);
  }
}

if (require.main === module) {
  (async () => {
    try {
      await seedAdminIfNotExists(pool);
    } catch (err) {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    } finally {
      await pool.end();
    }
  })();
}