import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRandomAvatar } from '../config/avatar';
import { sendVerificationEmail } from '../config/email';
import { VerificationDB } from '../model/verificationModel';
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

    const user = await UserDB.createUser(username, lowercaseEmail, hashedPassword, randomIcon);
    
    // Create verification token and send email
    const token = await VerificationDB.createToken(user.id);
    await sendVerificationEmail(lowercaseEmail, token);

    return user;
  },

  async login(email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await UserDB.findByEmail(lowercaseEmail);
    
    if (!user) throw new Error("USER_NOT_FOUND");
    if (user.is_banned) throw new Error("USER_BANNED");
    if (!user.is_verified) throw new Error('EMAIL_NOT_VERIFIED');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("INVALID_PASSWORD");

    const token = jwt.sign(
      { userId: user.id, username: user.username, access_role: user.access_role },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );
    
    return { 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        access_role: user.access_role,
        profile_icon: user.profile_icon 
      } 
    };
  },

  async verifyEmail(token: string) {
    const record = await VerificationDB.findToken(token);

    if (!record) throw new Error('INVALID_TOKEN');

    const expired = new Date() > new Date(record.expires_at);
    if (expired) {
      await VerificationDB.deleteToken(token);
      throw new Error('TOKEN_EXPIRED');
    }

    // Mark user as verified
    const user = await UserDB.markVerified(record.user_id);

    // Delete used token
    await VerificationDB.deleteToken(token);

    // Auto login — generate JWT
    const jwtToken = jwt.sign(
      { userId: user.id, username: user.username, access_role: user.access_role },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );

    return {
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        access_role: user.access_role,
        profile_icon: user.profile_icon,
      }
    };
  },

  async resendVerification(email: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await UserDB.findByEmail(lowercaseEmail);

    if (!user) throw new Error('USER_NOT_FOUND');
    if (user.is_verified) throw new Error('ALREADY_VERIFIED');

    const token = await VerificationDB.createToken(user.id);
    await sendVerificationEmail(lowercaseEmail, token);
  },
};
