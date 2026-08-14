import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-surface-container-lowest shadow-level-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}