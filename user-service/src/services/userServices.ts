import bcrypt from 'bcrypt';
import { UserDB } from '../model/userModel';
import { VerificationDB } from '../model/verificationModel';
import { getDefaultAvatar, getRandomAvatar } from '../config/avatar';
import { sendEmailChangeVerification } from '../config/email';
import { Errors } from '../errors/AppError';
import { BanService } from './banService';

const SALT_ROUNDS = 12;

export const UserService = {
  async getUserById(id: string) {
    const user = await UserDB.getUserById(id);
    // Fall back to default avatar if none is set
    user.profile_icon = user.profile_icon ?? getDefaultAvatar();
    return user;
  },

  async getUsersByIds(ids: string[]) {
    return UserDB.getUsersByIds(ids);
  },

  async getAllUser() {
    return UserDB.getAllUsers();
  },

  async deleteUser(id: number, requesterId: number) {
    if (id === requesterId) throw Errors.SELF_DELETE;
    return UserDB.deleteUser(id);
  },

  // Verifies the user's current password
  async verifyUserPassword(userId: string, plainPassword: string) {
    const user = await UserDB.getUserById(userId);
    if (!user) throw Errors.USER_DB_NOT_FOUND;

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) throw Errors.INCORRECT_PASSWORD;

    return user;
  },

  async updateProfile(userId: string, username: string, email: string, password: string) {
    // Verify the user's current password before allowing changes
    await this.verifyUserPassword(userId, password);

    const lowercaseEmail = email.toLowerCase().trim();
    const currentUser = await UserDB.getUserById(userId);

    const emailChanged = lowercaseEmail !== currentUser.email;
    const usernameChanged = username !== currentUser.username;

    // Find existing user only if changes are made to the email or username
    if (emailChanged || usernameChanged) {
      const existing = await UserDB.findByEmailOrUsername(
        emailChanged ? lowercaseEmail : '',
        usernameChanged ? username : ''
      );

      // Check if email or username is taken by another user
      if (existing && String(existing.id) !== userId) {
        if (existing.email === lowercaseEmail) throw Errors.EMAIL_EXISTS;
        if (existing.username === username) throw Errors.USERNAME_EXISTS;
      }
    }

    if (emailChanged) {
      // Send a verification link to the new address before updating it
      const token = await VerificationDB.createEmailChangeToken(Number(userId), lowercaseEmail);
      await sendEmailChangeVerification(lowercaseEmail, token);

      // Only apply the username change immediately; email updates after verification
      const updatedUser = await UserDB.updateProfile(userId, username, currentUser.email);
      return { user: updatedUser, emailChanged: true };
    }

    const updatedUser = await UserDB.updateProfile(userId, username, lowercaseEmail);
    return { user: updatedUser, emailChanged: false };
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    await this.verifyUserPassword(userId, currentPassword);

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return UserDB.updatePassword(userId, hashed);
  },

  async updateProfileIcon(userId: string, profileIcon: string) {
    return UserDB.updateProfileIcon(userId, profileIcon);
  },

  async createAdmin(username: string, email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const existing = await UserDB.findByEmailOrUsername(lowercaseEmail, username);

    if (existing) {
      if (existing.email === lowercaseEmail) throw Errors.EMAIL_EXISTS;
      if (existing.username === username) throw Errors.USERNAME_EXISTS;
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const randomIcon = getRandomAvatar();
    return UserDB.createAdmin(username, lowercaseEmail, hashed, randomIcon);
  },

  async banUser(userId: string, isBanned: boolean, requesterId: string) {
    if (userId === requesterId) throw Errors.SELF_DELETE;

    const user = await UserDB.getUserById(userId);
    if (!user) throw Errors.USER_DB_NOT_FOUND;

    // Admins are protected from being banned
    if (user.access_role === 'admin') throw Errors.CANNOT_BAN_ADMIN;

    const updatedUser = await UserDB.updateUserBanStatus(Number(userId), isBanned);

    // Sync the ban state to Redis and publish the Pub/Sub event for real-time socket disconnection
    if (isBanned) {
      await BanService.banUser(userId);
    } else {
      await BanService.unbanUser(userId);
    }

    return updatedUser;
  },
};