"use client";

import { usePathname } from "next/navigation";
import { formatMonthLabel } from "@/lib/onboarding/helpers";

interface MonthFilterProps {
  months: string[];
  selectedMonth: string;
}

export function MonthFilter({ months, selectedMonth }: MonthFilterProps) {
  const pathname = usePathname();

  return (
    <form action={pathname} method="get">
      <label className="flex items-center gap-2">
        <span className="sr-only">Select month</span>
        <select
          aria-label="Select month"
          name="month"
          value={selectedMonth}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="rounded-lg border border-outline bg-surface-container-lowest px-3 py-2 font-label-sm text-label-sm text-on-surface outline-none focus:border-sangria-deep focus:ring-4 focus:ring-sangria-deep/10"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
