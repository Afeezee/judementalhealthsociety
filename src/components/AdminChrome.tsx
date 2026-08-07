import type { ReactNode } from "react";

export function PageTitle({
  title,
  description,
  actions,
  kicker,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  kicker?: string;
}) {
  return (
    <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        {kicker && (
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-brand mb-2">
            {kicker}
          </div>
        )}
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-fg-muted max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-hairline bg-bg-surface p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-fg-muted">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-medium tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-fg-muted">{hint}</div>}
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline p-10 text-center">
      <div className="font-display text-xl font-medium">{title}</div>
      {description && <p className="mt-2 text-sm text-fg-muted max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
