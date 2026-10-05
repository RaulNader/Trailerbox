import type { ReactNode } from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`flex items-center justify-center py-16 ${className}`}
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-fg/10 border-t-brand" />
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-brand/30 bg-brand/10 px-6 py-8 text-center text-neutral-200">
      <span aria-hidden>⛔️</span>
      <p>{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <span className="text-6xl" aria-hidden>
        {icon}
      </span>
      <h2 className="text-2xl font-bold">{title}</h2>
      {children && <p className="max-w-md text-neutral-400">{children}</p>}
    </div>
  );
}
