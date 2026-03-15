import { Router } from 'express';
import { registerUser, loginUser, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-token', authenticateToken ,verifyToken);

export default router;