import "./providers";              // ← side-effect: register all adapters
import { getAIProvider } from "./provider";
import type { ClothingTags } from "./types";

export type { ClothingTags };

export async function tagClothing(imageUrl: string): Promise<ClothingTags> {
  return getAIProvider().tagClothing(imageUrl);
}

export async function generatePortraitTitle(imageUrl: string): Promise<string> {
  return getAIProvider().generatePortraitTitle(imageUrl);
}