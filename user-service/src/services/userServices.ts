import bcrypt from 'bcrypt';
import { UserDB } from '../model/userModel';
import { getDefaultAvatar } from '../config/avatar';

export const UserService = {
  async getUserById(id: string) {
    const user = await UserDB.getUserById(id);
    user.profile_icon = user.profile_icon ?? getDefaultAvatar();
    return user;
  },

  async getAllUser() {
    return await UserDB.getAllUsers();
  },

  async deleteUser(id: string) {
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

    // Check if email or username is taken by another user
    const existing = await UserDB.findByEmailOrUsername(email, username);
    if (existing && existing.id !== userId) {
      if (existing.email === email) throw new Error('EMAIL_EXISTS');
      if (existing.username === username) throw new Error('USERNAME_EXISTS');
    }

    return await UserDB.updateProfile(userId, username, email);
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
};

