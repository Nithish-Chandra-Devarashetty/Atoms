import { Response } from 'express';
import mongoose from 'mongoose';
import { Message, Conversation } from '../models/Message.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from './notificationController.js';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'displayName photoURL')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
    .populate('sender', 'displayName photoURL')
    .populate('recipient', 'displayName photoURL')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { recipientId } = req.params;
    const { content } = req.body;

    if (recipientId === req.user._id.toString()) {
      res.status(400).json({ error: 'Cannot send message to yourself' });
      return;
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({ error: 'Recipient not found' });
      return;
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    await message.save();
    await message.populate('sender', 'displayName photoURL');
    await message.populate('recipient', 'displayName photoURL');

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, recipientId],
        lastMessage: new mongoose.Types.ObjectId(message._id),
        lastActivity: new Date()
      });
    } else {
      conversation.lastMessage = new mongoose.Types.ObjectId(message._id);
      conversation.lastActivity = new Date();
    }

    await conversation.save();

    // Create notification for the recipient
    await createNotification(
      recipientId,
      req.user._id.toString(),
      'message',
      'New Message',
      `${req.user.displayName} sent you a message`,
      { messageId: message._id.toString(), userId: req.user._id.toString() }
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { senderId } = req.params;

    await Message.updateMany(
      { sender: senderId, recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const unreadCount = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    // Only sender can delete their message
    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Not authorized to delete this message' });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};