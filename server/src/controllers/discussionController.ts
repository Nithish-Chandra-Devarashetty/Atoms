import { Response } from 'express';
import { Discussion, Reply } from '../models/Discussion.js';
import { AuthRequest } from '../middleware/auth.js';

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
    if (!req.user) {
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
    req.user.totalPoints += 25;
    await req.user.save();

    res.status(201).json({
      message: 'Discussion created successfully',
      discussion,
      pointsEarned: 25
    });
  } catch (error) {
    console.error('Create discussion error:', error);
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

    const isLiked = discussion.likes.includes(userId);
    
    if (isLiked) {
      discussion.likes = discussion.likes.filter(id => !id.equals(userId));
    } else {
      discussion.likes.push(userId);
    }

    await discussion.save();

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
    discussion.replies.push(reply._id);
    await discussion.save();

    // Award points for replying
    req.user.totalPoints += 15;
    await req.user.save();

    res.status(201).json({
      message: 'Reply created successfully',
      reply,
      pointsEarned: 15
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