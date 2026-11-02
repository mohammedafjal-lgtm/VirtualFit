import { PageHeader } from "@/components/ui/page-header";
import { OutfitBuilder } from "@/components/features/try-on/outfit-builder";

export function TryOnView() {
  return (
    <div className="space-y-8">
      <PageHeader
  title="Try on"
  description="Pick a portrait, select 1–10 items (tops, bottoms, shoes, watches, hats, belts…), and let AI generate the full look."
/>
      <OutfitBuilder />
    </div>
  );
}