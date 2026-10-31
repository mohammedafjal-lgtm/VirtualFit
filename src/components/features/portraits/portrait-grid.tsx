import type { IPortrait } from "@/types";
import { PortraitCard } from "@/components/features/portraits/portrait-card";

export function PortraitGrid({ portraits }: { portraits: IPortrait[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {portraits.map((p) => (
        <PortraitCard key={p._id} portrait={p} />
      ))}
    </div>
  );
}