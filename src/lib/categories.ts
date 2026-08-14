import { CATEGORY_NAMES, type CategoryName } from "./types";

// The Material Symbols icon shown for each category.
export const CATEGORY_ICONS: Record<CategoryName, string> = {
  Essentials: "home",
  Studies: "menu_book",
  Shopping: "shopping_bag",
  Food: "restaurant",
  Entertainment: "movie",
  Transport: "directions_bus",
  Subscriptions: "subscriptions",
  Other: "category",
};

export function isCategory(value: string): value is CategoryName {
  return (CATEGORY_NAMES as readonly string[]).includes(value);
}

export function getCategoryIcon(category: string): string {
  return isCategory(category) ? CATEGORY_ICONS[category] : "category";
}