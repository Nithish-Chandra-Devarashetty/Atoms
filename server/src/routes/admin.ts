import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/admin/login
// Body: { username: string, password: string }
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    res.status(401).json({ error: 'Invalid admin credentials' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: 'JWT secret not configured' });
    return;
  }

  // Issue short-lived admin token
  const token = jwt.sign({ admin: true }, jwtSecret, { expiresIn: '2h' });
  res.json({ message: 'Admin login successful', token });
});

export default router;