"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-surface-container-lowest p-4 shadow-level-1 md:flex">
      <div className="mb-8 px-2">
        <div className="font-headline-lg text-headline-lg font-bold leading-8 text-sangria-deep">
          Nivo
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant">
          Student Finance
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
                active
                  ? "bg-sangria-deep text-white shadow-level-1"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-sangria-deep"
              }`}
            >
              <Icon name={item.icon} />
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/expenses?add=1"
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-sangria-deep px-4 py-2 font-label-sm text-label-sm text-white shadow-level-1 transition-all duration-200 hover:bg-primary hover:shadow-level-2 active:scale-95"
      >
        <Icon name="add" className="text-[18px]" />
        Add Expense
      </Link>
    </nav>
  );
}