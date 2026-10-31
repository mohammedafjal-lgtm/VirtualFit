/* eslint-disable @next/next/no-img-element */
"use client";

import { Trash2 } from "lucide-react";
import { useDeleteClothing } from "@/hooks/use-clothing";
import { toast } from "sonner";
import type { IClothingItem } from "@/types";

export function ClothingCard({ item }: { item: IClothingItem }) {
  const del = useDeleteClothing();

  async function handleDelete() {
    if (!confirm("Delete this item?")) return;
    try {
      await del.mutateAsync(item._id);
      toast.success("Item deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="group relative rounded-xl bg-white border border-slate-200 overflow-hidden">
      <img src={item.imageUrl} alt={item.name ?? "clothing"} className="aspect-square w-full object-cover" />
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 capitalize">
          {item.tags?.category?.replace("_", " ") ?? "Uncategorized"}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {[item.tags?.color, item.tags?.style].filter(Boolean).join(" · ") || "No tags"}
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