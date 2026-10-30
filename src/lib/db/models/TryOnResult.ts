import { Schema, model, models } from "mongoose";

export interface ITryOnResult {
  _id: string;
  userId: string;
  portraitId: string;
  clothingIds: string[];
  resultUrl: string;
  status: "pending" | "completed" | "failed";
  error?: string;
  createdAt: Date;
}

const TryOnResultSchema = new Schema<ITryOnResult>(
  {
    userId: { type: String, required: true, index: true },
    portraitId: { type: String, required: true },
    clothingIds: { type: [String], required: true },
    resultUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    error: String,
  },
  { timestamps: true }
);

export default models.TryOnResult ||
  model<ITryOnResult>("TryOnResult", TryOnResultSchema);