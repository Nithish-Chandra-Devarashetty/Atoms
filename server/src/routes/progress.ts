import { Router } from 'express';
import { 
  submitQuiz, 
  markVideoWatched, 
  getProgress, 
  getLeaderboard 
} from '../controllers/progressController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest, quizSubmissionSchema } from '../middleware/validation.js';

const router = Router();

// Protected routes
router.post('/quiz', authenticateToken, validateRequest(quizSubmissionSchema), submitQuiz);
router.post('/video-watched', authenticateToken, markVideoWatched);
router.get('/me', authenticateToken, getProgress);

// Public/Optional auth routes
router.get('/leaderboard', optionalAuth, getLeaderboard);

export default router;