import { Router } from 'express';
import { 
  submitQuiz, 
  markVideoWatched, 
  getProgress, 
  getLeaderboard, 
  heartbeat 
} from '../controllers/progressController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest, quizSubmissionSchema } from '../middleware/validation.js';

const router = Router();

// Protected routes
router.post('/quiz', authenticateToken, validateRequest(quizSubmissionSchema), submitQuiz);
router.post('/video-watched', authenticateToken, markVideoWatched);
router.get('/me', authenticateToken, getProgress);
router.post('/heartbeat', authenticateToken, heartbeat);

// Public/Optional auth routes
router.get('/leaderboard', optionalAuth, getLeaderboard);

export default router;