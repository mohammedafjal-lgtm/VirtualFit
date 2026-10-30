// src/lib/ai/tagging.ts
import { replicate, withTimeout } from "./replicate";

export interface ClothingTags {
  category?: string;
  color?: string;
  style?: string;
  season?: string;
  description?: string;
}

// Use a specific, tested version of the LLaVA model.
// You can find the latest version hash on the Replicate model page.
const LLAVA_VERSION =
  "e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358"; // v1.5-13b

export async function tagClothing(imageUrl: string): Promise<ClothingTags> {
  try {
    const output = (await withTimeout(
      replicate.run(`yorickvp/llava-13b:${LLAVA_VERSION}`, {
        input: {
          image: imageUrl,
          prompt:
            'You are a fashion expert. Analyze the clothing item in the image and return ONLY a valid JSON object with these keys: category (one of: upper_body, lower_body, dresses), color, style, season, description. Do not include any other text or markdown formatting.',
          max_tokens: 150,
          temperature: 0.1,
        },
      }),
      45_000,
      "Clothing tagging"
    )) as unknown;

    // The model returns a single string.
    const text = typeof output === "string" ? output : String(output);

    // Extract the JSON block from the string.
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.warn("[TAGGING] Model did not return a JSON object. Output:", text);
      return {};
    }

    const parsed = JSON.parse(match[0]) as ClothingTags;

    // Normalize category to a safe value.
    if (
      parsed.category &&
      !["upper_body", "lower_body", "dresses"].includes(parsed.category)
    ) {
      parsed.category = "upper_body";
    }

    return parsed;
  } catch (err) {
    console.error("[TAGGING ERROR]", err);
    // Re-throw the error so the calling API route can decide how to handle it.
    throw err;
  }
}