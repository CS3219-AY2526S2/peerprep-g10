import { Request, Response } from 'express';
import { registerUser, loginUser, verifyEmail, resendVerification } from '../../controllers/authController';
import { AuthService } from '../../services/authServices';

jest.mock('../../services/authServices');

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('registerUser', () => {
  it('returns 201 on successful registration', async () => {
    (AuthService.register as jest.Mock).mockResolvedValue({});
    const req = { body: { username: 'alice', email: 'alice@example.com', password: 'Pass123!' } } as Request;
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('handles errors via handleAppError', async () => {
    (AuthService.register as jest.Mock).mockRejectedValue(new Error('fail'));
    const req = { body: { username: 'a', email: 'bad', password: 'short' } } as Request;
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});

describe('loginUser', () => {
  it('returns 200 with token on success', async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({ token: 'jwt', user: { id: 1 } });
    const req = { body: { email: 'alice@example.com', password: 'Pass123!' } } as Request;
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt' }));
  });
});

describe('verifyEmail', () => {
  it('returns 400 if token is missing', async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();
    await verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns result on valid token', async () => {
    (AuthService.verifyEmail as jest.Mock).mockResolvedValue({ isEmailChange: false, token: 'jwt', user: {} });
    const req = { query: { token: 'valid-token' } } as unknown as Request;
    const res = mockRes();
    await verifyEmail(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('resendVerification', () => {
  it('returns success message', async () => {
    (AuthService.resendVerification as jest.Mock).mockResolvedValue(undefined);
    const req = { body: { email: 'alice@example.com' } } as Request;
    const res = mockRes();
    await resendVerification(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Verification email sent' });
  });
});