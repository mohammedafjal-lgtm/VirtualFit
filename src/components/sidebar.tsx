"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Shirt,
  User,
  Sparkles,
  History,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/dashboard/portraits", label: "Portraits", icon: User },
  { href: "/dashboard/try-on", label: "Try‑on", icon: Sparkles },
  { href: "/dashboard/history", label: "History", icon: History },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          VirtualFit
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active =
            it.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <p className="px-3 pb-2 text-xs text-slate-500 truncate">
          {userName ?? "Signed in"}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}