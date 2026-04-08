import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, authenticateServiceToken } from '../../middleware/authMiddleware';

jest.mock('jsonwebtoken');

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
  });

  it('returns 401 if no token provided', () => {
    const res = mockRes();
    authenticateToken(mockReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 403 if token is invalid', () => {
    const res = mockRes();

    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
    authenticateToken(mockReq({ authorization: 'Bearer badtoken' }), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('calls next and attaches user if token is valid', () => {
    const res = mockRes();
    const decoded = { userId: 1, username: 'alice', access_role: 'user' };

    (jwt.verify as jest.Mock).mockReturnValue(decoded);
    const req = mockReq({ authorization: 'Bearer validtoken' });

    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(decoded);
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