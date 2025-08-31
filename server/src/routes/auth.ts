import { Router, Request, Response } from 'express';
import { register, login, getProfile, updateProfile, googleAuth, debugStreak } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validation.js';
import { User } from '../models/User.js';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/google', googleAuth);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);
// Debug streak route uses authenticated user from token
router.get('/debug-streak', authenticateToken, debugStreak);

// Temporary debug endpoint to check current user streak status
router.get('/debug-current-user', async (req: Request, res: Response) => {
  try {
    // Get the most recent user (assuming you're testing with your account)
    const user = await User.findOne().sort({ lastLogin: -1 });
    if (!user) {
      return res.json({ error: 'No user found' });
    }

    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

  const debugInfo = {
      user: {
    displayName: user.displayName,
        email: user.email,
        streak: user.streak,
        lastLogin: lastLogin ? lastLogin.toISOString() : null,
        lastActiveDate: lastActive ? lastActive.toISOString() : null,
      },
      currentTime: now.toISOString(),
      daysSinceLastLogin: lastLogin ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : null,
      daysSinceLastActive: lastActive ? Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)) : null,
    };

    res.json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;