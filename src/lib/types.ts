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

// 'income'     — genuinely new money (allowance top-up, scholarship, part-time earnings, gift, etc.)
// 'repayment'  — friend paying back borrowed money / shared-expense reimbursement
// 'transfer'   — money moved from another personal account (not counted as new income)
export const INCOMING_TYPES = ["income", "repayment", "transfer"] as const;
export type IncomingType = (typeof INCOMING_TYPES)[number];

export interface IncomingTransaction {
  id: string;
  month_id: string;
  amount: number;
  source: string;
  type: IncomingType;
  date: string; // ISO date "YYYY-MM-DD"
  description?: string | null;
}