export function AuthCard({
    title, subtitle, children,
  }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    );
  }