import { Request, Response } from 'express';
import { UserService } from '../services/userServices';
import { AVATAR_OPTIONS } from '../config/avatar';
import { registerSchema, updateProfileSchema, changePasswordSchema } from '../validator/userSchema';
import { request } from 'node:http';
import { handleAppError } from '../errors/handleAppError';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    handleAppError(error, res, 'getProfile', 'Error fetching profile');
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUser();
    res.json(users);
  } catch (error) {
    handleAppError(error, res, 'getAllUsers', 'Error fetching all profiles');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params['id'] as string);
    const requesterId = (req as any).user.userId;
  
    const deletedCount = await UserService.deleteUser(id, requesterId);
    if (deletedCount === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `User deleted successfully` });
  } catch (error: any) {
    handleAppError(error, res, 'deleteUser', 'Error deleting user');
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

    const result = await UserService.updateProfile(userId, username, email, password);
    if (!result.user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: result.emailChanged
        ? 'Profile updated. Please check your new email to verify the change.'
        : 'Profile updated successfully',
      emailChanged: result.emailChanged,
      user: result.user,
    });
  } catch (error: any) {
    handleAppError(error, res, 'updateUserProfile', 'Error updating profile');
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
    handleAppError(error, res, 'updatePassword', 'Error changing password');
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
    handleAppError(error, res, 'updateProfileIcon', 'Error updating profile icon');
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
    handleAppError(error, res, 'createAdmin', 'Error creating admin');
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
    handleAppError(error, res, 'banUser', 'Error updating ban status');
  }
};