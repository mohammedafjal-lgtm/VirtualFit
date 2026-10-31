/* eslint-disable @next/next/no-img-element */
"use client";

import { Trash2 } from "lucide-react";
import { useDeletePortrait } from "@/hooks/use-portraits";
import { toast } from "sonner";
import type { IPortrait } from "@/types";

export function PortraitCard({ portrait }: { portrait: IPortrait }) {
  const del = useDeletePortrait();

  async function handleDelete() {
    if (!confirm("Delete this portrait?")) return;
    try {
      await del.mutateAsync(portrait._id);
      toast.success("Portrait deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="group relative rounded-xl bg-white border border-slate-200 overflow-hidden">
      <img
        src={portrait.imageUrl}
        alt={portrait.name ?? "portrait"}
        className="aspect-[3/4] w-full object-cover"
      />
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 truncate">
          {portrait.name || "Untitled"}
        </p>
      </div>
      <button
        onClick={handleDelete}
        disabled={del.isPending}
        className="absolute top-2 right-2 rounded-md bg-white/90 p-1.5 text-red-600 opacity-0 group-hover:opacity-100 transition"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}