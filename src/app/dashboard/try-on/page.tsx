import { OutfitBuilder } from "@/components/outfit-builder";

export default function TryOnPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Try on</h1>
        <p className="text-sm text-slate-600">
          Pick a portrait, select up to 4 clothing items, and let AI generate the
          look.
        </p>
      </header>

      <OutfitBuilder />
    </div>
  );
}