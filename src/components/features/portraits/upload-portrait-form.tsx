/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useCreatePortrait } from "@/hooks/use-portraits";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function UploadPortraitForm() {
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const create = useCreatePortrait();

  const { startUpload, isUploading } = useUploadThing("portraitUploader", {
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
        await create.mutateAsync({ imageUrl: url, name: name || undefined });
        toast.success("Portrait added");
        setName("");
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
          <p className="font-medium text-slate-900">Add a portrait</p>
          <p className="text-sm text-slate-600">
            A clear, front‑facing full‑body or half‑body photo works best.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Label (optional)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label
          className={`cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 ${
            busy ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {busy ? "Uploading…" : "Choose image"}
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
        <img
          src={previewUrl}
          alt="Uploaded portrait"
          className="mt-4 h-40 w-40 rounded-lg object-cover border border-slate-200"
        />
      )}
    </div>
  );
}