import { connection } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import { clothingSchema } from "@/lib/validators/clothing";
import ClothingItem from "@/lib/db/models/ClothingItem";
import { tagClothing } from "@/lib/ai/tagging";

export const GET = withErrorHandling(async () => {
  await connection();
  const { session, response } = await requireAuth();
  if (response) return response;

  const items = await ClothingItem.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return ok(items);
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

  const parsed = clothingSchema.safeParse(body);
  if (!parsed.success) return fail(400, parsed.error.flatten());

  const tags = await tagClothing(parsed.data.imageUrl);

  const item = await ClothingItem.create({
    userId: session!.user.id,
    imageUrl: parsed.data.imageUrl,
    name: parsed.data.name,
    tags,
  });

  return ok(item, 201);
});