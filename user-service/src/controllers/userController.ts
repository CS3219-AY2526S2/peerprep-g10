import { Request, Response } from 'express';
import { z } from 'zod';
import isEmail from 'validator/lib/isEmail';
import { UserService } from '../services/userServices';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await UserService.getUserById(userId);

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
    const users = await UserService.getAllUser();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await UserService.deleteUser(id as string);
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: `User with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// validate username and email
const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email()
    .refine((val) => isEmail(val), { 
        message: "Invalid email format. Please follow RFC5322 standards."
    }),
});

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { username, email, password } = req.body;

    // Validate email format if it's being updated
    const parseProfile = updateProfileSchema.safeParse({ username, email });

    if (!parseProfile.success) {
      return res.status(400).json({ message: parseProfile.error.issues[0]?.message });
    }

    const updatedUser = await UserService.updateProfile(userId, username, email, password);
    
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    if (error.message === "Incorrect password") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};

// validate pasword
const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[0-9]/, "Password needs a number")
    .regex(/[^A-Za-z0-9]/, "Password needs a special character"),
});

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    const parseResult = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.issues[0]?.message });
    }

    const updatedPassword = await UserService.updatePassword(userId, currentPassword, newPassword);

    if (!updatedPassword) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    if (error.message === "Incorrect password") {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Error changing password" });
  }
};