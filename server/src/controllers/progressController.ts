import { Response } from 'express';
import { User } from '../models/User.js';
import { QuizAttempt, VideoProgress } from '../models/Progress.js';
import { ActiveTime } from '../models/ActiveTime.js';
import { AuthRequest } from '../middleware/auth.js';
import { checkBadgeEligibility } from '../utils/points.js';

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { subject, topic, score, totalQuestions, timeSpent, answers } = req.body;
    const userId = req.user._id;

    // Prepare quiz attempt (we'll save after computing points to avoid counting this attempt as prior)
    const quizAttempt = new QuizAttempt({
      userId,
      subject,
      topic,
      score,
      totalQuestions,
      timeSpent,
      answers
    });

    // Update user progress
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 70;
  let pointsEarned = 0;

    // Update progress based on subject type
    if (['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
      if (!user.progress.webdev[subject as keyof typeof user.progress.webdev]) {
        user.progress.webdev[subject as keyof typeof user.progress.webdev] = {
          videosWatched: 0,
          quizPassed: false
        } as any;
      }
      // Record last score
      user.progress.webdev[subject as keyof typeof user.progress.webdev].score = score as any;
      // Award points: +10 only on first time passing for this subject/topic
      if (passed) {
        const priorQuery: any = { userId, subject, $expr: { $gte: [ { $divide: ["$score", "$totalQuestions"] }, 0.7 ] } };
        if (topic) {
          priorQuery.topic = topic;
        } else {
          priorQuery.$or = [{ topic: { $exists: false } }, { topic: null }];
        }
        const priorPassed = await QuizAttempt.exists(priorQuery);
        if (!priorPassed) pointsEarned += 10;
        // For single-quiz subjects, mark quizPassed true
        if (!topic) {
          (user.progress.webdev as any)[subject].quizPassed = true;
        }
      }
    } else if (['os', 'dbms', 'cn'].includes(subject)) {
      if (topic && passed) {
        const coreSubject = user.progress.core[subject as keyof typeof user.progress.core];
        if (!coreSubject.topicsCompleted.includes(topic)) {
          coreSubject.topicsCompleted.push(topic);
          coreSubject.quizzesPassed += 1;
          pointsEarned += 10; // +10 per topic quiz passed
        }
      }
    } else if (subject === 'aptitude' && topic) {
      // No minimum score threshold for aptitude: completing the quiz marks the topic as completed
      if (!user.progress.aptitude.completedTopics.includes(topic)) {
        user.progress.aptitude.completedTopics.push(topic);
        pointsEarned += 30; // +30 per aptitude topic (only first time)
      }
      // Always store/overwrite the latest score by topic
      (user.progress.aptitude as any).scores = (user.progress.aptitude as any).scores || {};
      (user.progress.aptitude as any).scores[topic] = score;
    }

    // Add points
    user.totalPoints += pointsEarned;
    
    // Check for badges
    const newBadges: string[] = [];

    // First quiz badge (only when passed)
    if (passed) {
      const badgeResult = checkBadgeEligibility(user, 'quiz_passed', { 
        subject, 
        topic, 
        percentage, 
        passed 
      });
      newBadges.push(...badgeResult);
      
      // Check for module completion badges (WebDev)
      if (['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
        const moduleProgress = user.progress.webdev[subject as keyof typeof user.progress.webdev];
        // Check if module is fully completed (11+ videos + quiz passed)
        if (moduleProgress.videosWatched >= 11 && moduleProgress.quizPassed) {
          const moduleCompletionBadges = checkBadgeEligibility(user, 'webdev_module_completed', { 
            module: subject 
          });
          newBadges.push(...moduleCompletionBadges);
        }
      }
      
      // Check for core subject completion
      if (['os', 'dbms', 'cn'].includes(subject)) {
        const coreSubject = user.progress.core[subject as keyof typeof user.progress.core];
        // Check if subject is completed (enough topics and quizzes)
        if (coreSubject.topicsCompleted.length >= 10 && coreSubject.quizzesPassed >= 5) {
          const coreCompletionBadges = checkBadgeEligibility(user, 'core_subject_completed', { 
            subject 
          });
          newBadges.push(...coreCompletionBadges);
        }
      }
    }

    // Check for aptitude completion (not gated by pass threshold)
    if (subject === 'aptitude') {
      const aptitudeCompletionBadges = checkBadgeEligibility(user, 'aptitude_completed', { 
        totalTopics: 50 // Adjust this number based on your actual aptitude topics count
      });
      newBadges.push(...aptitudeCompletionBadges);
    }
    
    // Add new badges to user
    newBadges.forEach(badge => {
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
      }
    });

  await user.save();
  // Now persist the quiz attempt record
  await quizAttempt.save();

    res.json({
      message: 'Quiz submitted successfully',
      score,
      percentage,
      passed,
      pointsEarned,
      totalPoints: user.totalPoints,
      newBadges: newBadges
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
    const existing = await VideoProgress.findOne({ userId, subject, videoId });
    if (!existing) {
      try {
        await new VideoProgress({ userId, subject, videoId, watchedAt: new Date(), watchTime }).save();
      } catch (e) {
        // Unique index race: another request created it; treat as existing
      }
    } else {
      // Update watch time and timestamp, but no points if already watched before
      existing.watchTime = watchTime;
      existing.watchedAt = new Date();
      await existing.save();
    }

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
      // Increment only if first time watching this video
      if (!existing) {
        user.progress.webdev[subject as keyof typeof user.progress.webdev].videosWatched += 1 as any;
      }
    }

    // Award points for watching videos: +10 only if first time
    if (!existing) {
      user.totalPoints += 10;
    }
    
    // Check for module completion badges after video progress update
    const newBadges: string[] = [];
    if (['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'].includes(subject)) {
      const moduleProgress = user.progress.webdev[subject as keyof typeof user.progress.webdev];
      // Check if module is fully completed (11+ videos + quiz passed)
      if (moduleProgress.videosWatched >= 11 && moduleProgress.quizPassed) {
        const moduleCompletionBadges = checkBadgeEligibility(user, 'webdev_module_completed', { 
          module: subject 
        });
        newBadges.forEach(badge => {
          if (!user.badges.includes(badge)) {
            user.badges.push(badge);
          }
        });
      }
    }
    
    await user.save();

    res.json({
      message: 'Video marked as watched',
      pointsEarned: existing ? 0 : 10,
      totalPoints: user.totalPoints,
      newBadges: newBadges
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

    // Get video progress (recent list for UI)
    const videoProgress = await VideoProgress.find({ userId: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(20)
      .select('subject videoId watchedAt watchTime');

  // Aggregate overall performance metrics
  const allAttempts = await QuizAttempt.find({ userId: req.user._id }).select('score totalQuestions timeSpent subject');
    const quizzesAttempted = allAttempts.length;
    const totalQuizTime = allAttempts.reduce((acc, a: any) => acc + (a.timeSpent || 0), 0);
    const averageQuizPercent = quizzesAttempted
      ? Math.round(
      allAttempts.reduce((acc, a: any) => acc + (a.totalQuestions > 0 ? (a.score / a.totalQuestions) * 100 : 0), 0) /
            quizzesAttempted
        )
      : 0;

    // Aptitude-specific accuracy across all attempts
    const aptitudeAttempts = allAttempts.filter((a: any) => a.subject === 'aptitude');
    const aptitudeCorrect = aptitudeAttempts.reduce((acc: number, a: any) => acc + (a.score || 0), 0);
    const aptitudeTotalQuestions = aptitudeAttempts.reduce((acc: number, a: any) => acc + (a.totalQuestions || 0), 0);
    const aptitudeAccuracyPercent = aptitudeTotalQuestions
  ? Math.round((aptitudeCorrect / aptitudeTotalQuestions) * 100)
  : 0;

    const allVideoProgress = await VideoProgress.find({ userId: req.user._id }).select('watchTime');
    const totalVideoTime = allVideoProgress.reduce((acc, v: any) => acc + (v.watchTime || 0), 0);
    // Site-wide active time (all pages), aggregated from ActiveTime
    const activeAgg = await ActiveTime.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$seconds' } } }
    ]);
    const totalActiveSeconds = activeAgg[0]?.total || 0;

    const totalTimeSpentSeconds = totalActiveSeconds; // per requirement, site-wide time only

    // Aggregate passed quizzes by subject/topic for webdev
    const allWebdevPassed = await QuizAttempt.find({ userId: req.user._id, subject: { $in: ['html','css','javascript','react','nodejs','mongodb'] } })
      .select('subject topic score totalQuestions');

    const passedQuizzesBySubject: Record<string, string[]> = {};
    for (const attempt of allWebdevPassed) {
      const subj = (attempt as any).subject as string;
      const totalQ = (attempt as any).totalQuestions || 0;
      const score = (attempt as any).score || 0;
      const passed = totalQ > 0 && (score / totalQ) >= 0.5;
      const topic = (attempt as any).topic || 'default';
      if (passed) {
        if (!passedQuizzesBySubject[subj]) passedQuizzesBySubject[subj] = [];
        if (!passedQuizzesBySubject[subj].includes(topic)) {
          passedQuizzesBySubject[subj].push(topic);
        }
      }
    }

    // Compute global rank by totalPoints
    const [totalUsers, usersWithMorePoints] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ totalPoints: { $gt: user.totalPoints } })
    ]);
    const rank = usersWithMorePoints + 1;

    res.json({
      progress: user.progress,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      rank,
      totalUsers,
      recentQuizzes,
      videoProgress,
  passedQuizzesBySubject,
  // Performance metrics
  quizzesAttempted,
  averageQuizPercent,
  totalTimeSpentSeconds,
  // Aptitude metrics
  aptitudeCorrect,
  aptitudeTotalQuestions,
  aptitudeAccuracyPercent
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Heartbeat to record active time on the site.
// Client should call this periodically (e.g., every 30-60s) only when the tab is active and user is authenticated.
export const heartbeat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // clamp seconds between 0 and 120 to avoid abuse; default to 30s
    const secondsRaw = Number(req.body?.seconds ?? 30);
    const seconds = Math.max(0, Math.min(120, Math.floor(secondsRaw)));

    // Use UTC day bucket
    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    await ActiveTime.updateOne(
      { userId: req.user._id, day },
      { $inc: { seconds }, $setOnInsert: { userId: req.user._id, day } },
      { upsert: true }
    );

    // Update lastActiveDate for leaderboard filters
    await User.updateOne({ _id: req.user._id }, { $set: { lastActiveDate: new Date() } });

    res.json({ ok: true, added: seconds });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { timeframe = 'all', category = 'overall', limit = 100 } = req.query;

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

    // Get total user count for rank calculation
    const totalUsers = await User.countDocuments(dateFilter);

    // Get top users for leaderboard display
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

    // Find current user's position out of ALL users (not just top 100)
    let userRank = null;
    if (req.user) {
      // Count how many users have more points than current user
      const usersWithMorePoints = await User.countDocuments({
        ...dateFilter,
        totalPoints: { $gt: req.user.totalPoints }
      });
      userRank = usersWithMorePoints + 1;
    }

    res.json({
      leaderboard,
      userRank,
      totalUsers,
      timeframe,
      category
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};