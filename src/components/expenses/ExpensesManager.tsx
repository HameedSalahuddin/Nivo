"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { getCategoryIcon } from "@/lib/categories";
import { formatINR } from "@/lib/money";
import type { Budget, Expense } from "@/lib/types";
import { ExpenseModal } from "./ExpenseModal";

interface ExpensesManagerProps {
  expenses: Expense[];
  budgets: Budget[];
}

function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function ExpensesManager({ expenses, budgets }: ExpensesManagerProps) {
  const searchParams = useSearchParams();
  const addFromUrl = searchParams.get("add") === "1";
  const [modalOpen, setModalOpen] = useState(addFromUrl);
  const [prevAddFromUrl, setPrevAddFromUrl] = useState(addFromUrl);

  if (addFromUrl !== prevAddFromUrl) {
    setPrevAddFromUrl(addFromUrl);
    if (addFromUrl) setModalOpen(true);
  }

  const budgetName = (id: string) => budgets.find((b) => b.id === id)?.name ?? "Unbudgeted";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Expenses</h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            Track your daily spending and see where your money goes.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Icon name="add" className="text-[18px]" />
          Add Expense
        </Button>
      </header>

      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-title-md text-title-md text-on-surface">All expenses</h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {expenses.length} expense{expenses.length === 1 ? "" : "s"}
          </p>
        </div>

        {expenses.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon="receipt_long"
              title="No expenses yet"
              description="Record your first expense with the Add Expense button to start tracking your spending."
              action={
                <Button onClick={() => setModalOpen(true)}>
                  <Icon name="add" className="text-[18px]" />
                  Add Expense
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-2 hidden items-center gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_7.5rem_7.5rem_6rem_6rem]">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Expense</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Category</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Budget</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Date</span>
              <span className="text-right font-label-sm text-label-sm text-on-surface-variant">
                Amount
              </span>
            </div>
            <ul className="divide-y divide-surface-variant">
              {expenses.map((expense) => (
                <li
                  key={expense.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_7.5rem_7.5rem_6rem_6rem] lg:items-center lg:gap-4"
                >
                  <div className="min-w-0 flex-1 lg:col-start-1">
                    <p className="truncate font-title-md text-[16px] text-on-surface">
                      {expense.name}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant lg:hidden">
                      {budgetName(expense.budget_id)}
                    </p>
                  </div>
                  <p className="font-title-md text-[16px] text-on-surface lg:col-start-5 lg:text-right">
                    -{formatINR(expense.amount)}
                  </p>
                  <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 lg:hidden">
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                      <Icon name={getCategoryIcon(expense.category)} className="text-[16px]" />
                      {expense.category}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {formatShortDate(expense.date)}
                    </span>
                  </div>
                  <Chip className="hidden bg-surface-variant text-on-surface-variant lg:col-start-2 lg:flex">
                    <Icon name={getCategoryIcon(expense.category)} className="text-[16px]" />
                    {expense.category}
                  </Chip>
                  <span className="hidden font-body-md text-body-md text-on-surface-variant lg:col-start-3 lg:block">
                    {budgetName(expense.budget_id)}
                  </span>
                  <span className="hidden font-body-md text-body-md text-on-surface-variant lg:col-start-4 lg:block">
                    {formatShortDate(expense.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} budgets={budgets} />
    </div>
  );
}
