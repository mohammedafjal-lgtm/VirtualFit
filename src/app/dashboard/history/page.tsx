"use client";

import Link from "next/link";
import { useTryOnHistory } from "@/hooks/use-try-on";
import { History, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function HistoryPage() {
  const { data: results = [], isLoading } = useTryOnHistory();

  if (isLoading) return <p className="text-sm text-slate-500">Loading…</p>;

  if (results.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">History</h1>
          <p className="text-sm text-slate-600">
            Every try‑on you generate shows up here.
          </p>
        </header>
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <History className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">No try‑ons yet</p>
          <p className="text-sm text-slate-500">
            Generate your first look from the Try‑on page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">History</h1>
        <p className="text-sm text-slate-600">
          Every try‑on you generate shows up here.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((r) => (
          <Link
            key={r._id}
            href={`/dashboard/history/${r._id}`}
            className="rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center">
              {r.status === "completed" && r.resultUrl ? (
                <img
                  src={r.resultUrl}
                  alt="try-on"
                  className="h-full w-full object-cover"
                />
              ) : r.status === "pending" ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
            </div>
            <div className="p-3 flex items-center gap-2 text-xs">
              {r.status === "completed" && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              )}
              {r.status === "pending" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
              )}
              {r.status === "failed" && (
                <XCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className="capitalize text-slate-600">{r.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}