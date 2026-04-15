// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for AuthService covering registration, login, email verification, and resend verification flows. Included mocking of UserDB, VerificationDB, bcrypt, and jsonwebtoken with extensive success and error case coverage.
// Author review: Accepted as-is and integrated into test suite to validate authentication business logic and error handling across service layer.
import { AuthService } from '../../services/authServices';
import { UserDB } from '../../model/userModel';
import { VerificationDB } from '../../model/verificationModel';
import { Errors } from '../../errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../model/userModel');
jest.mock('../../model/verificationModel');
jest.mock('../../config/avatar');
jest.mock('../../config/email');
jest.mock('../../services/banService', () => ({
  BanService: {
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUser = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  password: 'hashed',
  access_role: 'user',
  profile_icon: 'https://example.com/avatar.png',
  is_verified: true,
  is_banned: false,
};

describe('AuthService.register', () => {
  it('throws EMAIL_EXISTS if email already taken', async () => {
    (UserDB.findByEmailOrUsername as jest.Mock).mockResolvedValue({ ...mockUser });
    await expect(AuthService.register('alice', 'alice@example.com', 'Pass123!')).rejects.toThrow(Errors.EMAIL_EXISTS);
  });

  it('throws USERNAME_EXISTS if username already taken', async () => {
    (UserDB.findByEmailOrUsername as jest.Mock).mockResolvedValue({ ...mockUser, email: 'other@example.com' });
    await expect(AuthService.register('alice', 'new@example.com', 'Pass123!')).rejects.toThrow(Errors.USERNAME_EXISTS);
  });

  it('creates user and sends verification email on success', async () => {
    (UserDB.findByEmailOrUsername as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (UserDB.createUser as jest.Mock).mockResolvedValue({ id: 1, username: 'alice', access_role: 'user' });
    (VerificationDB.createToken as jest.Mock).mockResolvedValue('token123');

    const result = await AuthService.register('alice', 'alice@example.com', 'Pass123!');
    expect(UserDB.createUser).toHaveBeenCalled();
    expect(VerificationDB.createToken).toHaveBeenCalled();
    expect(result.username).toBe('alice');
  });
});

describe('AuthService.login', () => {
  it('throws USER_NOT_FOUND if email does not exist', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.login('nobody@example.com', 'Pass123!')).rejects.toThrow(Errors.USER_NOT_FOUND);
  });

  it('throws USER_BANNED if user is banned', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue({ ...mockUser, is_banned: true });
    await expect(AuthService.login('alice@example.com', 'Pass123!')).rejects.toThrow(Errors.USER_BANNED);
  });

  it('throws EMAIL_NOT_VERIFIED if user is not verified', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue({ ...mockUser, is_verified: false });
    await expect(AuthService.login('alice@example.com', 'Pass123!')).rejects.toThrow(Errors.EMAIL_NOT_VERIFIED);
  });

  it('throws INVALID_PASSWORD if password does not match', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(AuthService.login('alice@example.com', 'wrong')).rejects.toThrow(Errors.INVALID_PASSWORD);
  });

  it('returns token and user on valid credentials', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

    const result = await AuthService.login('alice@example.com', 'Pass123!');
    expect(result.token).toBe('jwt-token');
    expect(result.user.email).toBe('alice@example.com');
  });
});

describe('AuthService.verifyEmail', () => {
  it('throws INVALID_TOKEN if token not found', async () => {
    (VerificationDB.findToken as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.verifyEmail('bad-token')).rejects.toThrow(Errors.INVALID_TOKEN);
  });

  it('throws TOKEN_EXPIRED if token is expired', async () => {
    (VerificationDB.findToken as jest.Mock).mockResolvedValue({
      expires_at: new Date(Date.now() - 1000),
      type: 'registration',
    });
    (VerificationDB.deleteToken as jest.Mock).mockResolvedValue(undefined);
    await expect(AuthService.verifyEmail('expired-token')).rejects.toThrow(Errors.TOKEN_EXPIRED);
  });

  it('marks user verified for registration token', async () => {
    (VerificationDB.findToken as jest.Mock).mockResolvedValue({
      user_id: 1, type: 'registration', expires_at: new Date(Date.now() + 60000),
    });
    (UserDB.markVerified as jest.Mock).mockResolvedValue(mockUser);
    (VerificationDB.deleteToken as jest.Mock).mockResolvedValue(undefined);
    (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

    const result = await AuthService.verifyEmail('valid-token');
    expect(UserDB.markVerified).toHaveBeenCalledWith(1);
    expect(result.isEmailChange).toBe(false);
  });
});

describe('AuthService.resendVerification', () => {
  it('throws USER_NOT_FOUND if email not registered', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(AuthService.resendVerification('nobody@example.com')).rejects.toThrow(Errors.USER_NOT_FOUND);
  });

  it('throws ALREADY_VERIFIED if already verified', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue({ ...mockUser, is_verified: true });
    await expect(AuthService.resendVerification('alice@example.com')).rejects.toThrow(Errors.ALREADY_VERIFIED);
  });

  it('creates token and sends email if unverified', async () => {
    (UserDB.findByEmail as jest.Mock).mockResolvedValue({ ...mockUser, is_verified: false });
    (VerificationDB.createToken as jest.Mock).mockResolvedValue('token123');
    await AuthService.resendVerification('alice@example.com');
    expect(VerificationDB.createToken).toHaveBeenCalled();
  });
});