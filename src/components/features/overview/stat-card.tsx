import Link from "next/link";

export function StatCard({
  icon, label, value, href,
}: { icon: React.ReactNode; label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-xl bg-white border border-slate-200 p-5 hover:shadow-sm transition">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </Link>
  );
}