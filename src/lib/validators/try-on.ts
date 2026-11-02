import { z } from "zod";

export const tryOnSchema = z.object({
  portraitId: z.string().min(1),
  clothingIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one clothing item")
    .max(10, "Maximum 10 items per try-on"),
});