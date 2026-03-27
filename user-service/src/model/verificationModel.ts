import pool from '../config/db';
import crypto from 'crypto';

export const VerificationDB = {
  async createToken(userId: number) {
    const token = crypto.randomBytes(32).toString('hex');  // 64 char hex token
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing token for this user first
    await pool.query('DELETE FROM email_verifications WHERE user_id = $1', [userId]);

    const result = await pool.query(
      `INSERT INTO email_verifications (user_id, token, expires_at) 
       VALUES ($1, $2, $3) 
       RETURNING token`,
      [userId, token, expiresAt]
    );
    return result.rows[0].token;
  },

  async findToken(token: string) {
    const result = await pool.query(
      `SELECT ev.*, u.email, u.username 
       FROM email_verifications ev
       JOIN users u ON u.id = ev.user_id
       WHERE ev.token = $1`,
      [token]
    );
    return result.rows[0];
  },

  async deleteToken(token: string) {
    await pool.query('DELETE FROM email_verifications WHERE token = $1', [token]);
  },
};