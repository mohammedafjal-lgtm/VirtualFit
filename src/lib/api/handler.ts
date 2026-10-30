import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";

type Handler<Ctx = unknown> = (
  req: Request,
  ctx: Ctx
) => Promise<NextResponse> | NextResponse;

export function withErrorHandling<Ctx = unknown>(fn: Handler<Ctx>): Handler<Ctx> {
  return async (req, ctx) => {
    try {
      await connectDB();
      return await fn(req, ctx);
    } catch (err: unknown) {
      console.error("[API ERROR]", err);
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? Number((err as { status: number }).status)
          : 500;
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Internal Server Error" },
        { status: status || 500 }
      );
    }
  };
}