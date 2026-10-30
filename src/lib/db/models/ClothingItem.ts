import mongoose, { Schema, model, models } from "mongoose";

export interface IClothingItem {
  _id: string;
  userId: string;
  imageUrl: string;
  name?: string;
  tags: {
    category?: string; // upper_body, lower_body, dresses
    color?: string;
    style?: string;
    season?: string;
    description?: string;
  };
  createdAt: Date;
}

const ClothingItemSchema = new Schema<IClothingItem>(
  {
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    name: { type: String },
    tags: {
      category: String,
      color: String,
      style: String,
      season: String,
      description: String,
    },
  },
  { timestamps: true }
);

ClothingItemSchema.index({ userId: 1, createdAt: -1 });

export default models.ClothingItem ||
  model<IClothingItem>("ClothingItem", ClothingItemSchema);