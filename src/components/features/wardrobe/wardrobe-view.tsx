"use client";

import { Shirt } from "lucide-react";
import { useClothing } from "@/hooks/use-clothing";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadClothingForm } from "@/components/features/wardrobe/upload-clothing-form";
import { ClothingGrid } from "@/components/features/wardrobe/clothing-grid";

export function WardrobeView() {
  const { data: items = [], isLoading } = useClothing();

  return (
    <div className="space-y-8">
      <PageHeader title="Wardrobe" description="Every clothing item you upload is tagged by AI." />
      <UploadClothingForm />
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState icon={Shirt} title="No items yet" description="Upload a garment above to get started." />
      ) : (
        <ClothingGrid items={items} />
      )}
    </div>
  );
}