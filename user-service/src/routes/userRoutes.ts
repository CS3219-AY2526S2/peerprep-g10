import { Router } from 'express';
import { getProfile, getAllUsers, deleteUser, updateUserProfile, updatePassword, updateProfileIcon, getAvatarOptions, createAdmin, banUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Public
router.get('/avatars', getAvatarOptions);

// Protected
router.use(authenticateToken);
router.get('/me', getProfile);
router.patch('/me/icon', updateProfileIcon);
router.patch('/update-profile', updateUserProfile);
router.patch('/change-password', updatePassword);

// Admin only
router.get('/all-users', authorizeRoles('admin'), getAllUsers);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
router.patch('/:id/ban', authorizeRoles('admin'), banUser);
router.post('/create-admin', authorizeRoles('admin'), createAdmin);

export default router;