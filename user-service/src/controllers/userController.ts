import { Request, Response } from 'express';
import { UserService } from '../services/userServices';
import { AVATAR_OPTIONS } from '../config/avatar';
import { registerSchema, updateProfileSchema, changePasswordSchema } from '../validator/userSchema';
import { handleAppError } from '../errors/handleAppError';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const user = await UserService.getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    handleAppError(error, res, 'getProfile', 'Error fetching profile');
  }
};

// Service-to-service endpoint — fetches multiple user profiles by ID
export const getProfilesForService = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids: string[] = req.body.ids;

    if (!ids?.length) {
      res.status(400).json({ message: 'No user IDs provided' });
      return;
    }

    const users = await UserService.getUsersByIds(ids);
    res.json(users);
  } catch (error) {
    handleAppError(error, res, 'getProfilesForService', 'Error fetching profiles');
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUser();
    res.json(users);
  } catch (error) {
    handleAppError(error, res, 'getAllUsers', 'Error fetching all profiles');
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id'] as string);
    const requesterId = (req as any).user.userId;

    const deletedCount = await UserService.deleteUser(id, requesterId);
    if (deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    handleAppError(error, res, 'deleteUser', 'Error deleting user');
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { username, email, password } = req.body;

    const parsed = updateProfileSchema.safeParse({ username, email });
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message });
      return;
    }

    const result = await UserService.updateProfile(userId, username, email, password);
    if (!result.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: result.emailChanged
        ? 'Profile updated. Please check your new email to verify the change.'
        : 'Profile updated successfully',
      emailChanged: result.emailChanged,
      user: result.user,
    });
  } catch (error) {
    handleAppError(error, res, 'updateUserProfile', 'Error updating profile');
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message });
      return;
    }

    const updated = await UserService.updatePassword(userId, currentPassword, newPassword);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    handleAppError(error, res, 'updatePassword', 'Error changing password');
  }
};

export const updateProfileIcon = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { profile_icon } = req.body;

    if (!profile_icon) {
      res.status(400).json({ message: 'Profile icon is required' });
      return;
    }

    const updatedUser = await UserService.updateProfileIcon(userId, profile_icon);
    res.json({ message: 'Profile icon updated successfully', user: updatedUser });
  } catch (error) {
    handleAppError(error, res, 'updateProfileIcon', 'Error updating profile icon');
  }
};

// Cached for 6 hours — avatar options rarely change
export const getAvatarOptions = (_req: Request, res: Response): void => {
  res.set('Cache-Control', 'public, max-age=21600, immutable');
  const avatars = AVATAR_OPTIONS.map((key) => ({
    key,
    url: `${process.env.GCS_BUCKET_URL}/${key}.png`,
  }));
  res.json({ avatars });
};

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    const admin = await UserService.createAdmin(username, email, password);
    
    res.status(201).json({ message: 'Admin created successfully', user: admin });
  } catch (error) {
    handleAppError(error, res, 'createAdmin', 'Error creating admin');
  }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const requesterId = (req as any).user.userId;
    const { is_banned } = req.body;

    const user = await UserService.banUser(id, is_banned, requesterId);
    const action = is_banned ? 'banned' : 'unbanned';

    res.json({ message: `User ${action} successfully`, user });
  } catch (error) {
    handleAppError(error, res, 'banUser', 'Error updating ban status');
  }
};
