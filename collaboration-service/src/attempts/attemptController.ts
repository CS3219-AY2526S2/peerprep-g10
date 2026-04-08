import { Request, Response } from 'express';
import { AttemptService } from './attemptService';

interface UserParams { userId: string; }
interface IdParams { id: string; }

export const AttemptController = {
  async saveAttempt(req: Request, res: Response) {
    try {
      const { roomId, userId, partnerId, questionId, code, startedAt, endedAt } = req.body;

      if (!roomId || !userId || !questionId || !startedAt || !endedAt) {
        return res.status(400).json({ error: 'roomId, userId, questionId, startedAt, endedAt are required' });
      }

      const attempt = await AttemptService.saveAttempt({
        roomId,
        userId,
        partnerId,
        questionId,
        code: code ?? '',
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
      });

      return res.status(201).json(attempt);
    } catch (err) {
      console.error('POST /attempts failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAttemptsByUser(req: Request<UserParams>, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      const attempts = await AttemptService.getAttemptsByUser(userId);
      return res.json(attempts);
    } catch (err) {
      console.error('GET /attempts/user/:userId failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAttemptById(req: Request<IdParams>, res: Response) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.getAttemptById(id);

      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      return res.json(attempt);
    } catch (err) {
      console.error('GET /attempts/:id failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAttemptedQuestionIds(req: Request<UserParams>, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      const questionIds = await AttemptService.getAttemptedQuestionIdsByUser(userId);
      return res.json({ userId, questionIds });
    } catch (err) {
      console.error('GET /attempts/user/:userId/questions failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};