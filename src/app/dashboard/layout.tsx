import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Suspense fallback={<SidebarSkeleton />}>
        <AuthenticatedSidebar />
      </Suspense>
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Suspense fallback={<DashboardSkeleton />}>
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

async function AuthenticatedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");
  return <>{children}</>;
}

function SidebarSkeleton() {
  return (
    <div className="w-60 border-r border-slate-200 bg-white animate-pulse" />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 rounded bg-slate-200 animate-pulse" />
      <div className="h-4 w-96 rounded bg-slate-200 animate-pulse" />
      <div className="h-48 rounded-xl bg-slate-100 animate-pulse" />
    </div>
  );
}