import { Router } from 'express';
import { 
  getUserProfile, 
  followUser, 
  getFollowers, 
  getFollowing,
  searchUsers
} from '../controllers/userController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes (with optional auth for user-specific data)
router.get('/search', optionalAuth, searchUsers);
router.get('/:userId', optionalAuth, getUserProfile);
router.get('/:userId/followers', optionalAuth, getFollowers);
router.get('/:userId/following', optionalAuth, getFollowing);

// Protected routes
router.post('/:userId/follow', authenticateToken, followUser);

export default router;