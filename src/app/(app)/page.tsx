import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth, formatMonthLabel } from "@/lib/onboarding/helpers";
import { formatINR } from "@/lib/money";
import { getCategoryIcon } from "@/lib/categories";
import type { Budget, Expense, IncomingTransaction, Month } from "@/lib/types";
import {
  availableFunds,
  progressRatio,
  remainingForBudget,
  spentByCategory,
  spentForBudget,
  totalAllocated,
  totalIncome,
  totalRepayments,
  totalSpent,
  unallocated,
} from "@/lib/calc";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconCircle } from "@/components/ui/IconCircle";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { MonthFilter } from "@/components/income/MonthFilter";

function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const currentMonth = getCurrentMonth();
  const { data: months } = await supabase
    .from("months")
    .select("id, month, allowance")
    .eq("user_id", user.id)
    .order("month", { ascending: false });
  const monthList = (months ?? []) as Month[];
  const params = await searchParams;
  const requestedMonth = params.month ?? currentMonth;
  const validMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth);
  const availableMonths = Array.from(new Set([currentMonth, ...monthList.map((m) => m.month)])).sort().reverse();
  const selectedMonth = validMonth && availableMonths.includes(requestedMonth)
    ? requestedMonth
    : currentMonth;
  const month = monthList.find((item) => item.month === selectedMonth);
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

  // Fetch incoming transactions for this month
  const { data: incoming } = await supabase
    .from("incoming_transactions")
    .select("id, month_id, amount, source, type, date, description")
    .eq("month_id", month.id)
    .order("date", { ascending: false });
  const incomingList = (incoming ?? []) as IncomingTransaction[];

  const allowance = month.allowance;
  const spent = totalSpent(expenseList);
  const incomeReceived = totalIncome(incomingList);
  const repaymentsReceived = totalRepayments(incomingList);
  const moneyReceived = incomeReceived + repaymentsReceived; // transfers excluded from balance
  const funds = availableFunds(allowance, incomingList, spent);
  const allocated = totalAllocated(budgetList);
  const unallocatedAmount = unallocated(allowance, allocated);
  const spendProgress = allowance > 0 ? Math.min(spent / allowance, 1) : 0;
  const spendPercent = Math.round(spendProgress * 100);
  const categories = spentByCategory(expenseList);
  const recentExpenses = expenseList.slice(0, 6);
  const recentIncoming = incomingList.slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard</h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {formatMonthLabel(selectedMonth)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {allowance > 0 && (
            <Chip className="bg-surface-container text-on-surface-variant">
              <Icon name="trending_up" className="text-[16px]" />
              {spendPercent}% of allowance used
            </Chip>
          )}
          <MonthFilter months={availableMonths} selectedMonth={selectedMonth} />
          <Link
            href={`/income?month=${selectedMonth}&add=1`}
            className="flex items-center gap-2 rounded-lg bg-jade-botanical/15 px-4 py-2 font-label-sm text-label-sm text-jade-botanical transition-all hover:bg-jade-botanical/25 active:scale-95"
          >
            <Icon name="add" className="text-[16px]" />
            Add money
          </Link>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <section
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${moneyReceived > 0 ? "lg:grid-cols-4" : "sm:grid-cols-3"}`}
      >
        <StatCard
          icon="account_balance_wallet"
          iconClass="bg-secondary-container text-on-secondary-container"
          label="Starting budget"
          value={formatINR(allowance)}
          sub={
            unallocatedAmount > 0
              ? `${formatINR(unallocatedAmount)} unallocated`
              : allocated > 0
                ? "Fully allocated"
                : "Not allocated yet"
          }
        />
        {moneyReceived > 0 && (
          <StatCard
            icon="savings"
            iconClass="bg-tertiary-container text-on-tertiary-container"
            label="Money received"
            value={formatINR(moneyReceived)}
            sub={
              incomeReceived > 0 && repaymentsReceived > 0
                ? `${formatINR(incomeReceived)} income · ${formatINR(repaymentsReceived)} repaid`
                : incomeReceived > 0
                  ? `${formatINR(incomeReceived)} additional income`
                  : `${formatINR(repaymentsReceived)} repaid`
            }
          />
        )}
        <StatCard
          icon="receipt_long"
          iconClass="bg-primary-container text-on-primary-container"
          label="Spent this month"
          value={formatINR(spent)}
          sub={allowance > 0 ? `${spendPercent}% of allowance` : "No allowance set"}
        />
        <StatCard
          icon="account_balance"
          iconClass={
            funds < 0
              ? "bg-sangria-deep/10 text-sangria-deep"
              : "bg-jade-botanical/15 text-jade-botanical"
          }
          label="Available funds"
          value={formatINR(Math.max(funds, 0))}
          sub={
            funds < 0
              ? `Over budget by ${formatINR(Math.abs(funds))}`
              : moneyReceived > 0
                ? `Incl. ${formatINR(moneyReceived)} received`
                : "Left to spend"
          }
          subClass={funds < 0 ? "text-sangria-deep" : "text-on-surface-variant"}
        />
      </section>

      {/* ── Budget breakdown + category spending ── */}
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

      {/* ── Recent incoming transactions (only shown if there are any) ── */}
      {recentIncoming.length > 0 && (
        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-title-md text-title-md text-on-surface">Recent money received</h2>
            <Link
              href="/income"
              className="font-label-sm text-label-sm text-jade-botanical hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-2 divide-y divide-surface-variant">
            {recentIncoming.map((t) => (
              <li key={t.id} className="flex items-center gap-4 py-3 first:pt-2 last:pb-0">
                <IconCircle
                  icon="savings"
                  size="md"
                  className="bg-secondary-container text-on-secondary-container"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-title-md text-[16px] text-on-surface">{t.source}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatShortDate(t.date)}
                    {` · ${t.type === "income" ? "Income" : t.type === "repayment" ? "Repayment" : "Transfer"}`}
                    {t.description ? ` · ${t.description}` : ""}
                  </p>
                </div>
                <p className="font-title-md text-title-md text-jade-botanical">
                  +{formatINR(t.amount)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── Recent expenses ── */}
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
