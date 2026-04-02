import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userServices';
import { AVATAR_OPTIONS } from '../config/avatar';
import { registerSchema, updateProfileSchema, changePasswordSchema } from '../validator/userSchema';
import { request } from 'node:http';

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

export const getProfilesForService = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids;
    if (!ids?.length) return res.status(400).json({ message: 'No user IDs provided' });

    const users = await UserService.getUsersByIds(ids);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching profiles" });
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
    const id = parseInt(req.params['id'] as string);
    const requesterId = (req as any).user.userId;
  
    const deletedCount = await UserService.deleteUser(id, requesterId);

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User deleted successfully` });
  } catch (error: any) {
    if (error.message === 'SELF_DELETE') {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    if (error.message.includes('LAST_ADMIN')) {
      return res.status(400).json({ message: 'Cannot delete the last admin account' });
    }
    res.status(500).json({ message: 'Error deleting user' });
  }
};

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
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(400).json({ message: 'This email is already in use.' });
    }
    if (error.message === 'USERNAME_EXISTS') {
      return res.status(400).json({ message: 'This username is already taken.' });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};

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

export const updateProfileIcon = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { profile_icon } = req.body;

    if (!profile_icon) {
      return res.status(400).json({ message: "Profile icon is required" });
    }
    
    const updatedUser = await UserService.updateProfileIcon(userId, profile_icon);
    res.json({ message: "Profile icon updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile icon" });
  }
};

export const getAvatarOptions = (_req: Request, res: Response) => {
  res.set('Cache-Control', 'public, max-age=21600, immutable');
  const avatars = AVATAR_OPTIONS.map((key) => ({
    key,
    url: `${process.env.GCS_BUCKET_URL}/${key}.png`,
  }));
  res.json({ avatars });
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    const admin = await UserService.createAdmin(username, email, password);

    res.status(201).json({ message: 'Admin created successfully', user: admin });
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ message: "This email is already registered." });
    }
    if (error.message === "USERNAME_EXISTS") {
      return res.status(400).json({ message: "This username is already taken. Please choose another." });
    }
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Inalid input data";
      return res.status(400).json({ message });
    }
    
    console.error("FAILED TO CREATE ADMIN:", error);
    res.status(400).json({ error: error.errors || "Server Error" });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const requesterId = (req as any).user.userId;

    const { is_banned } = req.body;

    const user = await UserService.banUser(id, is_banned, requesterId);

    const action = is_banned ? 'banned' : 'unbanned';

    res.json({
      message: `User ${action} successfully`,
      user
    });

  } catch (error: any) {
    console.log(error);
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.message === 'CANNOT_BAN_ADMIN') {
      return res.status(403).json({ message: 'Cannot ban an admin account' });
    }
    if (error.message === 'SELF_DELETE') {
      return res.status(400).json({ message: 'You cannot ban yourself' });
    }

    res.status(500).json({ message: 'Error updating ban status' });
  }
};