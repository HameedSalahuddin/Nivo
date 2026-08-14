export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/budgets", label: "Budgets", icon: "account_balance_wallet" },
  { href: "/expenses", label: "Expenses", icon: "receipt_long" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

// Dashboard ("/") must match exactly; nested routes (e.g. /budgets/123)
// keep their parent section active.
export function isNavActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}