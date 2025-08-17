import { Router } from 'express';
import { 
  markProblemSolved, 
  unmarkProblemSolved, 
  getDSAProgress 
} from '../controllers/dsaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All DSA routes require authentication
router.post('/problem/solved', authenticateToken, markProblemSolved);
router.post('/problem/unsolved', authenticateToken, unmarkProblemSolved);
router.get('/progress', authenticateToken, getDSAProgress);

export default router;