import { Request, Response } from 'express';
import pool from '../config/db';

// Get User Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // This comes from your middleware after it decodes the token
    const userId = (req as any).user.userId;

    const result = await pool.query(
      'SELECT id, username, email, access_role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, username, email, access_role, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Delete User (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};