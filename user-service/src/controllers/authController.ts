import { Request, Response } from 'express';
import isEmail from 'validator/lib/isEmail';
import { z } from 'zod';
import {register, login} from '../services/authServices';

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email()
    .refine((val) => isEmail(val), { 
        message: "Invalid email format. Please follow RFC5322 standards."
    }),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[a-z]/, "Passowrd needs a lowercase letter")
    .regex(/[0-9]/, "Password needs a number")
    .regex(/[^A-Za-z0-9]/, "Password needs a special character"),
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    
    await register(username, email, password);
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(400).json({ message: "This email is already registered." });
    }
    if (error.message === "USERNAME_EXISTS") {
      return res.status(400).json({ message: "This username is already taken. Please choose another." });
    }
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "Inalid input data";
      return res.status(400).json({ message });
    }
    
    console.error("REGISTRATION ERROR:", error);
    res.status(400).json({ error: error.errors || "Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const authData = await login(email, password);
    
    res.status(200).json({ 
      message: "Login successful", 
      ...authData 
    });

  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(401).json({ message: "This email is not registered. Please sign up first." });
    }
    if (error.message === "INVALID_PASSWORD") {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }
    res.status(500).json({ message: "Server Error during login" });
  }
};