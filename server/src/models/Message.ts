import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  _id: string;
  participants: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const conversationSchema = new Schema<IConversation>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure participants array has exactly 2 users
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Conversation must have exactly 2 participants'));
  } else {
    next();
  }
});

// Create compound index for efficient queries
conversationSchema.index({ participants: 1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);