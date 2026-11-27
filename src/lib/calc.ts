import type { Budget, CategoryName, Expense, IncomingTransaction } from "./types";

// Derived financial values (PRD §7). These are always computed from the
// underlying data — never stored in the database.

export function spentForBudget(expenses: Expense[], budgetId: string): number {
  return expenses
    .filter((expense) => expense.budget_id === budgetId)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

export function remainingForBudget(allocated: number, spent: number): number {
  return allocated - spent;
}

export function totalAllocated(budgets: Budget[]): number {
  return budgets.reduce((sum, budget) => sum + budget.allocated_amount, 0);
}

export function unallocated(allowance: number, allocated: number): number {
  return allowance - allocated;
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function totalRemaining(allowance: number, spent: number): number {
  return allowance - spent;
}

export interface CategoryTotal {
  category: CategoryName;
  total: number;
}

// Groups expenses by category, sorted by total descending.
export function spentByCategory(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<CategoryName, number>();
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  }
  return Array.from(totals, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total,
  );
}

export function progressRatio(allocated: number, spent: number): number {
  if (allocated <= 0) return 0;
  return Math.min(spent / allocated, 1);
}

export function percentAllocated(allowance: number, allocated: number): number {
  if (allowance <= 0) return 0;
  return Math.min((allocated / allowance) * 100, 100);
}

// ── Money Received helpers ────────────────────────────────────────────────────

/** Sum of ALL incoming transaction amounts regardless of type. */
export function totalIncoming(transactions: IncomingTransaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

/** Sum of transactions typed 'income' (new money: allowance top-up, scholarship, etc.) */
export function totalIncome(transactions: IncomingTransaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

/** Sum of transactions typed 'repayment' (friend paying back, reimbursement, etc.) */
export function totalRepayments(transactions: IncomingTransaction[]): number {
  return transactions
    .filter((t) => t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Available funds = Starting allowance + Income + Repayments − Expenses.
 * Transfers are intentionally excluded — they represent money already in the
 * user's possession being moved between accounts, not new money arriving.
 */
export function availableFunds(
  allowance: number,
  transactions: IncomingTransaction[],
  spent: number,
): number {
  return allowance + totalIncome(transactions) + totalRepayments(transactions) - spent;
}