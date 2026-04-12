import { Router } from 'express';
import { AttemptController } from './attemptController';
import { authenticateToken, authenticateServiceToken } from '../middleware/authMiddleware';

const router = Router();

// Service-to-service — called by question-service to exclude already-attempted questions
router.get('/user/:userId/questions', authenticateServiceToken, AttemptController.getAttemptedQuestionIds);

router.post('/', AttemptController.saveAttempt);

// User-facing reads — require JWT + ban check
router.get('/user/:userId', authenticateToken, AttemptController.getAttemptsByUser);
router.get('/:id', authenticateToken, AttemptController.getAttemptById);

export default router;