import { Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import { getUserById, getAllUsersDB, deleteUserDB, updateUserDB } from '../services/userServices';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersDB();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await deleteUserDB(id as string);
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { username, email } = req.body;

    // Validate email format if it's being updated
    if (email && !isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const updatedUser = await updateUserDB(userId, username, email);
    
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};