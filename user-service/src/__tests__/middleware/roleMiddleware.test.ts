// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for Express role-based authorization middleware authorizeRoles including role validation, unauthorized access handling, and multi-role support.
// Author review: Accepted as-is and integrated into test suite to validate access control logic and middleware behavior.
import { Request, Response, NextFunction } from 'express';
import { authorizeRoles } from '../../middleware/roleMiddleware';

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const next: NextFunction = jest.fn();

const mockReq = (user: any) => ({ user } as unknown as Request);

describe('authorizeRoles', () => {
  it('returns 403 if user has no role', () => {
    const res = mockRes();
    
    authorizeRoles('admin')(mockReq(null), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 403 if user role is not allowed', () => {
    const res = mockRes();

    authorizeRoles('admin')(mockReq({ access_role: 'user' }), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('calls next if user role is allowed', () => {
    const res = mockRes();

    authorizeRoles('admin')(mockReq({ access_role: 'admin' }), res, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next if user matches one of multiple allowed roles', () => {
    const res = mockRes();
    
    authorizeRoles('admin', 'user')(mockReq({ access_role: 'user' }), res, next);
    expect(next).toHaveBeenCalled();
  });
});