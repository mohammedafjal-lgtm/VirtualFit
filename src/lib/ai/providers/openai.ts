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
                  "You are a fashion expert. Analyze the clothing item in the image. " +
                  "Return ONLY valid JSON with keys: category (upper_body | lower_body | dresses), " +
                  "color, style, season, description. No markdown, no extra text.",
              },
              {
                type: "input_image",
                image_url: imageUrl,
                detail: "auto",   // ← required by OpenAI SDK v7.46+
              },
            ],
          },
        ],
        max_output_tokens: 200,
      });

      const text = response.output_text ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return {};

      const parsed = JSON.parse(match[0]) as ClothingTags;

      if (
        parsed.category &&
        !["upper_body", "lower_body", "dresses"].includes(parsed.category)
      ) {
        parsed.category = "upper_body";
      }

      return parsed;
    } catch (err) {
      console.error("[OPENAI TAGGING ERROR]", err);
      return {}; // never block upload
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
                detail: "auto",   // ← required by OpenAI SDK v7.46+
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

    const garmentList = input.garmentDescriptions?.length
      ? input.garmentDescriptions
          .map((d, i) => `Garment ${i + 1}: ${d}`)
          .join("\n")
      : `There are ${input.garmentImageUrls.length} garment image(s) after the person image.`;

    const prompt = `
Edit the first image (the person) to dress them using the provided garment images.
${garmentList}

Do not change the person's face, facial features, skin tone, body shape, pose, or identity in any way. Preserve their exact likeness, expression, hairstyle, and proportions.
Replace only the clothing, fitting the garments naturally to the existing pose and body geometry with realistic fabric behavior.
Match lighting, shadows, and color temperature to the original photo so the outfit integrates photorealistically.
Do not change the background, camera angle, framing, or image quality, and do not add accessories, text, logos, or watermarks.
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