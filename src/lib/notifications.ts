import {
  progressRatio,
  remainingForBudget,
  spentForBudget,
  totalAllocated,
  unallocated,
} from "./calc";
import { formatINR } from "./money";
import type { Budget, Expense } from "./types";

export interface NotificationAlert {
  id: string;
  severity: "info" | "warning" | "danger";
  message: string;
}

// Derives the alerts shown in the top bar bell from the current month's data.
// Always computed — never stored.
export function buildAlerts(
  budgets: Budget[],
  expenses: Expense[],
  allowance?: number,
): NotificationAlert[] {
  const alerts: NotificationAlert[] = [];

  for (const budget of budgets) {
    const spent = spentForBudget(expenses, budget.id);
    const remaining = remainingForBudget(budget.allocated_amount, spent);
    if (remaining < 0) {
      alerts.push({
        id: `budget-over-${budget.id}`,
        severity: "danger",
        message: `${budget.name} is over budget by ${formatINR(Math.abs(remaining))}`,
      });
    } else {
      const ratio = progressRatio(budget.allocated_amount, spent);
      if (ratio >= 0.8) {
        alerts.push({
          id: `budget-near-${budget.id}`,
          severity: "warning",
          message: `${budget.name} is at ${Math.round(ratio * 100)}% of its budget`,
        });
      }
    }
  }

  if (allowance != null) {
    const unallocatedAmount = unallocated(allowance, totalAllocated(budgets));
    if (unallocatedAmount > 0) {
      alerts.push({
        id: "unallocated-allowance",
        severity: "info",
        message: `${formatINR(unallocatedAmount)} of your allowance is unallocated`,
      });
    }
  }

  return alerts;
}
