import { connection } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { requireAuth } from "@/lib/api/guards";
import { ok, fail } from "@/lib/api/response";
import ClothingItem from "@/lib/db/models/ClothingItem";

export const DELETE = withErrorHandling(
  async (_req, ctx: { params: Promise<{ id: string }> }) => {
    await connection();
    const { session, response } = await requireAuth();
    if (response) return response;

    const { id } = await ctx.params;

    const deleted = await ClothingItem.findOneAndDelete({
      _id: id,
      userId: session!.user.id,
    });

    if (!deleted) return fail(404, "Clothing item not found");

    return ok({ success: true });
  }
);