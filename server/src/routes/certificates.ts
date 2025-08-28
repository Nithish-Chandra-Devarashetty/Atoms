import { Router } from 'express';
import { 
  generateWebDevCertificate,
  getUserCertificates,
  verifyCertificate,
  checkWebDevEligibility,
  getSignedCertificateUrl,
  downloadWebDevCertificate
} from '../controllers/certificateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Protected routes
router.post('/webdev/generate', authenticateToken, generateWebDevCertificate);
router.get('/user', authenticateToken, getUserCertificates);
router.get('/webdev/eligibility', authenticateToken, checkWebDevEligibility);
router.get('/webdev/signed-url', authenticateToken, getSignedCertificateUrl);
router.get('/webdev/download', authenticateToken, downloadWebDevCertificate);

// Public route for verification
router.get('/verify/:certificateId', verifyCertificate);

export default router;
