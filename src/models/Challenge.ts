import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'accepted' | 'completed' | 'abandoned';
  createdAt: Date;
  completedAt?: Date;
}

const ChallengeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['accepted', 'completed', 'abandoned'], default: 'accepted' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
