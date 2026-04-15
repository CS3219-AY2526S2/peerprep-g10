// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for Express user controller endpoints including profile management, admin actions, and avatar handling. Included mocking of UserService and validation of success/error cases.
// Author review: Accepted as-is and integrated into test suite to improve backend controller test coverage.
import { Request, Response } from 'express';
import {
  getProfile, deleteUser, updateUserProfile,
  updatePassword, updateProfileIcon, getAvatarOptions,
  createAdmin, banUser, getProfilesForService,
} from '../../controllers/userController';
import { UserService } from '../../services/userServices';

jest.mock('../../services/userServices');
jest.mock('../../config/avatar', () => ({
  AVATAR_OPTIONS: ['default', 'zen'],
}));

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

const authedReq = (overrides = {}) =>
  ({ user: { userId: '1', access_role: 'user' }, body: {}, params: {}, query: {}, ...overrides } as unknown as Request);

describe('getProfile', () => {
  it('returns user profile', async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'alice' });
    const res = mockRes();
    await getProfile(authedReq(), res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'alice' });
  });

  it('returns 404 if user not found', async () => {
    (UserService.getUserById as jest.Mock).mockResolvedValue(null);
    const res = mockRes();
    await getProfile(authedReq(), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deleteUser', () => {
  it('returns 404 if no user deleted', async () => {
    (UserService.deleteUser as jest.Mock).mockResolvedValue(0);
    const res = mockRes();
    await deleteUser(authedReq({ params: { id: '99' } }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns success message on delete', async () => {
    (UserService.deleteUser as jest.Mock).mockResolvedValue(1);
    const res = mockRes();
    await deleteUser(authedReq({ params: { id: '2' } }), res);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
  });
});

describe('updateUserProfile', () => {
  it('returns 400 for invalid email', async () => {
    const res = mockRes();
    await updateUserProfile(authedReq({ body: { username: 'al', email: 'bad-email', password: 'Pass123!' } }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns updated user on success', async () => {
    (UserService.updateProfile as jest.Mock).mockResolvedValue({ user: { id: 1 }, emailChanged: false });
    const res = mockRes();
    await updateUserProfile(authedReq({ body: { username: 'alice', email: 'alice@example.com', password: 'Pass123!' } }), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Profile updated successfully' }));
  });
});

describe('updatePassword', () => {
  it('returns 400 for invalid schema', async () => {
    const res = mockRes();
    await updatePassword(authedReq({ body: { currentPassword: 'short', newPassword: 'x' } }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns success on valid input', async () => {
    (UserService.updatePassword as jest.Mock).mockResolvedValue({ id: 1 });
    const res = mockRes();
    await updatePassword(authedReq({ body: { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' } }), res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
  });
});

describe('updateProfileIcon', () => {
  it('returns 400 if no icon provided', async () => {
    const res = mockRes();
    await updateProfileIcon(authedReq({ body: {} }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns updated user on success', async () => {
    (UserService.updateProfileIcon as jest.Mock).mockResolvedValue({ id: 1, profile_icon: 'zen' });
    const res = mockRes();
    await updateProfileIcon(authedReq({ body: { profile_icon: 'zen' } }), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Profile icon updated successfully' }));
  });
});

describe('getAvatarOptions', () => {
  it('returns list of avatar objects', () => {
    process.env.GCS_BUCKET_URL = 'https://bucket.example.com';
    const res = mockRes();
    getAvatarOptions(authedReq(), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ avatars: expect.any(Array) }));
  });
});

describe('createAdmin', () => {
  it('returns 201 on success', async () => {
    (UserService.createAdmin as jest.Mock).mockResolvedValue({ id: 2, username: 'admin2', access_role: 'admin' });
    const res = mockRes();
    await createAdmin(authedReq({ body: { username: 'admin2', email: 'admin2@example.com', password: 'Admin123!' } }), res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('banUser', () => {
  it('returns banned user on success', async () => {
    (UserService.banUser as jest.Mock).mockResolvedValue({ id: 2, is_banned: true });
    const res = mockRes();
    await banUser(authedReq({ params: { id: '2' }, body: { is_banned: true } }), res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User banned successfully' }));
  });
});

describe('getProfilesForService', () => {
  it('returns 400 if no ids provided', async () => {
    const res = mockRes();
    await getProfilesForService(authedReq({ body: {} }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns users for valid ids', async () => {
    (UserService.getUsersByIds as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const res = mockRes();
    await getProfilesForService(authedReq({ body: { ids: ['1'] } }), res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});