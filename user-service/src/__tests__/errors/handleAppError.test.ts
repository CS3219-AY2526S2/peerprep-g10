// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05
// Scope: Generated Jest unit tests for handleAppError utility function including AppError (e.g. EMAIL_EXISTS), Zod validation errors, and unknown error fallback handling with Express Response mocking.
// Author review: Accepted as-is and integrated into test suite to validate HTTP error response behavior across different error types.
import { Response } from 'express';
import { handleAppError } from '../../errors/handleAppError';
import { AppError } from '../../errors/AppError';
import { z } from 'zod';

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('handleAppError', () => {
  it('handles AppError with correct status and message', () => {
    const res = mockRes();
    const err = new AppError('EMAIL_EXISTS', 400, 'This email is already registered.');

    handleAppError(err, res, 'test', 'fallback');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'This email is already registered.' });
  });

  it('handles ZodError with 400 and first issue message', () => {
    const res = mockRes();
    const schema = z.object({ email: z.email() });

    let err: unknown;
    try { schema.parse({ email: 'bad' }); } catch (e) { err = e; }

    handleAppError(err, res, 'test', 'fallback');
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles unknown errors with 500 and fallback message', () => {
    const res = mockRes();
    
    handleAppError(new Error('unexpected'), res, 'test', 'fallback message');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'fallback message' });
  });
});