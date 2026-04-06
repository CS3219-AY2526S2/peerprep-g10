import { Request, Response } from 'express';
import { AuthService } from '../services/authServices';
import { UserService } from '../services/userServices';
import { registerSchema } from '../validator/userSchema';
import { handleAppError } from '../errors/handleAppError';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    
    await AuthService.register(username, email, password);
    res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });

  } catch (error: any) {
    handleAppError(error, res, 'registerUser', 'Error registering user');
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authData = await AuthService.login(email, password);
    
    res.status(200).json({ 
      message: "Login successful", 
      ...authData 
    });
  } catch (error: any) {
    handleAppError(error, res, 'loginUser', 'Error logging in');
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    handleAppError(error, res, 'verifyToken', 'Error verifying token');
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };

    if (!token) return res.status(400).json({ message: 'Token is required' });

    const result = await AuthService.verifyEmail(token);

    res.json({
      message: result.isEmailChange
        ? 'Email updated successfully'
        : 'Email verified successfully',
      ...result,
    });
  } catch (error: any) {
    handleAppError(error, res, 'verifyEmail', 'Error verifying email');
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.resendVerification(email);
    res.json({ message: 'Verification email sent' });
  } catch (error: any) {
    handleAppError(error, res, 'resendVerification', 'Error sending verification email');
  }
};