// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for UserService including user deletion, password updates, admin creation, and banning logic. Included mocking of UserDB and bcrypt with full coverage of success and error scenarios.
// Author review: Accepted as-is and integrated into test suite to validate user management business logic and enforcement of system constraints.
import { UserService } from '../../services/userServices';
import { UserDB } from '../../model/userModel';
import { Errors } from '../../errors/AppError';
import bcrypt from 'bcrypt';

jest.mock('../../model/userModel');
jest.mock('../../model/verificationModel');
jest.mock('../../config/avatar');
jest.mock('../../config/email');
jest.mock('../../services/banService', () => ({
  BanService: {
    banUser: jest.fn().mockResolvedValue(undefined),
    unbanUser: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('bcrypt');

const mockUser = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  password: 'hashed',
  access_role: 'user',
  profile_icon: null,
  is_verified: true,
  is_banned: false,
};

describe('UserService.deleteUser', () => {
  it('throws SELF_DELETE if deleting own account', async () => {
    await expect(UserService.deleteUser(1, 1)).rejects.toThrow(Errors.SELF_DELETE);
  });

  it('calls UserDB.deleteUser for a different user', async () => {
    (UserDB.deleteUser as jest.Mock).mockResolvedValue(1);
    await UserService.deleteUser(2, 1);
    expect(UserDB.deleteUser).toHaveBeenCalledWith(2);
  });
});

describe('UserService.updatePassword', () => {
  it('throws INCORRECT_PASSWORD if current password is wrong', async () => {
    (UserDB.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(UserService.updatePassword('1', 'wrongpass', 'NewPass123!')).rejects.toThrow(Errors.INCORRECT_PASSWORD);
  });

  it('hashes and updates password on success', async () => {
    (UserDB.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
    (UserDB.updatePassword as jest.Mock).mockResolvedValue({ id: 1 });

    await UserService.updatePassword('1', 'Pass123!', 'NewPass123!');
    expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123!', 12);
    expect(UserDB.updatePassword).toHaveBeenCalledWith('1', 'newhashed');
  });
});

describe('UserService.banUser', () => {
  it('throws SELF_DELETE if banning own account', async () => {
    await expect(UserService.banUser('1', true, '1')).rejects.toThrow(Errors.SELF_DELETE);
  });

  it('throws USER_DB_NOT_FOUND if user does not exist', async () => {
    (UserDB.getUserById as jest.Mock).mockResolvedValue(null);
    await expect(UserService.banUser('2', true, '1')).rejects.toThrow(Errors.USER_DB_NOT_FOUND);
  });

  it('throws CANNOT_BAN_ADMIN if target is admin', async () => {
    (UserDB.getUserById as jest.Mock).mockResolvedValue({ ...mockUser, access_role: 'admin' });
    await expect(UserService.banUser('2', true, '1')).rejects.toThrow(Errors.CANNOT_BAN_ADMIN);
  });

  it('bans user successfully', async () => {
    (UserDB.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (UserDB.updateUserBanStatus as jest.Mock).mockResolvedValue({ ...mockUser, is_banned: true });
    const result = await UserService.banUser('2', true, '1');
    expect(result.is_banned).toBe(true);
  });
});

describe('UserService.createAdmin', () => {
  it('throws EMAIL_EXISTS if email taken', async () => {
    (UserDB.findByEmailOrUsername as jest.Mock).mockResolvedValue({ ...mockUser });
    await expect(UserService.createAdmin('admin2', 'alice@example.com', 'Pass123!')).rejects.toThrow(Errors.EMAIL_EXISTS);
  });

  it('creates admin successfully', async () => {
    (UserDB.findByEmailOrUsername as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (UserDB.createAdmin as jest.Mock).mockResolvedValue({ id: 2, username: 'admin2', access_role: 'admin' });
    const result = await UserService.createAdmin('admin2', 'admin2@example.com', 'Pass123!');
    expect(result.access_role).toBe('admin');
  });
});