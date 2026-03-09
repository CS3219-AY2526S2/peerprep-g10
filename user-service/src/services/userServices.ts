import pool from '../config/db';

export const getUserById = async (id: string) => {
  const result = await pool.query(
    'SELECT id, username, email, access_role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const getAllUsersDB = async () => {
  const result = await pool.query('SELECT id, username, email, access_role, created_at FROM users');
  return result.rows;
};

export const deleteUserDB = async (id: string) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rowCount;
};

export const updateUserDB = async (id: string, username: string, email: string) => {
  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
    [username, email, id]
  );
  return result.rows[0];
};

export const updateUserPasswordDB = async (id: string, hashedPassword: string) => {
  const result = await pool.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [hashedPassword, id]
  );
  return result.rows[0];
};