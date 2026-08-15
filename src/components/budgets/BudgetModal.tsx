"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { SvgIcon } from "@/components/ui/SvgIcon";
import {
  createBudget,
  updateBudget,
  type BudgetActionState,
} from "@/lib/budgets/actions";

const initialState: BudgetActionState = { error: null };

export interface BudgetFormValue {
  id: string;
  name: string;
  allocated_amount: number;
}

interface BudgetFormProps {
  budget: BudgetFormValue | null;
  allowance: number;
  onClose: () => void;
}

function BudgetForm({ budget, allowance, onClose }: BudgetFormProps) {
  const [name, setName] = useState(budget?.name ?? "");
  const [amount, setAmount] = useState(budget?.allocated_amount ?? 0);
  const action = budget ? updateBudget : createBudget;
  const [state, formAction, pending] = useActionState(action, initialState);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !pending && state.error === null) {
      submitted.current = false;
      onClose();
    }
  }, [pending, state.error, onClose]);

  const allocatedPercent = allowance > 0 ? Math.min((amount / allowance) * 100, 100) : 0;

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitted.current = true;
      }}
      className="flex flex-col gap-4"
    >
      {budget && <input type="hidden" name="id" value={budget.id} />}
      <input type="hidden" name="amount" value={amount} />
      <div className="flex flex-col gap-2">
        <label
          htmlFor="budget-name"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Budget Name
        </label>
        <Input
          id="budget-name"
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
          htmlFor="budget-amount"
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
      {allocatedPercent > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-pebble-mist">
            <div
              className="h-full rounded-full bg-jade-botanical transition-all duration-300"
              style={{ width: `${allocatedPercent}%` }}
            />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {Math.round(allocatedPercent)}%
          </span>
        </div>
      )}
      {state.error && (
        <p className="font-body-md text-body-md text-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {budget ? "Save changes" : "Add budget"}
        </Button>
      </div>
    </form>
  );
}

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  budget: BudgetFormValue | null;
  allowance: number;
}

export function BudgetModal({ open, onClose, budget, allowance }: BudgetModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={budget ? "Edit budget" : "Add budget"}>
      <BudgetForm key={budget?.id ?? "new"} budget={budget} allowance={allowance} onClose={onClose} />
    </Modal>
  );
}
