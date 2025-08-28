import { Router } from 'express';
import { getBadgeMetadata } from '../controllers/badgeController.js';

const router = Router();

// Public route to get badge metadata for UI
router.get('/metadata', getBadgeMetadata);

export default router;
