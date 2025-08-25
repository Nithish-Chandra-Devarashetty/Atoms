import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, messageSchema } from '../middleware/validation.js';

const router = Router();

// All message routes require authentication
router.use(authenticateToken);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get messages between current user and another user
router.get('/:userId', getMessages);

// Send a message to another user
router.post('/:recipientId', validateRequest(messageSchema), sendMessage);

// Mark messages from a specific sender as read
router.put('/:senderId/read', markMessagesAsRead);

// Get unread message count
router.get('/unread/count', getUnreadCount);

// Delete a message
router.delete('/message/:messageId', deleteMessage);

export default router;