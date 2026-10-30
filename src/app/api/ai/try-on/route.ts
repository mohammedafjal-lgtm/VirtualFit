import { connection } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import { tryOnSchema } from "@/lib/validators/try-on";
import Portrait from "@/lib/db/models/Portrait";
import ClothingItem from "@/lib/db/models/ClothingItem";
import TryOnResult from "@/lib/db/models/TryOnResult";
import { replicate, withTimeout } from "@/lib/ai/replicate";

const IDM_VTON_VERSION =
  "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

export const GET = withErrorHandling(async () => {
  await connection();
  const { session, response } = await requireAuth();
  if (response) return response;

  const results = await TryOnResult.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return ok(results);
});

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
    let currentHuman = portraitUrl;

    for (const cloth of clothes) {
      const category = cloth.tags?.category ?? "upper_body";

      const output = (await withTimeout(
        replicate.run(`cuuupid/idm-vton:${IDM_VTON_VERSION}`, {
          input: {
            human_img: currentHuman,
            garm_img: cloth.imageUrl,
            garment_des: cloth.tags?.description ?? "clothing item",
            category,
            crop: false,
            steps: 30,
            seed: 42,
            force_dc: false,
            mask_only: false,
          },
        }),
        180_000,
        "IDM-VTON"
      )) as unknown;

      const file =
        Array.isArray(output) && output.length > 0 ? output[0] : output;

      if (!file || typeof (file as { url?: unknown }).url !== "function") {
        throw new Error("AI returned an unexpected output format");
      }

      currentHuman = (file as { url: () => string }).url();
    }

    await TryOnResult.findByIdAndUpdate(jobId, {
      resultUrl: currentHuman,
      status: "completed",
    });
  } catch (err) {
    console.error("[TRY-ON FAILED]", err);
    await TryOnResult.findByIdAndUpdate(jobId, {
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown AI error",
    });
  }
}