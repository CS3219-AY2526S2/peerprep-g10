import { Response } from 'express';
import { z } from 'zod';
import { AppError } from './AppError';

export function handleAppError(error: unknown, res: Response, context: string, fallbackMessage: string): void {
  // Known application errors — use their built-in status and message
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  // Zod validation errors
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }

  // Unexpected errors — log and return a generic message
  console.error(`[${context}]`, error);
  res.status(500).json({ message: fallbackMessage });
}