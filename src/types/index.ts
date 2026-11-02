export interface ClothingTags {
  category?: string; // upper_body | lower_body | dresses | full_body | shoes | accessory
  subCategory?: string; // t-shirt, jeans, sneakers, watch, hat, belt, bag, glasses, ...
  color?: string;
  style?: string;
  season?: string;
  description?: string;
}

export interface IClothingItem {
  _id: string;
  userId: string;
  imageUrl: string;
  name?: string;
  tags: ClothingTags;
  createdAt: string;
}

export interface IPortrait {
  _id: string;
  userId: string;
  imageUrl: string;
  name?: string;
  createdAt: string;
}

export interface ITryOnResult {
  _id: string;
  userId: string;
  portraitId: string;
  clothingIds: string[];
  resultUrl?: string;
  status: "pending" | "completed" | "failed";
  error?: string;
  createdAt: string;
}