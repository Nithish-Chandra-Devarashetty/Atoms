import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.js';
import { Contest } from '../models/Contest.js';
import { ContestSubmission } from '../models/ContestSubmission.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

let io: any = null;
export const setSocketIO = (socketInstance: any) => { io = socketInstance; };

// Create a contest (simple admin-lite: require user and title)
export const createContest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startTime, durationMinutes, questions } = req.body;
    if (!title || !startTime || !durationMinutes || !Array.isArray(questions) || !questions.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const contest = await Contest.create({
      title,
      description,
      startTime: new Date(startTime),
      durationMinutes,
      questions,
  ...(req.user?._id ? { createdBy: new mongoose.Types.ObjectId(req.user._id) } : {})
    });

    // Broadcast a real-time notification to all connected users (public message)
    if (io) {
      io.emit('contest-created', {
        _id: String(contest._id),
        title: contest.title,
        startTime: contest.startTime,
        durationMinutes: contest.durationMinutes
      });
    }

    // Create notifications for all users (lightweight title-only)
    const users = await User.find({}, '_id').lean();
    if (users && users.length) {
      const adminSenderId = new mongoose.Types.ObjectId(process.env.ADMIN_SENDER_ID || '000000000000000000000000');
      const docs = users.map((u: any) => ({
        recipient: u._id,
        sender: adminSenderId,
        type: 'contest_created' as const,
        title: 'New Contest Scheduled',
        message: `${title} • ${new Date(startTime).toLocaleString()}`,
        data: {}
      }));
      try {
        const created = await Notification.insertMany(docs, { ordered: false });
        // Emit to each user
        if (io) {
          for (const n of created) {
            io.to(`user-${String(n.recipient)}`).emit('notification-created', {
              _id: String(n._id),
              type: n.type,
              title: n.title,
              message: n.message,
              data: n.data,
              isRead: n.isRead,
              createdAt: n.createdAt,
              sender: { _id: adminSenderId }
            });
          }
        }
      } catch (e) {
        console.warn('Contest notifications insert warning:', e);
      }
    }

    res.status(201).json({ contest });
  } catch (err) {
    console.error('Create contest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List contests (upcoming and recent past)
export const listContests = async (_req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const contests = await Contest.find({
      startTime: { $gte: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30) } // last 30d and future
    }).sort({ startTime: 1 }).lean();
    res.json({ contests });
  } catch (err) {
    console.error('List contests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contest details; hide correctIndex before end time
export const getContest = async (req: AuthRequest, res: Response) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    const endTime = new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60000);
    const hasEnded = new Date() > endTime;
    const questions = contest.questions.map((q: any) => ({
      text: q.text,
      options: q.options,
      ...(hasEnded ? { correctIndex: q.correctIndex } : {})
    }));
    res.json({
      contest: {
        _id: contest._id,
        title: contest.title,
        description: contest.description,
        startTime: contest.startTime,
        durationMinutes: contest.durationMinutes,
        questions
      },
      hasEnded,
      endTime
    });
  } catch (err) {
    console.error('Get contest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit answers (once per user)
export const submitContest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { contestId } = req.params;
    const { answers } = req.body as { answers: { questionIndex: number; selectedIndex: number }[] };
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    const start = new Date(contest.startTime).getTime();
    const end = start + contest.durationMinutes * 60000;
    const now = Date.now();
    if (now < start) return res.status(400).json({ error: 'Contest not started' });
    if (now > end) return res.status(400).json({ error: 'Contest ended' });

    // Prevent duplicate submissions
    const exists = await ContestSubmission.findOne({ contest: contest._id, user: req.user._id });
    if (exists) return res.status(400).json({ error: 'Already submitted' });

    // Evaluate
    const normalized = (answers || []).map(a => ({ ...a, questionIndex: Number(a.questionIndex), selectedIndex: Number(a.selectedIndex) }));
    let score = 0;
    const evalAnswers = contest.questions.map((q: any, idx: number) => {
      const chosen = normalized.find(a => a.questionIndex === idx);
      const selectedIndex = chosen ? chosen.selectedIndex : -1;
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) score += 1;
      return { questionIndex: idx, selectedIndex, isCorrect };
    });

    const total = contest.questions.length;
    const percentage = total ? (score / total) * 100 : 0;
    const submission = await ContestSubmission.create({
      contest: contest._id,
      user: req.user._id,
      answers: evalAnswers,
      score,
      total,
      percentage
    });

    res.status(201).json({ submission });
  } catch (err) {
    console.error('Submit contest error:', err);
    if ((err as any).code === 11000) {
      return res.status(400).json({ error: 'Already submitted' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Results after contest: percentile and leaderboard
export const getContestResults = async (req: AuthRequest, res: Response) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    const endTime = new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60000);
    const hasEnded = new Date() > endTime;
    if (!hasEnded) return res.status(400).json({ error: 'Results available after contest ends' });

    const subs = await ContestSubmission.find({ contest: contest._id })
      .populate('user', 'displayName photoURL')
      .sort({ score: -1, createdAt: 1 })
      .lean();
    const totalParticipants = subs.length;
    let my = null as any;
    if (req.user) {
      my = subs.find(s => s.user && (s.user as any)._id?.toString() === req.user!._id.toString()) || null;
    }

    let betterThanPercent = null as number | null;
    if (my) {
      const countLower = subs.filter(s => s.score <= my.score).length - 1; // those with <= including self, minus self
      const strictlyLower = subs.filter(s => s.score < my.score).length;
      // Define "better than" as strictly lower scores
      betterThanPercent = totalParticipants > 0 ? Math.round((strictlyLower / totalParticipants) * 100) : 0;
    }

    // Build leaderboard top 50
    const leaderboard = subs.slice(0, 50).map((s, i) => ({
      rank: i + 1,
      user: s.user,
      score: s.score,
      total: s.total,
      percentage: s.percentage
    }));

    res.json({
      contest: { _id: contest._id, title: contest.title, startTime: contest.startTime, durationMinutes: contest.durationMinutes },
      totalParticipants,
      leaderboard,
      my,
      betterThanPercent,
    });
  } catch (err) {
    console.error('Get contest results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get my submission with correctness for review
export const getMySubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    const endTime = new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60000);
    const hasEnded = new Date() > endTime;
    if (!hasEnded) return res.status(400).json({ error: 'Review available after contest ends' });

    const sub = await ContestSubmission.findOne({ contest: contest._id, user: req.user._id }).lean();
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    // Provide questions with correctIndex for review
    const questions = contest.questions.map((q: any) => ({ text: q.text, options: q.options, correctIndex: q.correctIndex }));
    res.json({ submission: sub, questions });
  } catch (err) {
    console.error('Get my submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List contests the current user has participated in (by submission)
export const getParticipatedContests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const submissions = await ContestSubmission.find({ user: req.user._id }).select('contest score total percentage createdAt').lean();
    const contestIds = Array.from(new Set(submissions.map(s => String(s.contest))));
    if (!contestIds.length) return res.json({ contests: [] });
    const contests = await Contest.find({ _id: { $in: contestIds } })
      .select('title description startTime durationMinutes')
      .sort({ startTime: -1 })
      .lean();
    const subByContest: Record<string, any> = {};
    for (const s of submissions) subByContest[String(s.contest)] = s;
    const now = Date.now();
    const result = contests.map(c => {
      const start = new Date(c.startTime).getTime();
      const end = start + c.durationMinutes * 60000;
      const phase = now < start ? 'upcoming' : (now <= end ? 'live' : 'ended');
      return {
        _id: String(c._id),
        title: c.title,
        description: c.description,
        startTime: c.startTime,
        durationMinutes: c.durationMinutes,
        phase,
        submission: subByContest[String(c._id)] ? {
          score: subByContest[String(c._id)].score,
          total: subByContest[String(c._id)].total,
          percentage: subByContest[String(c._id)].percentage,
          submittedAt: subByContest[String(c._id)].createdAt
        } : null
      };
    });
    res.json({ contests: result });
  } catch (err) {
    console.error('Get participated contests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
