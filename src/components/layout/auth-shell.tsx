import Link from "next/link";
import { Sparkles } from "lucide-react";
import { site } from "@/config/site";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          {site.name}
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}