"use client";

import { User } from "lucide-react";
import { usePortraits } from "@/hooks/use-portraits";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadPortraitForm } from "@/components/features/portraits/upload-portrait-form";
import { PortraitGrid } from "@/components/features/portraits/portrait-grid";

export function PortraitsView() {
  const { data: portraits = [], isLoading } = usePortraits();

  return (
    <div className="space-y-8">
      <PageHeader title="Portraits" description="Upload one or more portraits to use as your try-on model." />
      <UploadPortraitForm />
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : portraits.length === 0 ? (
        <EmptyState icon={User} title="No portraits yet" description="Upload a photo above to get started." />
      ) : (
        <PortraitGrid portraits={portraits} />
      )}
    </div>
  );
}