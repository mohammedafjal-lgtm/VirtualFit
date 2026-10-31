"use client";

import { History } from "lucide-react";
import { useTryOnHistory } from "@/hooks/use-try-on";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { HistoryList } from "./history-list";

export function HistoryView() {
  const { data: results = [], isLoading } = useTryOnHistory();

  return (
    <div className="space-y-8">
      <PageHeader title="History" description="Every try-on you generate shows up here." />
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : results.length === 0 ? (
        <EmptyState icon={History} title="No try-ons yet" description="Generate your first look from the Try-on page." />
      ) : (
        <HistoryList results={results} />
      )}
    </div>
  );
}