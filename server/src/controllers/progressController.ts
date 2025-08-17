import { Response } from 'express';
import { User } from '../models/User.js';
import { QuizAttempt, VideoProgress } from '../models/Progress.js';
import { AuthRequest } from '../middleware/auth.js';

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { subject, topic, score, totalQuestions, timeSpent, answers } = req.body;
    const userId = req.user._id;

    // Create quiz attempt record
    const quizAttempt = new QuizAttempt({
      userId,
      subject,
      topic,
      score,
      totalQuestions,
      timeSpent,
      answers
    });

    await quizAttempt.save();

    // Update user progress
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= 70;

    // Calculate points earned
    let pointsEarned = 0;
    if (passed) {
      pointsEarned = Math.floor(percentage * 10); // 70% = 700 points, 100% = 1000 points
      if (percentage === 100) pointsEarned += 200; // Bonus for perfect score
    }

    // Update progress based on subject type
    if (['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
      if (!user.progress.webdev[subject as keyof typeof user.progress.webdev]) {
        user.progress.webdev[subject as keyof typeof user.progress.webdev] = {
          videosWatched: 0,
          quizPassed: false
        };
      }
      user.progress.webdev[subject as keyof typeof user.progress.webdev].quizPassed = passed;
      user.progress.webdev[subject as keyof typeof user.progress.webdev].score = score;
    } else if (['os', 'dbms', 'cn'].includes(subject)) {
      if (topic && passed) {
        const coreSubject = user.progress.core[subject as keyof typeof user.progress.core];
        if (!coreSubject.topicsCompleted.includes(topic)) {
          coreSubject.topicsCompleted.push(topic);
          coreSubject.quizzesPassed += 1;
        }
      }
    } else if (subject === 'aptitude' && topic) {
      if (passed && !user.progress.aptitude.completedTopics.includes(topic)) {
        user.progress.aptitude.completedTopics.push(topic);
        user.progress.aptitude.scores.set(topic, score);
      }
    }

    // Add points and check for badges
    user.totalPoints += pointsEarned;
    
    // Award badges
    if (passed && !user.badges.includes(`${subject}-quiz-passed`)) {
      user.badges.push(`${subject}-quiz-passed`);
    }
    
    if (percentage === 100 && !user.badges.includes(`${subject}-perfect-score`)) {
      user.badges.push(`${subject}-perfect-score`);
    }

    await user.save();

    res.json({
      message: 'Quiz submitted successfully',
      score,
      percentage,
      passed,
      pointsEarned,
      totalPoints: user.totalPoints,
      newBadges: user.badges.filter(badge => 
        badge === `${subject}-quiz-passed` || badge === `${subject}-perfect-score`
      )
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markVideoWatched = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { subject, videoId, watchTime = 0 } = req.body;
    const userId = req.user._id;

    // Create or update video progress
    await VideoProgress.findOneAndUpdate(
      { userId, subject, videoId },
      { watchedAt: new Date(), watchTime },
      { upsert: true, new: true }
    );

    // Update user progress
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
      if (!user.progress.webdev[subject as keyof typeof user.progress.webdev]) {
        user.progress.webdev[subject as keyof typeof user.progress.webdev] = {
          videosWatched: 0,
          quizPassed: false
        };
      }
      user.progress.webdev[subject as keyof typeof user.progress.webdev].videosWatched += 1;
    }

    // Award points for watching videos
    user.totalPoints += 50;
    await user.save();

    res.json({
      message: 'Video marked as watched',
      pointsEarned: 50,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    console.error('Mark video watched error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('progress totalPoints badges streak');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get recent quiz attempts
    const recentQuizzes = await QuizAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('subject topic score totalQuestions createdAt');

    // Get video progress
    const videoProgress = await VideoProgress.find({ userId: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(20)
      .select('subject videoId watchedAt watchTime');

    res.json({
      progress: user.progress,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      recentQuizzes,
      videoProgress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { timeframe = 'all', category = 'overall', limit = 50 } = req.query;

    let dateFilter = {};
    if (timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { lastActiveDate: { $gte: weekAgo } };
    } else if (timeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { lastActiveDate: { $gte: monthAgo } };
    }

    const users = await User.find(dateFilter)
      .select('displayName photoURL totalPoints badges streak lastActiveDate')
      .sort({ totalPoints: -1 })
      .limit(Number(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.displayName,
      photoURL: user.photoURL,
      points: user.totalPoints,
      badges: user.badges.length,
      streak: user.streak,
      lastActive: user.lastActiveDate
    }));

    // Find current user's position if authenticated
    let userRank = null;
    if (req.user) {
      const userPosition = leaderboard.findIndex(entry => entry._id.toString() === req.user!._id);
      userRank = userPosition !== -1 ? userPosition + 1 : null;
    }

    res.json({
      leaderboard,
      userRank,
      timeframe,
      category
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};