import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import Portrait from "@/lib/db/models/Portrait";

export const DELETE = withErrorHandling(
  async (_req, ctx: { params: Promise<{ id: string }> }) => {
    const { session, response } = await requireAuth();
    if (response) return response;

    const { id } = await ctx.params;

    const deleted = await Portrait.findOneAndDelete({
      _id: id,
      userId: session!.user.id,
    });

    if (!deleted) return fail(404, "Portrait not found");

    return ok({ success: true });
  }
);