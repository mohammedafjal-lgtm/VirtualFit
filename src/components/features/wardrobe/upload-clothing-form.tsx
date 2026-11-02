/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useCreateClothing } from "@/hooks/use-clothing";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function UploadClothingForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const create = useCreateClothing();

  const { startUpload, isUploading } = useUploadThing("clothingUploader", {
    onClientUploadComplete: async (res) => {
      const file = res?.[0];

      // ✅ Clean v7 extraction (NO file.url access)
      const url = file?.ufsUrl || file?.serverData?.url;

      if (!url) {
        console.error("[UPLOAD] No URL in response:", res);
        toast.error("Upload finished but no file URL was returned. Please try again.");
        return;
      }

      setPreviewUrl(url);

      try {
        const item = await create.mutateAsync({ imageUrl: url });
        const label = item.tags?.subCategory ?? item.tags?.category;
        toast.success(label ? `Tagged as ${label.replace("_", " ")}` : "Item added");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    },
    onUploadError: (err) => {
      toast.error(err.message || "Upload failed");
    },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("File must be under 8MB");
      return;
    }
    await startUpload([file]);
  }

  const busy = isUploading || create.isPending;

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-900">Add a clothing item</p>
          <p className="text-sm text-slate-600">
            Upload one garment at a time — AI will tag it for you.
          </p>
        </div>
        <label
          className={`cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 ${
            busy ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {busy ? "Processing…" : "Choose image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={busy}
          />
        </label>
      </div>
      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Uploaded"
            className="h-32 w-32 rounded-lg object-cover border border-slate-200"
          />
        </div>
      )}
    </div>
  );
}