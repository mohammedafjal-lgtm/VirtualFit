import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import TryOnResult from "@/lib/db/models/TryOnResult";

export const GET = withErrorHandling(
  async (_req, ctx: { params: Promise<{ id: string }> }) => {
    const { session, response } = await requireAuth();
    if (response) return response;

    const { id } = await ctx.params;

    const result = await TryOnResult.findOne({
      _id: id,
      userId: session!.user.id,
    }).lean();

    if (!result) return fail(404, "Try-on result not found");

    return ok(result);
  }
);