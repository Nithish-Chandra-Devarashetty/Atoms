import { Router } from 'express';
import { 
  getDiscussions, 
  createDiscussion, 
  likeDiscussion, 
  createReply,
  getDiscussion
} from '../controllers/discussionController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest, discussionSchema, replySchema } from '../middleware/validation.js';

const router = Router();

// Public routes (with optional auth for user-specific data)
router.get('/', optionalAuth, getDiscussions);
router.get('/:discussionId', optionalAuth, getDiscussion);

// Protected routes
router.post('/', authenticateToken, validateRequest(discussionSchema), createDiscussion);
router.post('/:discussionId/like', authenticateToken, likeDiscussion);
router.post('/:discussionId/reply', authenticateToken, validateRequest(replySchema), createReply);

export default router;