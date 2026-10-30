"use client";

import { usePortraits } from "@/hooks/use-portraits";
import { UploadPortraitForm } from "@/components/upload-portrait-form";
import { PortraitCard } from "@/components/portrait-card";
import { User } from "lucide-react";

export default function PortraitsPage() {
  const { data: portraits = [], isLoading } = usePortraits();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Portraits</h1>
        <p className="text-sm text-slate-600">
          Upload one or more portraits to use as your try‑on model.
        </p>
      </header>

      <UploadPortraitForm />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : portraits.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <User className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">No portraits yet</p>
          <p className="text-sm text-slate-500">
            Upload a photo above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {portraits.map((p) => (
            <PortraitCard key={p._id} portrait={p} />
          ))}
        </div>
      )}
    </div>
  );
}