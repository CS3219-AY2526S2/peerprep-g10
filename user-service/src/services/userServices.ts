import bcrypt from 'bcrypt';
import { UserDB } from '../model/userModel';
import { getDefaultAvatar, getRandomAvatar } from '../config/avatar';

export const UserService = {
  async getUserById(id: string) {
    const user = await UserDB.getUserById(id);
    user.profile_icon = user.profile_icon ?? getDefaultAvatar();
    return user;
  },

  async getAllUser() {
    return await UserDB.getAllUsers();
  },

  async deleteUser(id: number, requesterId: number) {
    // Prevent self-deletion
    if (id === requesterId) throw new Error("SELF_DELETE");
    return await UserDB.deleteUser(id);
  },
  
  async verifyUserPassword(userId: string, plainPassword: string) {
    const user = await UserDB.getUserById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) throw new Error("Incorrect password");
    
    return user;
  },

  async updateProfile(userId: string, username: string, email: string, password: string) {
    // Check password first
    await this.verifyUserPassword(userId, password);

    const lowercaseEmail = email.toLowerCase().trim();
    const currentUser = await UserDB.getUserById(userId);

    const emailChanged = lowercaseEmail != currentUser.email;
    const usernameChanged = username != currentUser.username;

    // Find existing user only if changes are made to the email or username
    if (emailChanged || usernameChanged) {
      const existing = await UserDB.findByEmailOrUsername(
        emailChanged ? lowercaseEmail : "",
        usernameChanged ? username : ""
      );

      // Check if email or username is taken by another user
      if (existing && String(existing.id) !== userId) {
        if (existing.email === lowercaseEmail) throw new Error('EMAIL_EXISTS');
        if (existing.username === username) throw new Error('USERNAME_EXISTS');
      }
    }

    return await UserDB.updateProfile(userId, username, lowercaseEmail);
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    // Check old password first
    await this.verifyUserPassword(userId, currentPassword);

    const saltRounds = 12;
    const hashed = await bcrypt.hash(newPassword, saltRounds);
    
    return await UserDB.updatePassword(userId, hashed);
  },

  async updateProfileIcon(userId: string, profileIcon: string) {
    return await UserDB.updateProfileIcon(userId, profileIcon);
  },

  async createAdmin(username: string, email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const existing = await UserDB.findByEmailOrUsername(lowercaseEmail, username);

    if (existing) {
      if (existing.email === lowercaseEmail) throw new Error('EMAIL_EXISTS');
      if (existing.username === username) throw new Error('USERNAME_EXISTS');
    }

    const saltRounds = 12;
    const hashed = await bcrypt.hash(password, saltRounds);
    const randomIcon = getRandomAvatar();

    return await UserDB.createAdmin(username, lowercaseEmail, hashed, randomIcon);
  },

  async banUser(userId: string, isBanned: boolean, requesterId: string) {
    // Prevent self-deletion
    if (userId === requesterId) throw new Error("SELF_DELETE");

    const user = await UserDB.getUserById(userId);
    if (!user) throw new Error('User not found');

    if (user.access_role === 'admin') throw new Error('CANNOT_BAN_ADMIN');

    return await UserDB.updateUserBanStatus(Number(userId), isBanned);
  },
};

