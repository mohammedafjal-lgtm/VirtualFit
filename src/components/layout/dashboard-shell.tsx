import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Suspense fallback={<div className="w-60 border-r border-slate-200 bg-white animate-pulse" />}>
        <AuthenticatedSidebar />
      </Suspense>
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Suspense fallback={<ContentSkeleton />}>
            <AuthenticatedContent>{children}</AuthenticatedContent>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function AuthenticatedSidebar() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  return <Sidebar userName={session.user.name ?? session.user.email} />;
}

async function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  return <>{children}</>;
}

function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}