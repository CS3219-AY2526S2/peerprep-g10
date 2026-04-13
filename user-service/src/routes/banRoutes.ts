import { Router } from 'express';
import { checkBanStatus } from '../controllers/banController';
import { authenticateServiceToken } from '../middleware/authMiddleware';

const router = Router();

// Service-to-service: check if a user is banned
router.get('/check', authenticateServiceToken, checkBanStatus);

export default router;