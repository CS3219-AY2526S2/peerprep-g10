import { Router } from 'express';
import { getProfile, getAllUsers, deleteUser, updateUserProfile, updatePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// All routes here require a valid token (always add)
router.use(authenticateToken);

// Get current logged-in user's profile
router.get('/me', getProfile);

// View all users (only admin can access)
router.get('/', authorizeRoles('admin'), getAllUsers);

// Delete a user account (only admin can access)
router.delete('/:id', authorizeRoles('admin'), deleteUser);

// Update user profile
router.patch('/update-profile', updateUserProfile);

// update user password
router.patch('/change-password', updatePassword);

export default router;