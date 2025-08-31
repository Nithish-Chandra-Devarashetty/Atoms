import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswerSelection {
  questionIndex: number;
  selectedIndex: number; // 0-based option index
  isCorrect: boolean;
}

export interface IContestSubmission extends Document {
  contest: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  answers: IAnswerSelection[];
  score: number; // number correct
  total: number; // total questions
  percentage: number; // derived convenience
  submittedAt: Date;
  participationPointsAwarded: boolean; // +100 for participating
  bonusPointsAwarded: number; // 0 | 50 | 100 based on rank after contest ends
}

const answerSchema = new Schema<IAnswerSelection>({
  questionIndex: { type: Number, required: true },
  selectedIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const contestSubmissionSchema = new Schema<IContestSubmission>({
  contest: { type: Schema.Types.ObjectId, ref: 'Contest', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  answers: { type: [answerSchema], required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  participationPointsAwarded: { type: Boolean, default: false },
  bonusPointsAwarded: { type: Number, default: 0 }
}, { timestamps: true });

contestSubmissionSchema.index({ contest: 1, score: -1, createdAt: 1 });
contestSubmissionSchema.index({ contest: 1, user: 1 }, { unique: true });

export const ContestSubmission = mongoose.model<IContestSubmission>('ContestSubmission', contestSubmissionSchema);
