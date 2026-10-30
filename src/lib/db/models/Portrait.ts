import { Schema, model, models } from "mongoose";

export interface IPortrait {
  _id: string;
  userId: string;
  imageUrl: string;
  name?: string;
  createdAt: Date;
}

const PortraitSchema = new Schema<IPortrait>(
  {
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export default models.Portrait ||
  model<IPortrait>("Portrait", PortraitSchema);