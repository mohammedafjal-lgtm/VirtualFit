/* eslint-disable @next/next/no-img-element */
"use client";

import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ITryOnResult } from "@/types";

export function TryOnResult({ data, onReset }: { data?: ITryOnResult; onReset: () => void }) {
  const status = data?.status;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 p-6 flex items-start gap-4">
        {status === "pending"   && <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-indigo-600" />}
        {status === "completed" && <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />}
        {status === "failed"    && <XCircle className="mt-0.5 h-5 w-5 text-red-600" />}

        <div className="flex-1">
          {status === "pending" && (
            <>
              <p className="font-medium text-slate-900">Generating your look</p>
              <p className="text-sm text-slate-600">This typically takes 30–90 seconds. We&apos;ll refresh automatically.</p>
            </>
          )}
          {status === "completed" && (
            <>
              <p className="font-medium text-slate-900">Your try-on is ready</p>
              <p className="text-sm text-slate-600">Saved to your history for later.</p>
            </>
          )}
          {status === "failed" && (
            <>
              <p className="font-medium text-red-700">Generation failed</p>
              <p className="text-sm text-slate-600">{data?.error ?? "Something went wrong. Try again."}</p>
            </>
          )}
        </div>

        {(status === "completed" || status === "failed") && (
          <Button variant="secondary" size="sm" onClick={onReset}>Start over</Button>
        )}
      </div>

      {status === "completed" && data?.resultUrl && (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <img src={data.resultUrl} alt="Try-on result" className="w-full max-h-[640px] object-contain bg-slate-50" />
        </div>
      )}
    </div>
  );
}