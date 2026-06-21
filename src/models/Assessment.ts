import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  transport: string;
  diet: string;
  shopping: string;
  household: string;
  electricity: string;
  carbonScore: number;
  riskLevel: string;
  topEmissionSource: string;
  recommendations: string[];
  createdAt: Date;
}

const AssessmentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transport: { type: String, required: true },
    diet: { type: String, required: true },
    shopping: { type: String, required: true },
    household: { type: String, required: true },
    electricity: { type: String, required: true },
    carbonScore: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    topEmissionSource: { type: String, required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
