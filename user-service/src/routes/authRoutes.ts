import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { registerUser, loginUser, verifyToken, verifyEmail, resendVerification } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

// Rate limiter — max 3 resend attempts per 15 minutes per IP
const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: 'Too many requests. Please try again later.' },
});

const router = Router();

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-token', authenticateToken ,verifyToken);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendLimiter, resendVerification);

export default router;