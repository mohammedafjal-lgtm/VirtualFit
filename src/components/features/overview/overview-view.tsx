import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/connect";
import ClothingItem from "@/lib/db/models/ClothingItem";
import Portrait from "@/lib/db/models/Portrait";
import TryOnResult from "@/lib/db/models/TryOnResult";
import { Shirt, User, Sparkles, ArrowRight } from "lucide-react";
import { StatCard } from "./stat-card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewView() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}

async function OverviewContent() {
  const session = await auth();
  if (!session?.user?.id) return null;
  await connectDB();
  const userId = session.user.id;

  const [clothingCount, portraitCount, tryOnCount] = await Promise.all([
    ClothingItem.countDocuments({ userId }),
    Portrait.countDocuments({ userId }),
    TryOnResult.countDocuments({ userId }),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-sm text-slate-600">Here&apos;s a quick overview of your wardrobe.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Shirt className="h-5 w-5 text-indigo-600" />} label="Clothing items" value={clothingCount} href="/dashboard/wardrobe" />
        <StatCard icon={<User className="h-5 w-5 text-indigo-600" />} label="Portraits" value={portraitCount} href="/dashboard/portraits" />
        <StatCard icon={<Sparkles className="h-5 w-5 text-indigo-600" />} label="Try-ons generated" value={tryOnCount} href="/dashboard/history" />
      </div>

      <div className="rounded-xl bg-indigo-600 text-white p-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Ready to try something on?</p>
          <p className="text-sm text-indigo-100 mt-1">Pick a portrait and a few clothing items to generate a look.</p>
        </div>
        <Link href="/dashboard/try-on" className="rounded-lg bg-white text-indigo-700 px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-indigo-50">
          Start try-on <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-9 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}