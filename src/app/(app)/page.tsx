import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth, formatMonthLabel } from "@/lib/onboarding/helpers";
import { formatINR } from "@/lib/money";
import { getCategoryIcon } from "@/lib/categories";
import type { Budget, Expense } from "@/lib/types";
import {
  progressRatio,
  remainingForBudget,
  spentByCategory,
  spentForBudget,
  totalAllocated,
  totalRemaining,
  totalSpent,
  unallocated,
} from "@/lib/calc";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconCircle } from "@/components/ui/IconCircle";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface StatCardProps {
  icon: string;
  iconClass: string;
  label: string;
  value: string;
  sub?: string;
  subClass?: string;
}

function StatCard({ icon, iconClass, label, value, sub, subClass }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 md:p-5">
      <IconCircle icon={icon} className={iconClass} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
        <p className="mt-0.5 font-display-lg text-[30px] leading-tight text-on-surface md:text-[34px]">
          {value}
        </p>
        {sub && (
          <p className={`mt-0.5 font-label-sm text-label-sm ${subClass ?? "text-on-surface-variant"}`}>
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
}

function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
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
          .select("id, budget_id, name, amount, category, date")
          .in("budget_id", budgetIds)
          .order("date", { ascending: false })
      : { data: [] };
  const expenseList = (expenses ?? []) as Expense[];

  const allowance = month.allowance;
  const spent = totalSpent(expenseList);
  const remaining = totalRemaining(allowance, spent);
  const allocated = totalAllocated(budgetList);
  const unallocatedAmount = unallocated(allowance, allocated);
  const spendProgress = allowance > 0 ? Math.min(spent / allowance, 1) : 0;
  const spendPercent = Math.round(spendProgress * 100);
  const categories = spentByCategory(expenseList);
  const recentExpenses = expenseList.slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard</h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {formatMonthLabel(currentMonth)}
          </p>
        </div>
        {allowance > 0 && (
          <Chip className="bg-surface-container text-on-surface-variant">
            <Icon name="trending_up" className="text-[16px]" />
            {spendPercent}% of allowance used
          </Chip>
        )}
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon="account_balance_wallet"
          iconClass="bg-secondary-container text-on-secondary-container"
          label="Monthly allowance"
          value={formatINR(allowance)}
          sub={
            unallocatedAmount > 0
              ? `${formatINR(unallocatedAmount)} unallocated`
              : allocated > 0
                ? "Fully allocated"
                : "Not allocated yet"
          }
        />
        <StatCard
          icon="receipt_long"
          iconClass="bg-primary-container text-on-primary-container"
          label="Spent this month"
          value={formatINR(spent)}
          sub={
            allowance > 0
              ? `${spendPercent}% of allowance`
              : "No allowance set"
          }
        />
        <StatCard
          icon="trending_up"
          iconClass="bg-jade-botanical/15 text-jade-botanical"
          label="Remaining"
          value={formatINR(Math.max(remaining, 0))}
          sub={
            remaining < 0
              ? `Over budget by ${formatINR(Math.abs(remaining))}`
              : "Left to spend"
          }
          subClass={remaining < 0 ? "text-sangria-deep" : "text-on-surface-variant"}
        />
      </section>

      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <Card className="flex flex-col gap-6 p-5 md:p-6 lg:col-span-3">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-title-md text-title-md text-on-surface">Budgets</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {formatINR(spent)} of {formatINR(allowance)} spent
              </p>
            </div>
            <ProgressBar value={spendProgress} warnThreshold={0.8} className="mt-3" />
          </div>

          {budgetList.length === 0 ? (
            <EmptyState
              icon="account_balance_wallet"
              title="No budgets yet"
              description="Add budget branches to plan your allowance."
            />
          ) : (
            <ul className="flex flex-col gap-5">
              {budgetList.map((budget) => {
                const budgetSpent = spentForBudget(expenseList, budget.id);
                const budgetRemaining = remainingForBudget(budget.allocated_amount, budgetSpent);
                const ratio = progressRatio(budget.allocated_amount, budgetSpent);
                return (
                  <li key={budget.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-title-md text-[16px] text-on-surface">{budget.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {formatINR(budgetSpent)} / {formatINR(budget.allocated_amount)}
                      </p>
                    </div>
                    <ProgressBar value={ratio} warnThreshold={0.8} className="mt-2" />
                    <p
                      className={`mt-1 font-label-sm text-label-sm ${budgetRemaining < 0 ? "text-sangria-deep" : "text-on-surface-variant"}`}
                    >
                      {budgetRemaining < 0
                        ? `Over budget by ${formatINR(Math.abs(budgetRemaining))}`
                        : `${formatINR(budgetRemaining)} left`}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-5 md:p-6 lg:col-span-2">
          <h2 className="font-title-md text-title-md text-on-surface">Spending by category</h2>
          {categories.length === 0 ? (
            <EmptyState
              icon="category"
              title="No spending yet"
              description="Category breakdown will appear here once you record expenses."
            />
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {categories.map((category) => {
                const share = spent > 0 ? category.total / spent : 0;
                return (
                  <li key={category.category} className="flex items-center gap-3">
                    <IconCircle
                      icon={getCategoryIcon(category.category)}
                      size="sm"
                      className="bg-surface-variant text-on-surface-variant"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-title-md text-[16px] text-on-surface">
                          {category.category}
                        </p>
                        <p className="font-title-md text-[16px] text-on-surface">
                          {formatINR(category.total)}
                        </p>
                      </div>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-pebble-mist">
                        <div
                          className="h-full rounded-full bg-jade-botanical"
                          style={{ width: `${Math.round(share * 100)}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-title-md text-title-md text-on-surface">Recent expenses</h2>
          <Link
            href="/expenses"
            className="font-label-sm text-label-sm text-sangria-deep hover:underline"
          >
            View all
          </Link>
        </div>
        {recentExpenses.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="No expenses yet"
            description="Record your first expense to start tracking."
          />
        ) : (
          <ul className="mt-2 divide-y divide-surface-variant">
            {recentExpenses.map((expense) => {
              const budget = budgetList.find((b) => b.id === expense.budget_id);
              return (
                <li key={expense.id} className="flex items-center gap-4 py-3 first:pt-2 last:pb-0">
                  <IconCircle
                    icon={getCategoryIcon(expense.category)}
                    size="md"
                    className="bg-surface-variant text-on-surface-variant"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-title-md text-[16px] text-on-surface">
                      {expense.name}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {formatShortDate(expense.date)}
                      {budget ? ` · ${budget.name}` : ""}
                    </p>
                  </div>
                  <p className="font-title-md text-title-md text-on-surface">
                    -{formatINR(expense.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
