"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { dashboardNav, site } from "@/config/site";
import { UserMenu } from "@/components/layout/user-menu";

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          {site.name}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {dashboardNav.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <UserMenu userName={userName} />
    </aside>
  );
}