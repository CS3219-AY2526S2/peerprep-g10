import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, authenticateServiceToken } from '../../middleware/authMiddleware';
import { BanService } from '../../services/banService';
import { UserDB } from '../../model/userModel';

jest.mock('jsonwebtoken');
jest.mock('../../model/userModel');

const mockReq = (headers = {}) => ({ headers } as unknown as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const next: NextFunction = jest.fn();

describe('authenticateToken', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
    jest.spyOn(BanService, 'isBanned').mockResolvedValue(false);
    jest.spyOn(BanService, 'isDeleted').mockResolvedValue(false);
  });

  it('returns 401 if no token provided', async () => {
    const res = mockRes();
    await authenticateToken(mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 403 if token is invalid', async () => {
    const res = mockRes();

    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
    await authenticateToken(mockReq({ authorization: 'Bearer badtoken' }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('calls next and attaches user if token is valid', async () => {
    const res = mockRes();
    const decoded = { userId: 1, username: 'alice', access_role: 'user' };

    (jwt.verify as jest.Mock).mockReturnValue(decoded);
    (UserDB.getUserById as jest.Mock).mockResolvedValue({ id: 1, username: 'alice' });
    const req = mockReq({ authorization: 'Bearer validtoken' });

    await authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(decoded);
  });

  it('returns 403 with USER_DELETED when the account no longer exists', async () => {
    const res = mockRes();
    const decoded = { userId: 1, username: 'alice', access_role: 'user' };

    (jwt.verify as jest.Mock).mockReturnValue(decoded);
    (UserDB.getUserById as jest.Mock).mockResolvedValue(null);
    (BanService.isDeleted as jest.Mock).mockResolvedValue(true);

    await authenticateToken(mockReq({ authorization: 'Bearer validtoken' }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Your account has been deleted',
      code: 'USER_DELETED',
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('authenticateServiceToken', () => {
  beforeEach(() => {
    process.env.SERVICE_SECRET_KEY = 'service-secret';
  });

  it('returns 403 if service key is wrong', () => {
    const res = mockRes();

    authenticateServiceToken(mockReq({ authorization: 'Bearer wrong' }), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('calls next if service key matches', () => {
    const res = mockRes();
    
    authenticateServiceToken(mockReq({ authorization: 'Bearer service-secret' }), res, next);
    expect(next).toHaveBeenCalled();
  });
});