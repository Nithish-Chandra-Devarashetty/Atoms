import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for the current user
router.get('/', authenticateToken, getNotifications);

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, markNotificationRead);

// Mark all notifications as read removed per request

// Clear all notifications (delete all)
router.delete('/clear-all', authenticateToken, clearAllNotifications);

// Delete notification
router.delete('/:notificationId', authenticateToken, deleteNotification);

export default router;
