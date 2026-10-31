import { PageHeader } from "@/components/ui/page-header";
import { OutfitBuilder } from "@/components/features/try-on/outfit-builder";

export function TryOnView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Try on"
        description="Pick a portrait, select up to 4 clothing items, and let AI generate the look."
      />
      <OutfitBuilder />
    </div>
  );
}