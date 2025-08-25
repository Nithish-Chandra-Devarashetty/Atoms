import { Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from './notificationController.js';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('displayName photoURL totalPoints badges streak createdAt followers following')
      .populate('followers', 'displayName photoURL')
      .populate('following', 'displayName photoURL');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if current user is following this user
    const isFollowing = req.user ? user.followers.some(follower => 
      follower._id.toString() === req.user!._id.toString()
    ) : false;

    res.json({
      user: {
        ...user.toObject(),
        isFollowing,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({ error: 'Current user not found' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isAlreadyFollowing = currentUser.following.some(id => id.equals(userObjectId));
    
    if (isAlreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => !id.equals(userObjectId));
      userToFollow.followers = userToFollow.followers.filter(id => !id.equals(currentUserId));
    } else {
      // Follow
      currentUser.following.push(userObjectId);
      userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));
    }

    await Promise.all([currentUser.save(), userToFollow.save()]);

    // Create notification when following (not unfollowing)
    if (!isAlreadyFollowing) {
      await createNotification(
        userId,
        req.user._id.toString(),
        'follow',
        'New Follower',
        `${req.user.displayName} started following you`,
        { userId: req.user._id.toString() }
      );
    }

    res.json({
      message: isAlreadyFollowing ? 'User unfollowed successfully' : 'User followed successfully',
      isFollowing: !isAlreadyFollowing,
      followersCount: userToFollow.followers.length
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('followers', 'displayName photoURL totalPoints')
      .select('followers');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .populate('following', 'displayName photoURL totalPoints')
      .select('following');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const users = await User.find({
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('displayName photoURL totalPoints badges')
    .skip(skip)
    .limit(Number(limit));

    const total = await User.countDocuments({
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};