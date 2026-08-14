import type { ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { SideNav } from "./SideNav";
import { TopAppBar } from "./TopAppBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-pebble-mist">
      <SideNav />
      <div className="flex w-full flex-col md:ml-64">
        <TopAppBar />
        <main className="flex-1 px-margin-mobile py-4 pb-24 md:px-margin-desktop md:py-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}