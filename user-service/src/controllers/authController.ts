import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authServices';
import { UserService } from '../services/userServices';
import { registerSchema } from '../validator/userSchema';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    
    await AuthService.register(username, email, password);
    res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });

  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ message: "This email is already registered." });
    }
    if (error.message === "USERNAME_EXISTS") {
      return res.status(400).json({ message: "This username is already taken. Please choose another." });
    }
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Invalid input data";
      return res.status(400).json({ message });
    }
    
    console.error("REGISTRATION ERROR:", error);
    res.status(400).json({ error: error.errors || "Server Error" });
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
    if (error.message === "USER_BANNED") {
      return res.status(403).json({ message: "Your account has been banned." });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(401).json({ message: "This email is not registered. Please sign up first." });
    }
    if (error.message === "INVALID_PASSWORD") {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }
    if (error.message === 'EMAIL_NOT_VERIFIED') {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    console.error("DEBUG LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server Error during login" });
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
    res.status(500).json({ message: "Error verifying token" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };

    if (!token) return res.status(400).json({ message: 'Token is required' });

    const authData = await AuthService.verifyEmail(token);

    res.json({ message: 'Email verified successfully', ...authData });
  } catch (error: any) {
    if (error.message === 'INVALID_TOKEN') return res.status(400).json({ message: 'Invalid verification link' });
    if (error.message === 'TOKEN_EXPIRED') return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });

    res.status(500).json({ message: 'Error verifying email' });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.resendVerification(email);
    res.json({ message: 'Verification email sent' });
  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'Email not found' });
    if (error.message === 'ALREADY_VERIFIED') return res.status(400).json({ message: 'Email is already verified' });
    
    res.status(500).json({ message: 'Error sending verification email' });
  }
};