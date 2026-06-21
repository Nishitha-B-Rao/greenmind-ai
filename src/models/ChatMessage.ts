import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
