import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth, formatMonthLabel } from "@/lib/onboarding/helpers";
import { formatINR } from "@/lib/money";
import { spentForBudget, totalAllocated, unallocated } from "@/lib/calc";
import type { Budget, Expense } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { BudgetsManager } from "@/components/budgets/BudgetsManager";

export default async function BudgetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const currentMonth = getCurrentMonth();

  const { data: month } = await supabase
    .from("months")
    .select("id, allowance")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .maybeSingle();
  if (!month) return null;

  const { data: budgets } = await supabase
    .from("budgets")
    .select("id, name, allocated_amount")
    .eq("month_id", month.id)
    .order("allocated_amount", { ascending: false });
  const budgetList = (budgets ?? []) as Budget[];

  const budgetIds = budgetList.map((budget) => budget.id);
  const { data: expenses } =
    budgetIds.length > 0
      ? await supabase
          .from("expenses")
          .select("id, budget_id, amount")
          .in("budget_id", budgetIds)
      : { data: [] };
  const expenseList = (expenses ?? []) as Expense[];

  const allowance = month.allowance;
  const allocated = totalAllocated(budgetList);
  const unallocatedAmount = unallocated(allowance, allocated);
  const allocatedPercent = allowance > 0 ? Math.min((allocated / allowance) * 100, 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Budgets</h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          {formatMonthLabel(currentMonth)}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon="account_balance_wallet"
          iconClass="bg-secondary-container text-on-secondary-container"
          label="Monthly allowance"
          value={formatINR(allowance)}
          sub={`${Math.round(allocatedPercent)}% allocated`}
        />
        <StatCard
          icon="category"
          iconClass="bg-primary-container text-on-primary-container"
          label="Allocated"
          value={formatINR(allocated)}
          sub={`${budgetList.length} branch${budgetList.length === 1 ? "" : "es"}`}
        />
        <StatCard
          icon="trending_up"
          iconClass={
            unallocatedAmount < 0
              ? "bg-sangria-deep/10 text-sangria-deep"
              : "bg-jade-botanical/15 text-jade-botanical"
          }
          label="Unallocated"
          value={
            unallocatedAmount < 0
              ? `-${formatINR(Math.abs(unallocatedAmount))}`
              : formatINR(unallocatedAmount)
          }
          sub={unallocatedAmount < 0 ? "Over-allocated" : "Left to allocate"}
          subClass={unallocatedAmount < 0 ? "text-sangria-deep" : "text-on-surface-variant"}
        />
      </section>

      <BudgetsManager
        budgets={budgetList.map((budget) => ({
          ...budget,
          spent: spentForBudget(expenseList, budget.id),
        }))}
        allowance={allowance}
      />
    </div>
  );
}
