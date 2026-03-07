import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { z } from 'zod';

// Register User
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error: any) {
    console.error("🔥 REGISTRATION ERROR:", error);
    res.status(400).json({ error: error.errors || "Server Error" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.access_role },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: { id: user.id, username: user.username, role: user.access_role } 
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error during login" });
  }
};
