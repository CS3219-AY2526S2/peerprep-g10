import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const register = async (username: string, email: string, password: string) => {
  const checkUser = await pool.query(
    'SELECT username, email FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );

  if (checkUser.rows.length > 0) {
    const existing = checkUser.rows[0];

    // Check email and username exist
    if (existing.email === email) throw new Error("EMAIL_EXISTS");
    if (existing.username === username) throw new Error("USERNAME_EXISTS");
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashedPassword]
  );
};

export const login = async (email: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) throw new Error("USER_NOT_FOUND");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("INVALID_PASSWORD");

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.access_role },
    process.env.JWT_SECRET as string,
    { expiresIn: '6h' }
  );

  return { 
    token, 
    user: { id: user.id, username: user.username, role: user.access_role } 
  };
};