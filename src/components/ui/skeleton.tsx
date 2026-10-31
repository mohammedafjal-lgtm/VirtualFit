import { clsx } from "clsx";
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("rounded bg-slate-200 animate-pulse", className)} />;
}