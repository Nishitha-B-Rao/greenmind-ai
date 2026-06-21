import mongoose, { Schema, Document } from 'mongoose';

export interface IReceiptAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl?: string; // Optional if we just want to store the result without the image
  estimatedFoodImpact: string;
  highestOffender: string;
  reason: string;
  ecoAlternative: string;
  createdAt: Date;
}

const ReceiptAnalysisSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String },
    estimatedFoodImpact: { type: String, required: true },
    highestOffender: { type: String, required: true },
    reason: { type: String, required: true },
    ecoAlternative: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ReceiptAnalysis || mongoose.model<IReceiptAnalysis>('ReceiptAnalysis', ReceiptAnalysisSchema);
