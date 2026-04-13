export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  // Auth
  EMAIL_EXISTS: new AppError('EMAIL_EXISTS', 400, 'This email is already registered.'),
  USERNAME_EXISTS: new AppError('USERNAME_EXISTS', 400, 'This username is already taken.'),
  USER_NOT_FOUND: new AppError('USER_NOT_FOUND', 401, 'This email is not registered. Please sign up first.'),
  USER_BANNED: new AppError('USER_BANNED', 403, 'Your account has been banned.'),
  EMAIL_NOT_VERIFIED: new AppError('EMAIL_NOT_VERIFIED', 403, 'Please verify your email before logging in.'),
  INVALID_PASSWORD: new AppError('INVALID_PASSWORD', 401, 'Incorrect password. Please try again.'),
  ALREADY_VERIFIED: new AppError('ALREADY_VERIFIED', 400, 'This email is already verified.'),

  // Tokens
  INVALID_TOKEN: new AppError('INVALID_TOKEN', 400, 'Invalid verification link.'),
  TOKEN_EXPIRED: new AppError('TOKEN_EXPIRED', 400, 'Verification link has expired. Please request a new one.'),

  // Users
  SELF_DELETE: new AppError('SELF_DELETE', 400, 'You cannot perform this action on your own account.'),
  LAST_ADMIN: new AppError('LAST_ADMIN', 400, 'Cannot delete the last admin account.'),
  CANNOT_BAN_ADMIN: new AppError('CANNOT_BAN_ADMIN', 403, 'Cannot ban an admin account.'),
  USER_DB_NOT_FOUND: new AppError('USER_DB_NOT_FOUND', 404, 'User not found.'),

  // Profile
  INCORRECT_PASSWORD: new AppError('INCORRECT_PASSWORD', 401, 'Incorrect password.'),
} as const;