import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRandomAvatar } from '../config/avatar';
import { UserDB } from '../model/userModel';

export const AuthService = {
  async register(username: string, email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const existing = await UserDB.findByEmailOrUsername(lowercaseEmail, username);
    if (existing) {
      if (existing.email === lowercaseEmail) throw new Error("EMAIL_EXISTS");
      if (existing.username === username) throw new Error("USERNAME_EXISTS");
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const randomIcon = getRandomAvatar();

    return await UserDB.createUser(username, lowercaseEmail, hashedPassword, randomIcon);
  },

  async login(email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await UserDB.findByEmail(lowercaseEmail);
    
    if (!user) throw new Error("USER_NOT_FOUND");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("INVALID_PASSWORD");

    const token = jwt.sign(
      { userId: user.id, username: user.username, access_role: user.access_role },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );
    
    return { 
      token, 
      user: { id: user.id, username: user.username, email: user.email, access_role: user.access_role, profile_icon: user.profile_icon } 
    };
  }
};
