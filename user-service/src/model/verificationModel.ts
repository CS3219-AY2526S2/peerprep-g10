import pool from '../config/db';
import crypto from 'crypto';

const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export const VerificationDB = {
  // Creates a registration verification token, replacing any existing one for the user
  async createToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await pool.query('DELETE FROM email_verifications WHERE user_id = $1', [userId]);

    const result = await pool.query(
      `INSERT INTO email_verifications (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING token`,
      [userId, token, expiresAt]
    );
    return result.rows[0].token;
  },

  // Creates an email change token, replacing any existing email_change token for the user
  async createEmailChangeToken(userId: number, newEmail: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await pool.query(
      'DELETE FROM email_verifications WHERE user_id = $1 AND type = $2',
      [userId, 'email_change']
    );

    const result = await pool.query(
      `INSERT INTO email_verifications (user_id, token, type, new_email, expires_at)
       VALUES ($1, $2, 'email_change', $3, $4)
       RETURNING token`,
      [userId, token, newEmail, expiresAt]
    );
    return result.rows[0].token;
  },

  // Looks up a token and joins with the user's email and username
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

  async deleteToken(token: string): Promise<void> {
    await pool.query('DELETE FROM email_verifications WHERE token = $1', [token]);
  },
};