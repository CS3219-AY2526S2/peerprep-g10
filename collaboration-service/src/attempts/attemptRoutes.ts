import { Router } from 'express';
import { AttemptController } from './attemptController';

const router = Router();

router.post('/', AttemptController.saveAttempt);
router.get('/user/:userId/questions', AttemptController.getAttemptedQuestionIds); 
router.get('/user/:userId', AttemptController.getAttemptsByUser);
router.get('/:id', AttemptController.getAttemptById);

export default router;