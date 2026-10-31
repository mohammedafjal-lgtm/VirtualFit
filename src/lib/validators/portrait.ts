import { z } from "zod";

export const portraitSchema = z.object({
  imageUrl: z.string().url(),
  name: z.string().max(120).optional(),
});