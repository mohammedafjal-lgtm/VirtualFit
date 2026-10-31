import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  UPLOADTHING_TOKEN: z.string().min(1),
  AI_PROVIDER: z.string().default("openai"),
  OPENAI_API_KEY: z.string().min(1),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;