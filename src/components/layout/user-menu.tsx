"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function UserMenu({ userName }: { userName?: string | null }) {
  return (
    <div className="px-3 py-4 border-t border-slate-200">
      <p className="px-3 pb-2 text-xs text-slate-500 truncate">{userName ?? "Signed in"}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}