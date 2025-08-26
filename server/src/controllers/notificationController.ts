import { Response } from 'express';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

// Socket.IO instance for real-time notifications
let io: any = null;
export const setSocketIO = (socketInstance: any) => {
  io = socketInstance;
};

// Get all notifications for the current user
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        hasMore: skip + notifications.length < totalNotifications
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark notification as read
export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipient: req.user._id 
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete notification
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear all notifications (delete all)
export const clearAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await Notification.deleteMany({ recipient: req.user._id });

    res.json({ 
      message: 'All notifications cleared', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to create notifications
export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: 'message' | 'discussion_reply' | 'discussion_like' | 'follow',
  title: string,
  message: string,
  data?: {
    discussionId?: string;
    messageId?: string;
    userId?: string;
  }
): Promise<void> => {
  try {
    // Don't create notification if sender and recipient are the same
    if (recipientId === senderId) {
      return;
    }

    const created = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      data
    });

    // Emit real-time notification to the recipient
    if (io) {
      // Build a minimal payload; clients can refetch if needed
      const payload = {
        _id: created._id.toString(),
        type,
        title,
        message,
        data: created.data,
        isRead: created.isRead,
        createdAt: created.createdAt,
        sender: { _id: senderId }
      };
      io.to(`user-${recipientId}`).emit('notification-created', payload);
    }
  } catch (error) {
    console.error('Create notification error:', error);
  }
};
