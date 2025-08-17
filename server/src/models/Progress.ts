import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic?: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  createdAt: Date;
}

export interface IVideoProgress extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  videoId: string;
  watchedAt: Date;
  watchTime: number; // in seconds
}

const quizAttemptSchema = new Schema<IQuizAttempt>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  answers: [{
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true }
  }]
}, {
  timestamps: true
});

const videoProgressSchema = new Schema<IVideoProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  watchTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
quizAttemptSchema.index({ userId: 1, subject: 1, createdAt: -1 });
videoProgressSchema.index({ userId: 1, subject: 1, videoId: 1 }, { unique: true });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
export const VideoProgress = mongoose.model<IVideoProgress>('VideoProgress', videoProgressSchema);