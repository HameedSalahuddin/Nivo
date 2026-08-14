"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/Button";

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-surface-container-lowest p-4 shadow-level-1 md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <Image
          src="/logo.png"
          alt="Nivo logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-lg object-contain"
        />
        <div>
          <div className="font-headline-lg text-headline-lg font-bold leading-8 text-sangria-deep">
            Nivo
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            Student Finance
          </div>
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
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Button fullWidth className="mt-auto">
        <span className="material-symbols-outlined text-[18px]">add</span>
        Add Expense
      </Button>
    </nav>
  );
}