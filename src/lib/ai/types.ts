export interface ClothingTags {
  category?: string; // upper_body | lower_body | dresses | full_body | shoes | accessory
  subCategory?: string; // t-shirt, jeans, sneakers, watch, hat, belt, bag, glasses, ...
  color?: string;
  style?: string;
  season?: string;
  description?: string;
}

export interface TryOnInput {
  personImageUrl: string;
  garmentImageUrls: string[];
  garmentDescriptions?: string[];
  garmentCategories?: string[];    // upper_body | lower_body | dresses | full_body | shoes | accessory
  garmentSubCategories?: string[]; // NEW — specific item type per garment
}

export interface TryOnOutput {
  resultUrl: string;
  raw?: unknown;
}

export interface AIProvider {
  readonly name: string;
  tagClothing(imageUrl: string): Promise<ClothingTags>;
  generatePortraitTitle(imageUrl: string): Promise<string>;
  generateTryOn(input: TryOnInput): Promise<TryOnOutput>;
}