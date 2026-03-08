import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;