/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ITryOnResult } from "@/types";

export function HistoryList({ results }: { results: ITryOnResult[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {results.map((r) => (
        <Link
          key={r._id}
          href={`/dashboard/history/${r._id}`}
          className="rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center">
            {r.status === "completed" && r.resultUrl ? (
              <img src={r.resultUrl} alt="try-on" className="h-full w-full object-cover" />
            ) : r.status === "pending" ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-400" />
            )}
          </div>
          <div className="p-3 flex items-center gap-2 text-xs">
            {r.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
            {r.status === "pending"   && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />}
            {r.status === "failed"    && <XCircle className="h-3.5 w-3.5 text-red-500" />}
            <span className="capitalize text-slate-600">{r.status}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}