import mongoose, { Schema, Document } from 'mongoose';

export interface IContestQuestion {
  text: string;
  options: string[]; // 2-6 options
  correctIndex: number; // 0-based index (hidden until contest ends)
}

export interface IContest extends Document {
  title: string;
  description?: string;
  startTime: Date;
  durationMinutes: number; // contest length
  questions: IContestQuestion[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contestQuestionSchema = new Schema<IContestQuestion>({
  text: { type: String, required: true },
  options: { type: [String], required: true, validate: [(v: string[]) => v.length >= 2 && v.length <= 6, 'Options must be 2-6 items'] },
  correctIndex: { type: Number, required: true, min: 0 }
});

const contestSchema = new Schema<IContest>({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  startTime: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  questions: { type: [contestQuestionSchema], required: true, validate: [(v: any[]) => v.length > 0, 'At least one question required'] },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

contestSchema.index({ startTime: 1 });

export const Contest = mongoose.model<IContest>('Contest', contestSchema);
