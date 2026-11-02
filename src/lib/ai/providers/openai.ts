import OpenAI, { toFile } from "openai";
import { UTApi } from "uploadthing/server";
import type {
  AIProvider,
  ClothingTags,
  TryOnInput,
  TryOnOutput,
} from "../types";

const DEFAULT_MODEL = "gpt-image-2.5-sunburst";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  private client: OpenAI;
  private utApi: UTApi;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing environment variable: "OPENAI_API_KEY"');
    }
    if (!process.env.UPLOADTHING_TOKEN) {
      throw new Error('Missing environment variable: "UPLOADTHING_TOKEN"');
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.utApi = new UTApi();
  }

  // ── Tagging ────────────────────────────────────────────────────────────

  async tagClothing(imageUrl: string): Promise<ClothingTags> {
    try {
      const response = await this.client.responses.create({
        model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "You are a fashion expert. Analyze the clothing or accessory item in the image. " +
                  "Return ONLY valid JSON with keys: category, subCategory, color, style, season, description. " +
                  'category must be one of: ' +
                  '"upper_body" (shirts, tops, sweaters, jackets), ' +
                  '"lower_body" (pants, jeans, skirts, shorts), ' +
                  '"dresses", ' +
                  '"full_body" (suits, jumpsuits, matching sets), ' +
                  '"shoes" (sneakers, boots, sandals, heels, loafers), ' +
                  '"accessory" (watch, hat, cap, belt, bag, jewelry, glasses, scarf, tie). ' +
                  'subCategory must be the specific item type in lowercase ' +
                  '(e.g. "t-shirt", "jeans", "sneakers", "watch", "hat", "belt"). ' +
                  "If the image shows a complete matching outfit (suit, set, jumpsuit), use 'full_body'. " +
                  "No markdown, no extra text.",
              },
              { type: "input_image", image_url: imageUrl, detail: "auto" },
            ],
          },
        ],
        max_output_tokens: 250,
      });
  
      const text = response.output_text ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return {};
  
      const parsed = JSON.parse(match[0]) as ClothingTags;
  
      const validCategories = [
        "upper_body",
        "lower_body",
        "dresses",
        "full_body",
        "shoes",
        "accessory",
      ];
  
      // Intercept hallucinated categories and remap them.
      if (parsed.category && !validCategories.includes(parsed.category)) {
        const lc = parsed.category.toLowerCase();
  
        if (
          lc.includes("shoe") || lc.includes("sneaker") || lc.includes("boot") ||
          lc.includes("sandal") || lc.includes("heel") || lc.includes("loafer")
        ) {
          parsed.category = "shoes";
        } else if (
          lc.includes("watch") || lc.includes("hat") || lc.includes("cap") ||
          lc.includes("belt") || lc.includes("bag") || lc.includes("jewel") ||
          lc.includes("glasses") || lc.includes("scarf") || lc.includes("tie") ||
          lc.includes("accessor")
        ) {
          parsed.category = "accessory";
        } else if (
          lc.includes("suit") || lc.includes("set") || lc.includes("full") ||
          lc.includes("outfit") || lc.includes("jumpsuit")
        ) {
          parsed.category = "full_body";
        } else if (
          lc.includes("pant") || lc.includes("skirt") || lc.includes("short") ||
          lc.includes("jeans") || lc.includes("trouser")
        ) {
          parsed.category = "lower_body";
        } else if (lc.includes("dress")) {
          parsed.category = "dresses";
        } else {
          parsed.category = "upper_body";
        }
      }
  
      if (parsed.subCategory) {
        parsed.subCategory = String(parsed.subCategory).toLowerCase().trim();
      }
  
      return parsed;
    } catch (err) {
      console.error("[OPENAI TAGGING ERROR]", err);
      return {};
    }
  }

  async generatePortraitTitle(imageUrl: string): Promise<string> {
    const fallback = `Portrait ${new Date().toISOString().slice(0, 10)}`;

    try {
      const response = await this.client.responses.create({
        model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Generate a short title (3–6 words) for this portrait. " +
                  "Examples: 'Outdoor Selfie', 'Studio Headshot'. Return only the title.",
              },
              {
                type: "input_image",
                image_url: imageUrl,
                detail: "auto",
              },
            ],
          },
        ],
        max_output_tokens: 20,
      });

      return (response.output_text ?? "").trim() || fallback;
    } catch (err) {
      console.error("[OPENAI TITLE ERROR]", err);
      return fallback;
    }
  }

  // ── Try-on ─────────────────────────────────────────────────────────────

  async generateTryOn(input: TryOnInput): Promise<TryOnOutput> {
    const model = process.env.OPENAI_IMAGE_MODEL ?? DEFAULT_MODEL;
  
    const files = await Promise.all([
      this.urlToFile(input.personImageUrl, "person.png"),
      ...input.garmentImageUrls.map((url, i) =>
        this.urlToFile(url, `garment-${i + 1}.png`)
      ),
    ]);
  
    const garmentList = input.garmentImageUrls
      .map((_, i) => {
        const desc = input.garmentDescriptions?.[i]?.trim();
        const cat = input.garmentCategories?.[i]?.trim();
        const sub = input.garmentSubCategories?.[i]?.trim();
        const label = [sub, cat].filter(Boolean).join(" / ");
        const head = label ? `Garment ${i + 1} [${label}]` : `Garment ${i + 1}`;
        return desc ? `${head}: ${desc}` : head;
      })
      .join("\n");
  
    const prompt = `
  Edit the first image (the person) to dress them using the provided garment images.
  
  Garments to apply:
  ${garmentList}
  
  Placement rules by category:
  - "upper_body" (shirts, tops, sweaters, jackets) replace the person's upper-body clothing.
  - "lower_body" (pants, jeans, skirts) replace the person's lower-body clothing.
  - "dresses" and "full_body" items replace the person's full outfit with that piece.
  - "shoes" replace the person's footwear.
  - "accessory" items are placed on the person at the correct position: hat on head,
    watch on wrist, belt at waist, glasses on face, bag over shoulder or in hand,
    scarf around neck, tie at collar, jewelry on the appropriate body part.
  
  Partial-outfit rule:
  If only some items are provided, keep the person's existing clothing and accessories
  for everything that was NOT supplied. For example, if only a shirt is provided, change
  only the shirt and preserve the existing pants, shoes, and any other items.
  
  Constraints:
  - Do not change the person's face, facial features, skin tone, body shape, pose, or
    identity in any way. Preserve their exact likeness, expression, hairstyle, and proportions.
  - Fit each garment naturally to the existing pose and body geometry, with realistic fabric behavior.
  - Match lighting, shadows, and color temperature to the original photo so the outfit integrates photorealistically.
  - Do not change the background, camera angle, framing, or image quality.
  - Do not add extra accessories, text, logos, or watermarks that were not provided.
  `.trim();
  
    const response = await this.client.images.edit({
      model,
      image: files,
      prompt,
      n: 1,
      size: "1024x1536",
      quality: "medium",
    });
  
    const result = response.data?.[0];
    if (!result?.b64_json) {
      throw new Error("OpenAI returned no image data");
    }
  
    const resultUrl = await this.persistBase64Image(result.b64_json);
    return { resultUrl, raw: result };
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  private async urlToFile(url: string, filename: string) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch image (${res.status}): ${url}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return toFile(buffer, filename, { type: "image/png" });
  }

  private async persistBase64Image(b64: string): Promise<string> {
    const buffer = Buffer.from(b64, "base64");
    const filename = `tryon-${crypto.randomUUID()}.png`;

    const upload = await this.utApi.uploadFiles(
      new File([buffer], filename, { type: "image/png" })
    );

    if (upload.error || !upload.data) {
      throw new Error(
        `Failed to persist generated image: ${upload.error?.message ?? "unknown error"}`
      );
    }

    const url = upload.data.ufsUrl ?? upload.data.url;
    if (!url) {
      throw new Error("UploadThing returned no URL for the generated image");
    }

    return url;
  }
}