import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/connect";
import TryOnResult from "@/lib/db/models/TryOnResult";
import Portrait from "@/lib/db/models/Portrait";
import ClothingItem from "@/lib/db/models/ClothingItem";

export default async function HistoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const result = await TryOnResult.findOne({
    _id: id,
    userId: session.user.id,
  }).lean();

  if (!result) notFound();

  const portrait = await Portrait.findOne({ _id: result.portraitId }).lean();
  const clothes = await ClothingItem.find({
    _id: { $in: result.clothingIds },
  }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Try‑on result</h1>
        <Link
          href="/dashboard/history"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to history
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          {result.status === "completed" && result.resultUrl ? (
            <img
              src={result.resultUrl}
              alt="try-on result"
              className="w-full max-h-[640px] object-contain bg-slate-50"
            />
          ) : result.status === "pending" ? (
            <div className="p-10 text-center text-slate-500">
              Still generating…
            </div>
          ) : (
            <div className="p-10 text-center text-red-600">
              {result.error ?? "Generation failed"}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {portrait && (
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                Portrait
              </p>
              <img
                src={portrait.imageUrl}
                alt="portrait"
                className="rounded-lg aspect-[3/4] w-full object-cover"
              />
            </div>
          )}

          {clothes.length > 0 && (
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                Clothing
              </p>
              <div className="grid grid-cols-2 gap-2">
                {clothes.map((c) => (
                  <img
                    key={String(c._id)}
                    src={c.imageUrl}
                    alt={c.name ?? "clothing"}
                    className="rounded-lg aspect-square w-full object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}