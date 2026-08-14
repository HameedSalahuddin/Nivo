"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sangria-deep text-white hover:bg-primary shadow-level-1 hover:shadow-level-2",
  secondary:
    "bg-pebble-mist text-on-surface border border-surface-variant shadow-level-1 hover:bg-surface-container-high",
  outline:
    "bg-surface-container-lowest border border-sangria-deep/20 text-sangria-deep hover:bg-sangria-deep hover:text-white",
  ghost:
    "text-on-surface-variant hover:text-sangria-deep hover:bg-surface-container",
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-label-sm text-label-sm transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-60 ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}