// Shared application types, mirroring the Supabase schema (PRD §5).

export const CATEGORY_NAMES = [
  "Essentials",
  "Studies",
  "Shopping",
  "Food",
  "Entertainment",
  "Transport",
  "Subscriptions",
  "Other",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export interface Month {
  id: string;
  user_id: string;
  month: string; // "YYYY-MM"
  allowance: number;
}

export interface Budget {
  id: string;
  month_id: string;
  name: string;
  allocated_amount: number;
}

export interface Expense {
  id: string;
  budget_id: string;
  name: string;
  amount: number;
  category: CategoryName;
  date: string; // ISO date "YYYY-MM-DD"
}