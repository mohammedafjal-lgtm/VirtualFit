"use client";

import { useClothing } from "@/hooks/use-clothing";
import { UploadClothingForm } from "@/components/upload-clothing-form";
import { ClothingCard } from "@/components/clothing-card";
import { Shirt } from "lucide-react";

export default function WardrobePage() {
  const { data: items = [], isLoading } = useClothing();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Wardrobe</h1>
        <p className="text-sm text-slate-600">
          Every clothing item you upload is tagged by AI.
        </p>
      </header>

      <UploadClothingForm />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <Shirt className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">No items yet</p>
          <p className="text-sm text-slate-500">
            Upload a garment above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <ClothingCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}