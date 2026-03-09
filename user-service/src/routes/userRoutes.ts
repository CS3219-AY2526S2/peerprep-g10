import { Router } from 'express';
import { getProfile, getAllUsers, deleteUser, updateUserProfile, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// All routes here require a valid token
router.use(authenticateToken);

// Get current logged-in user's profile
router.get('/me', getProfile);

// View all users
router.get('/', authorizeRoles('admin'), getAllUsers);

// Delete a user account
router.delete('/:id', authorizeRoles('admin'), deleteUser);

// Update user profile
router.patch('/profile', updateUserProfile);

// update user password
router.patch('/changepassword', changePassword);

export default router;