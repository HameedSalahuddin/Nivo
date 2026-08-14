"use client";

import { getCategoryIcon } from "@/lib/categories";
import { CATEGORY_NAMES, type CategoryName } from "@/lib/types";

interface CategoryPickerProps {
  value: CategoryName;
  onChange: (category: CategoryName) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CATEGORY_NAMES.map((category) => {
        const selected = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={selected}
            className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all duration-200 ${
              selected
                ? "border-sangria-deep bg-sangria-deep text-white"
                : "border-surface-variant bg-surface text-on-surface-variant hover:border-sangria-deep/30"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {getCategoryIcon(category)}
            </span>
            <span className="font-label-sm text-label-sm">{category}</span>
          </button>
        );
      })}
    </div>
  );
}