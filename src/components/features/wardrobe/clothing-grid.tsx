import type { IClothingItem } from "@/types";
import { ClothingCard } from "@/components/features/wardrobe/clothing-card";

export function ClothingGrid({ items }: { items: IClothingItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <ClothingCard key={item._id} item={item} />
      ))}
    </div>
  );
}