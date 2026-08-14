import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
}

export function Input({ leadingIcon, className = "", ...props }: InputProps) {
  return (
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {leadingIcon}
        </span>
      )}
      <input
        className={`w-full rounded-lg border border-outline bg-pebble-mist py-2 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-sangria-deep focus:ring-4 focus:ring-sangria-deep/10 ${leadingIcon ? "pl-10 pr-3" : "px-3"} ${className}`}
        {...props}
      />
    </div>
  );
}