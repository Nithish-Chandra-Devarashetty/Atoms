import { Response } from 'express';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { POINTS } from '../utils/points.js';

export const markProblemSolved = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

  const { problemName, topic, difficulty } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if problem is already solved
    const isAlreadySolved = user.progress.dsa.solvedProblems.includes(problemName);
    
    if (!isAlreadySolved) {
      user.progress.dsa.solvedProblems.push(problemName);
      
  // Update topic progress (store as plain object counter)
  const dsaProg: any = user.progress.dsa as any;
  if (!dsaProg.topicProgress) dsaProg.topicProgress = {};
  const currentProgress = dsaProg.topicProgress[topic] || 0;
  dsaProg.topicProgress[topic] = currentProgress + 1;

  // New points rule: flat +2 points per unique problem solved
  let pointsEarned = POINTS.DSA_PROBLEM_SOLVED;

      user.totalPoints += pointsEarned;

      // Check for badges
  const topicSolved = (user.progress.dsa as any).topicProgress?.[topic] || 0;
      if (topicSolved === 1 && !user.badges.includes(`${topic}-first-solve`)) {
        user.badges.push(`${topic}-first-solve`);
      }

      await user.save();

      res.json({
        message: 'Problem marked as solved',
        pointsEarned,
        totalPoints: user.totalPoints,
        topicProgress: topicSolved
      });
    } else {
      res.json({
        message: 'Problem already solved',
        pointsEarned: 0,
        totalPoints: user.totalPoints
      });
    }
  } catch (error) {
    console.error('Mark problem solved error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unmarkProblemSolved = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { problemName, topic } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove problem from solved list
    user.progress.dsa.solvedProblems = user.progress.dsa.solvedProblems.filter(
      name => name !== problemName
    );

    // Update topic progress
    const dsaProg: any = user.progress.dsa as any;
    if (!dsaProg.topicProgress) dsaProg.topicProgress = {};
    const currentProgress = dsaProg.topicProgress[topic] || 0;
    if (currentProgress > 0) {
      dsaProg.topicProgress[topic] = currentProgress - 1;
    }

    await user.save();

    res.json({
      message: 'Problem unmarked as solved',
  topicProgress: (user.progress.dsa as any).topicProgress?.[topic] || 0
    });
  } catch (error) {
    console.error('Unmark problem solved error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDSAProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('progress.dsa totalPoints badges');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      dsaProgress: user.progress.dsa,
      totalPoints: user.totalPoints,
      badges: user.badges.filter(badge => badge.includes('dsa') || badge.includes('solve'))
    });
  } catch (error) {
    console.error('Get DSA progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};