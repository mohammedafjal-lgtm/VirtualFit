import { getAIProvider } from "./provider";
import type { TryOnInput, TryOnOutput } from "./types";

export type { TryOnInput, TryOnOutput };

export async function generateTryOn(input: TryOnInput): Promise<TryOnOutput> {
  return getAIProvider().generateTryOn(input);
}