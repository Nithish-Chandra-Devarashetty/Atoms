import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  _id: string;
  author: mongoose.Types.ObjectId;
  content: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReply extends Document {
  _id: string;
  discussionId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  }]
}, {
  timestamps: true
});

const replySchema = new Schema<IReply>({
  discussionId: {
    type: Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true
  },
  author: {
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
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema);
export const Reply = mongoose.model<IReply>('Reply', replySchema);