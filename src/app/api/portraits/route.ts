import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import Portrait from "@/lib/db/models/Portrait";
import { generatePortraitTitle } from "@/lib/ai/tagging";
import { portraitSchema } from "@/lib/validators/portrait";

export const GET = withErrorHandling(async () => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const portraits = await Portrait.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return ok(portraits);
});

export const POST = withErrorHandling(async (req) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Invalid JSON body");
  }

  const parsed = portraitSchema.safeParse(body);
  if (!parsed.success) return fail(400, parsed.error.flatten());

  let name = parsed.data.name;
  if (!name || name.trim() === "") {
    try {
      name = await generatePortraitTitle(parsed.data.imageUrl);
    } catch (err) {
      console.error("[PORTRAIT TITLE FAILED]", err);
      name = `Portrait ${new Date().toISOString().slice(0, 10)}`;
    }
  }

  const portrait = await Portrait.create({
    userId: session!.user.id,
    imageUrl: parsed.data.imageUrl,
    name,
  });

  return ok(portrait, 201);
});