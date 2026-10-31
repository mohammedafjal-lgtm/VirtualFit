export function PageHeader({
    title, description, children,
  }: { title: string; description?: string; children?: React.ReactNode }) {
    return (
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
        {children}
      </header>
    );
  }