import { Response } from 'express';
import mongoose from 'mongoose';
import { Discussion, Reply } from '../models/Discussion.js';
import { POINTS } from '../utils/points.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from './notificationController.js';

// We'll import io dynamically to avoid circular imports
let io: any = null;
export const setSocketIO = (socketInstance: any) => {
  io = socketInstance;
};

export const getDiscussions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search, tags } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'displayName photoURL')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'displayName photoURL'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Discussion.countDocuments(query);

    res.json({
      discussions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDiscussion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📝 Create discussion request:', {
      user: req.user ? { id: req.user._id, name: req.user.displayName } : null,
      body: req.body,
      headers: req.headers.authorization ? 'Present' : 'Missing'
    });

    if (!req.user) {
      console.error('❌ User not authenticated');
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { content, tags = [] } = req.body;

    const discussion = new Discussion({
      author: req.user._id,
      content,
      tags
    });

    await discussion.save();
    await discussion.populate('author', 'displayName photoURL');

  // Award points for creating discussion
  req.user.totalPoints += POINTS.DISCUSSION_CREATED;
    await req.user.save();

    console.log('✅ Discussion created successfully:', discussion._id);

    // Emit WebSocket event for newly created discussion
    if (io) {
      io.emit('discussion-created', { discussion });
      console.log('📣 Emitted discussion-created event');
    }

    res.status(201).json({
      message: 'Discussion created successfully',
      discussion,
  pointsEarned: POINTS.DISCUSSION_CREATED
    });
  } catch (error) {
    console.error('❌ Create discussion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likeDiscussion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      res.status(404).json({ error: 'Discussion not found' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = discussion.likes.some(id => id.equals(userObjectId));
    
    if (isLiked) {
      discussion.likes = discussion.likes.filter(id => !id.equals(userObjectId));
    } else {
      discussion.likes.push(userObjectId);
    }

    await discussion.save();

    // Create notification if the discussion is liked (not unliked) and not by the author
    if (!isLiked && discussion.author.toString() !== req.user._id.toString()) {
      await createNotification(
        discussion.author.toString(),
        req.user._id.toString(),
        'discussion_like',
        'Discussion Liked',
        `${req.user.displayName} liked your discussion`,
        { discussionId: discussion._id.toString(), userId: req.user._id.toString() }
      );
    }

    // Emit WebSocket event to update likes in real time
    if (io) {
      io.to(`discussion-${discussionId}`).emit('discussion-like-updated', {
        discussionId: discussion._id.toString(),
        likes: discussion.likes.map((id) => id.toString()),
        likesCount: discussion.likes.length,
        // who performed the action and whether it's now liked (for optional client UX)
        actorId: req.user._id.toString(),
        liked: !isLiked
      });
      console.log(`📣 Emitted discussion-like-updated for discussion-${discussionId}`);
    }

    res.json({
      message: isLiked ? 'Discussion unliked' : 'Discussion liked',
      liked: !isLiked,
      likesCount: discussion.likes.length
    });
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { discussionId } = req.params;
    const { content } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      res.status(404).json({ error: 'Discussion not found' });
      return;
    }

    const reply = new Reply({
      discussionId,
      author: req.user._id,
      content
    });

    await reply.save();
    await reply.populate('author', 'displayName photoURL');

    // Add reply to discussion
    discussion.replies.push(new mongoose.Types.ObjectId(reply._id));
    await discussion.save();

  // Award points for replying
  req.user.totalPoints += POINTS.REPLY_CREATED;
    await req.user.save();

    // Create notification for the discussion author (if not replying to own discussion)
    if (discussion.author.toString() !== req.user._id.toString()) {
      await createNotification(
        discussion.author.toString(),
        req.user._id.toString(),
        'discussion_reply',
        'New Reply',
        `${req.user.displayName} replied to your discussion`,
        { discussionId: discussion._id.toString(), userId: req.user._id.toString() }
      );
    }

    // Emit WebSocket event for real-time discussion updates
    if (io) {
      io.to(`discussion-${discussionId}`).emit('discussion-reply-received', {
        discussionId,
        reply
      });
      console.log(`📨 Real-time reply sent to discussion-${discussionId}`);
    }

    res.status(201).json({
      message: 'Reply created successfully',
      reply,
  pointsEarned: POINTS.REPLY_CREATED
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDiscussion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId)
      .populate('author', 'displayName photoURL')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'displayName photoURL'
        },
        options: { sort: { createdAt: 1 } }
      });

    if (!discussion) {
      res.status(404).json({ error: 'Discussion not found' });
      return;
    }

    res.json({ discussion });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};