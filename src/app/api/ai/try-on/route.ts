import { connection } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import { tryOnSchema } from "@/lib/validators/try-on";
import Portrait from "@/lib/db/models/Portrait";
import ClothingItem from "@/lib/db/models/ClothingItem";
import TryOnResult from "@/lib/db/models/TryOnResult";
import { generateTryOn } from "@/lib/ai/try-on";

export const POST = withErrorHandling(async (req) => {
  await connection();
  const { session, response } = await requireAuth();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid JSON body");
  }

  const parsed = tryOnSchema.safeParse(body);
  if (!parsed.success) return fail(400, parsed.error.flatten());

  const { portraitId, clothingIds } = parsed.data;
  const userId = session!.user.id;

  const portrait = await Portrait.findOne({ _id: portraitId, userId });
  if (!portrait) return fail(404, "Portrait not found");

  const clothes = await ClothingItem.find({
    _id: { $in: clothingIds },
    userId,
  });
  if (clothes.length !== clothingIds.length) {
    return fail(404, "One or more clothing items not found");
  }

  const job = await TryOnResult.create({
    userId,
    portraitId,
    clothingIds,
    status: "pending",
  });

  // Background worker — provider-agnostic call
  runTryOn(job._id.toString(), portrait.imageUrl, clothes).catch((err) => {
    console.error("[TRY-ON BACKGROUND ERROR]", err);
  });

  return ok({ jobId: job._id.toString(), status: "pending" }, 202);
});

async function runTryOn(
  jobId: string,
  portraitUrl: string,
  clothes: Array<{
    imageUrl: string;
    tags?: { category?: string; description?: string };
  }>
) {
  try {
    const result = await generateTryOn({
      personImageUrl: portraitUrl,
      garmentImageUrls: clothes.map((c) => c.imageUrl),
      garmentDescriptions: clothes.map((c) => c.tags?.description ?? ""),
      garmentCategories: clothes.map((c) => c.tags?.category ?? ""),
    });

    await TryOnResult.findByIdAndUpdate(jobId, {
      resultUrl: result.resultUrl,
      status: "completed",
    });
  } catch (err) {
    console.error("[TRY-ON FAILED]", err);

    let message = "AI generation failed";
    if (err instanceof Error) {
      if (err.message.includes("402") || err.message.includes("billing")) {
        message = "AI service billing issue. Contact support.";
      } else if (err.message.includes("content_policy")) {
        message = "The image was rejected by the AI safety filter. Try different photos.";
      } else {
        message = err.message;
      }
    }

    await TryOnResult.findByIdAndUpdate(jobId, {
      status: "failed",
      error: message,
    });
  }
}