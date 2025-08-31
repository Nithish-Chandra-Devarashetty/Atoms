import { Router } from 'express';
import { authenticateToken, optionalAuth, authenticateAdmin } from '../middleware/auth.js';
import { createContest, listContests, getContest, submitContest, getContestResults, getMySubmission, getParticipatedContests } from '../controllers/contestController.js';

const router = Router();

// Public list
router.get('/', optionalAuth, listContests);
// Public contest details (answers hidden until end)
router.get('/:contestId', optionalAuth, getContest);
// Submit during contest
router.post('/:contestId/submit', authenticateToken, submitContest);
// Results and leaderboard after contest
router.get('/:contestId/results', optionalAuth, getContestResults);
// My review (answers + correctness) after contest
router.get('/:contestId/my-submission', authenticateToken, getMySubmission);

// Contests I participated
router.get('/me/participated', authenticateToken, getParticipatedContests);

// Create contest (for now, any authenticated user; could restrict later)
router.post('/', authenticateAdmin, createContest);

export default router;
