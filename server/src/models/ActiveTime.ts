import mongoose, { Document, Schema } from 'mongoose';

export interface IActiveTime extends Document {
  userId: mongoose.Types.ObjectId;
  // UTC date truncated to start of day
  day: Date;
  seconds: number;
  updatedAt: Date;
  createdAt: Date;
}

const activeTimeSchema = new Schema<IActiveTime>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  day: { type: Date, required: true },
  seconds: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true });

activeTimeSchema.index({ userId: 1, day: 1 }, { unique: true });

export const ActiveTime = mongoose.model<IActiveTime>('ActiveTime', activeTimeSchema);
