import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-container-lowest p-8 text-center">
      <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
        {icon}
      </span>
      <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
      {description && (
        <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}