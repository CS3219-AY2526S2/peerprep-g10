import { Router } from 'express';
import { getProfile, getAllUsers, deleteUser, updateUserProfile, updatePassword, updateProfileIcon, getAvatarOptions, createAdmin, banUser, getProfilesForService } from '../controllers/userController';
import { authenticateToken, authenticateServiceToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Public
router.get('/avatars', getAvatarOptions);

// Service-to-service
router.post('/services/profiles', authenticateServiceToken, getProfilesForService);

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