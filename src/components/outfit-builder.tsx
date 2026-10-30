"use client";

import { useMemo, useState } from "react";
import { usePortraits } from "@/hooks/use-portraits";
import { useClothing } from "@/hooks/use-clothing";
import { useGenerateTryOn, usePollTryOn } from "@/hooks/use-try-on";
import { toast } from "sonner";
import { Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";

const MAX_ITEMS = 4;

export function OutfitBuilder() {
  const { data: portraits = [], isLoading: loadingPortraits } = usePortraits();
  const { data: clothes = [], isLoading: loadingClothes } = useClothing();
  const generate = useGenerateTryOn();

  const [portraitId, setPortraitId] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);

  const poll = usePollTryOn(jobId);

  const canGenerate =
    !!portraitId && selected.length > 0 && !generate.isPending && !jobId;

  const selectedClothes = useMemo(
    () => clothes.filter((c) => selected.includes(c._id)),
    [clothes, selected]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_ITEMS) {
        toast.error(`Max ${MAX_ITEMS} items per try‑on`);
        return prev;
      }
      return [...prev, id];
    });
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    try {
      const res = await generate.mutateAsync({
        portraitId,
        clothingIds: selected,
      });
      setJobId(res.jobId);
      toast.success("Generating your look…");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start");
    }
  }

  function reset() {
    setJobId(null);
    setSelected([]);
    setPortraitId("");
  }

  const loading = loadingPortraits || loadingClothes;

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  if (portraits.length === 0 || clothes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 font-medium text-slate-700">
          Upload at least one portrait and one clothing item
        </p>
        <p className="text-sm text-slate-500">
          Both are needed to generate a try‑on.
        </p>
      </div>
    );
  }

  // Result view
  if (jobId) {
    const status = poll.data?.status;

    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white border border-slate-200 p-6 flex items-start gap-4">
          {status === "pending" && (
            <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-indigo-600" />
          )}
          {status === "completed" && (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
          )}
          {status === "failed" && (
            <XCircle className="mt-0.5 h-5 w-5 text-red-600" />
          )}
          <div className="flex-1">
            {status === "pending" && (
              <>
                <p className="font-medium text-slate-900">
                  Generating your look
                </p>
                <p className="text-sm text-slate-600">
                  This typically takes 30–90 seconds. We'll refresh automatically.
                </p>
              </>
            )}
            {status === "completed" && (
              <>
                <p className="font-medium text-slate-900">Your try‑on is ready</p>
                <p className="text-sm text-slate-600">
                  Saved to your history for later.
                </p>
              </>
            )}
            {status === "failed" && (
              <>
                <p className="font-medium text-red-700">Generation failed</p>
                <p className="text-sm text-slate-600">
                  {poll.data?.error ?? "Something went wrong. Try again."}
                </p>
              </>
            )}
          </div>
          {(status === "completed" || status === "failed") && (
            <button
              onClick={reset}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Start over
            </button>
          )}
        </div>

        {status === "completed" && poll.data?.resultUrl && (
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
            <img
              src={poll.data.resultUrl}
              alt="Try-on result"
              className="w-full max-h-[640px] object-contain bg-slate-50"
            />
          </div>
        )}
      </div>
    );
  }

  // Builder view
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section>
          <h2 className="font-medium text-slate-900 mb-3">1. Pick a portrait</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {portraits.map((p) => (
              <button
                key={p._id}
                onClick={() => setPortraitId(p._id)}
                className={clsx(
                  "rounded-lg overflow-hidden border-2",
                  portraitId === p._id
                    ? "border-indigo-600"
                    : "border-transparent hover:border-slate-300"
                )}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name ?? "portrait"}
                  className="aspect-[3/4] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-medium text-slate-900 mb-3">
            2. Select clothes{" "}
            <span className="text-xs font-normal text-slate-500">
              ({selected.length}/{MAX_ITEMS})
            </span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {clothes.map((c) => {
              const isSel = selected.includes(c._id);
              return (
                <button
                  key={c._id}
                  onClick={() => toggle(c._id)}
                  className={clsx(
                    "rounded-lg overflow-hidden border-2 text-left",
                    isSel
                      ? "border-indigo-600"
                      : "border-transparent hover:border-slate-300"
                  )}
                >
                  <img
                    src={c.imageUrl}
                    alt={c.name ?? "clothing"}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-1.5 text-xs text-slate-600 capitalize truncate">
                    {c.tags?.category?.replace("_", " ") ?? "item"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="space-y-3">
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-900 mb-3">
            Outfit summary
          </h3>
          {selectedClothes.length === 0 ? (
            <p className="text-sm text-slate-500">No items selected yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {selectedClothes.map((c) => (
                <li
                  key={c._id}
                  className="text-sm text-slate-700 capitalize truncate"
                >
                  • {c.tags?.category?.replace("_", " ") ?? "item"}
                  {c.tags?.color ? ` — ${c.tags.color}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          disabled={!canGenerate}
          onClick={handleGenerate}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {generate.isPending ? "Starting…" : "Generate try‑on"}
        </button>
      </aside>
    </div>
  );
}