import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-bright">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-secondary-fixed-dim/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-primary-fixed-dim/10 blur-[100px]"
      />
      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <Link href="/welcome" className="flex items-center gap-2">
            <span className="font-display-lg text-[24px] font-bold leading-tight text-sangria-deep">
              Nivo
            </span>
          </Link>
          <Link
            href="/welcome"
            className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-sangria-deep"
          >
            Back to home
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-margin-mobile py-8 md:px-margin-desktop">
        {children}
      </main>
    </div>
  );
}