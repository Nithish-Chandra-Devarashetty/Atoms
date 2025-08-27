import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google';
  providerId?: string;
  googleId?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Learning progress
  progress: {
    webdev: {
      html: { videosWatched: number; quizPassed: boolean; score?: number };
      css: { videosWatched: number; quizPassed: boolean; score?: number };
      javascript: { videosWatched: number; quizPassed: boolean; score?: number };
      react: { videosWatched: number; quizPassed: boolean; score?: number };
      nodejs: { videosWatched: number; quizPassed: boolean; score?: number };
      mongodb: { videosWatched: number; quizPassed: boolean; score?: number };
    };
    core: {
      os: { topicsCompleted: string[]; quizzesPassed: number };
      dbms: { topicsCompleted: string[]; quizzesPassed: number };
      cn: { topicsCompleted: string[]; quizzesPassed: number };
    };
    dsa: {
      solvedProblems: string[];
      topicProgress: { [topic: string]: number };
    };
    aptitude: {
      completedTopics: string[];
      scores: { [topic: string]: number };
    };
  };
  
  // Gamification
  totalPoints: number;
  badges: string[];
  streak: number;
  lastActiveDate: Date;
  lastLogin: Date;
  
  // Social features
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    }
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  providerId: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  progress: {
    webdev: {
      html: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number },
      css: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number },
      javascript: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number },
      react: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number },
      nodejs: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number },
      mongodb: { videosWatched: { type: Number, default: 0 }, quizPassed: { type: Boolean, default: false }, score: Number }
    },
    core: {
      os: { topicsCompleted: [String], quizzesPassed: { type: Number, default: 0 } },
      dbms: { topicsCompleted: [String], quizzesPassed: { type: Number, default: 0 } },
      cn: { topicsCompleted: [String], quizzesPassed: { type: Number, default: 0 } }
    },
    dsa: {
      solvedProblems: [String],
      topicProgress: { type: Schema.Types.Mixed, default: {} }
    },
    aptitude: {
      completedTopics: [String],
      scores: { type: Schema.Types.Mixed, default: {} }
    }
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  streak: {
    type: Number,
    default: 0
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);