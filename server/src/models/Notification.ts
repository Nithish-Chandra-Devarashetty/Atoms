import mongoose from 'mongoose';

export interface INotification {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'message' | 'discussion_reply' | 'discussion_like' | 'follow';
  title: string;
  message: string;
  data?: {
    discussionId?: mongoose.Types.ObjectId;
    messageId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'discussion_reply', 'discussion_like', 'follow'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    discussionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion'
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
