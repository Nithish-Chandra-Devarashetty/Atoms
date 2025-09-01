import { Router } from 'express';
import { generateAIQuiz } from '../controllers/aiQuizController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Generate a quiz using Groq LLaMA 3
router.post('/generate', authenticateToken, generateAIQuiz);

export default router;
