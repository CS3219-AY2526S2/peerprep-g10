import { Request, Response } from 'express';
import { BanService } from '../services/banService';
import { handleAppError } from '../errors/handleAppError';

// Service-to-service endpoint — allows other services to check ban status
export const checkBanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ message: 'userId query parameter is required' });
      return;
    }

    const banned = await BanService.isBanned(userId);
    res.json({ banned });
  } catch (error) {
    handleAppError(error, res, 'checkBanStatus', 'Error checking ban status');
  }
};