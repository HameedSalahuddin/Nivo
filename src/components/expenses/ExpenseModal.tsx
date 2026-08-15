"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { CategoryPicker } from "@/components/ui/CategoryPicker";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { SvgIcon } from "@/components/ui/SvgIcon";
import type { Budget, CategoryName } from "@/lib/types";
import { createExpense, type ExpenseActionState } from "@/lib/expenses/actions";

const initialState: ExpenseActionState = { error: null };

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  budgets: Budget[];
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ExpenseForm({ budgets, onClose }: { budgets: Budget[]; onClose: () => void }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [budgetId, setBudgetId] = useState(budgets[0]?.id ?? "");
  const [category, setCategory] = useState<CategoryName>("Other");
  const [date, setDate] = useState(today());
  const [state, formAction, pending] = useActionState(createExpense, initialState);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !pending && state.error === null) {
      submitted.current = false;
      onClose();
    }
  }, [pending, state.error, onClose]);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitted.current = true;
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="budget_id" value={budgetId} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="date" value={date} />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="expense-name"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Name
        </label>
        <Input
          id="expense-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries"
          leadingIcon={<SvgIcon name="tag" className="h-5 w-5" />}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="expense-amount"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-title-md text-title-md text-on-surface-variant">
            ₹
          </span>
          <MoneyInput
            value={amount}
            onChange={setAmount}
            placeholder="0"
            className="w-full rounded-lg border border-outline bg-pebble-mist py-2 pl-10 pr-3 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-sangria-deep focus:ring-4 focus:ring-sangria-deep/10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="expense-budget"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Budget
        </label>
        <select
          id="expense-budget"
          value={budgetId}
          onChange={(e) => setBudgetId(e.target.value)}
          className="w-full rounded-lg border border-outline bg-pebble-mist px-3 py-2 font-body-md text-body-md text-on-surface outline-none transition-all focus:border-sangria-deep focus:ring-4 focus:ring-sangria-deep/10"
        >
          <option value="" disabled>
            Select a budget
          </option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">Category</span>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="expense-date"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Date
        </label>
        <Input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {state.error && (
        <p className="font-body-md text-body-md text-error" role="alert">
          {state.error}
        </p>
      )}
      {budgets.length === 0 && (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add a budget branch before recording expenses.
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={pending} disabled={budgets.length === 0}>
          Add Expense
        </Button>
      </div>
    </form>
  );
}

export function ExpenseModal({ open, onClose, budgets }: ExpenseModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add Expense">
      <ExpenseForm budgets={budgets} onClose={onClose} />
    </Modal>
  );
}
