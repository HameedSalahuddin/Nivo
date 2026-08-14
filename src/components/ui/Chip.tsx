import type { HTMLAttributes, ReactNode } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Chip({ children, className = "", ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex w-max items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}