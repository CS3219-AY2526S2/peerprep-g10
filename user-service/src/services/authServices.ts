import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRandomAvatar } from '../config/avatar';
import { sendVerificationEmail } from '../config/email';
import { VerificationDB } from '../model/verificationModel';
import { UserDB } from '../model/userModel';
import { Errors } from '../errors/AppError';

const SALT_ROUNDS = 12;
const JWT_EXPIRY = '6h';

// Signs a JWT with the user's id, username, and role
const generateJWT = (user: any): string => {
  return jwt.sign(
    { userId: user.id, username: user.username, access_role: user.access_role },
    process.env.JWT_SECRET as string,
    { expiresIn: JWT_EXPIRY }
  );
};

const formatUser = (user: any) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  access_role: user.access_role,
  profile_icon: user.profile_icon,
});

export const AuthService = {
  async register(username: string, email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();

    // Check for duplicate email or username before creating
    const existing = await UserDB.findByEmailOrUsername(lowercaseEmail, username);
    if (existing) {
      if (existing.email === lowercaseEmail) throw Errors.EMAIL_EXISTS;
      if (existing.username === username) throw Errors.USERNAME_EXISTS;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const randomIcon = getRandomAvatar();
    const user = await UserDB.createUser(username, lowercaseEmail, hashedPassword, randomIcon);

    // Create a verification token and email it to the user
    const token = await VerificationDB.createToken(user.id);
    await sendVerificationEmail(lowercaseEmail, token);

    return user;
  },

  async login(email: string, password: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await UserDB.findByEmail(lowercaseEmail);

    if (!user) throw Errors.USER_NOT_FOUND;
    if (user.is_banned) throw Errors.USER_BANNED;
    if (!user.is_verified) throw Errors.EMAIL_NOT_VERIFIED;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw Errors.INVALID_PASSWORD;

    return {
      token: generateJWT(user),
      user: formatUser(user),
    };
  },

  async verifyEmail(token: string) {
    const record = await VerificationDB.findToken(token);
    if (!record) throw Errors.INVALID_TOKEN;

    const isExpired = new Date() > new Date(record.expires_at);
    if (isExpired) {
      await VerificationDB.deleteToken(token);
      throw Errors.TOKEN_EXPIRED;
    }

    // Email change tokens update the email; registration tokens mark the user verified
    const user = await (
      record.type === 'email_change'
        ? UserDB.updateEmail(record.user_id, record.new_email)
        : UserDB.markVerified(record.user_id)
    );

    await VerificationDB.deleteToken(token);

    return {
      token: generateJWT(user),
      user: formatUser(user),
      isEmailChange: record.type === 'email_change',
    };
  },

  async resendVerification(email: string) {
    const lowercaseEmail = email.toLowerCase().trim();
    const user = await UserDB.findByEmail(lowercaseEmail);

    if (!user) throw Errors.USER_NOT_FOUND;
    if (user.is_verified) throw Errors.ALREADY_VERIFIED;

    const token = await VerificationDB.createToken(user.id);
    await sendVerificationEmail(lowercaseEmail, token);
  },
};