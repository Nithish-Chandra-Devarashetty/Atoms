import { Router } from 'express';
import { register, login, getProfile, updateProfile, googleAuth } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validation.js';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/google', googleAuth);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);

export default router;