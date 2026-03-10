import bcrypt from 'bcrypt';
import { UserDB } from '../model/userModel';

export const UserService = {
  async getUserById(id: string) {
    return await UserDB.getUserById(id);
  },

  async getAllUser() {
    // Logic could go here in the future
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

    return await UserDB.updateProfile(userId, username, email);
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    // Check old password first
    await this.verifyUserPassword(userId, currentPassword);

    const saltRounds = 12;
    const hashed = await bcrypt.hash(newPassword, saltRounds);
    
    return await UserDB.updatePassword(userId, hashed);
  }
};

