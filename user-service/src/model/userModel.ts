import pool from '../config/db';

export const UserDB = {
  async findByEmailOrUsername(email: string, username: string) {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    return result.rows[0];
  },

  async findByEmail(email: string) {
    const result = await pool.query('SELECT id, username, email, password, access_role, profile_icon, is_banned FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async createUser(username: string, email: string, passwordHash: string, profileIcon: string) {
    const result = await pool.query(
      'INSERT INTO users (username, email, password, profile_icon) VALUES ($1, $2, $3, $4) RETURNING id, username, access_role',
      [username, email, passwordHash, profileIcon]
    );
    return result.rows[0];
  },

  async getUserById(id: string) {
    const result = await pool.query(
      'SELECT id, username, email, password, access_role, profile_icon, is_banned FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async getAllUsers() {
    const result = await pool.query(
      'SELECT id, username, email, access_role, profile_icon, is_banned created_at FROM users'
    );
    return result.rows;
  },

  async deleteUser(id: string) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id', 
      [id]
    );
    return result.rowCount;
  },

  async updateProfile(id: string, username: string, email: string) {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, profile_icon',
      [username, email, id]
    );
    return result.rows[0];
  },

  async updatePassword(id: string, hashedPassword: string) {
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    return result.rows[0];
  },

  async updateProfileIcon(id: string, profileIcon: string) {
    const result = await pool.query(
      'UPDATE users SET profile_icon = $1 WHERE id = $2 RETURNING id, username, email, profile_icon',
      [profileIcon, id]
    );
    return result.rows[0];
  },

  async createAdmin(username: string, email: string, hashedPassword: string, profileIcon: string) {
    const accessRole = 'admin';
    const isVerified = true;

    const result = await pool.query(
      `INSERT INTO users (username, email, password, access_role, is_verified, profile_icon) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, username, access_role`,
      [username, email, hashedPassword, accessRole, isVerified, profileIcon]
    );
    return result.rows[0];
  },
};
