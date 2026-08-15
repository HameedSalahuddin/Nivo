"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { progressRatio, remainingForBudget } from "@/lib/calc";
import { formatINR } from "@/lib/money";
import { BudgetModal, type BudgetFormValue } from "./BudgetModal";
import { DeleteBudgetButton } from "./DeleteBudgetButton";

interface BudgetRow {
  id: string;
  name: string;
  allocated_amount: number;
  spent: number;
}

interface BudgetsManagerProps {
  budgets: BudgetRow[];
  allowance: number;
}

export function BudgetsManager({ budgets, allowance }: BudgetsManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetFormValue | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (budget: BudgetRow) => {
    setEditing({
      id: budget.id,
      name: budget.name,
      allocated_amount: budget.allocated_amount,
    });
    setModalOpen(true);
  };

  return (
    <>
      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-title-md text-title-md text-on-surface">Budget branches</h2>
          <Button onClick={openAdd}>
            <Icon name="add" className="text-[18px]" />
            Add budget
          </Button>
        </div>

        {budgets.length === 0 ? (
          <EmptyState
            icon="account_balance_wallet"
            title="No budgets yet"
            description="Add your first budget branch to start planning your allowance."
          />
        ) : (
          <ul className="mt-2">
            {budgets.map((budget) => {
              const ratio = progressRatio(budget.allocated_amount, budget.spent);
              const remaining = remainingForBudget(budget.allocated_amount, budget.spent);
              return (
                <li
                  key={budget.id}
                  className="flex flex-wrap items-center gap-4 border-b border-surface-variant py-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-title-md text-[16px] text-on-surface">
                        {budget.name}
                      </p>
                      <p className="font-title-md text-title-md text-on-surface">
                        {formatINR(budget.allocated_amount)}
                      </p>
                    </div>
                    <ProgressBar value={ratio} warnThreshold={0.8} className="mt-2" />
                    <p
                      className={`mt-1 font-label-sm text-label-sm ${remaining < 0 ? "text-sangria-deep" : "text-on-surface-variant"}`}
                    >
                      {formatINR(budget.spent)} spent ·{" "}
                      {remaining < 0
                        ? `over by ${formatINR(Math.abs(remaining))}`
                        : `${formatINR(remaining)} left`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => openEdit(budget)}
                      className="font-label-sm text-label-sm text-sangria-deep"
                    >
                      Edit
                    </Button>
                    <DeleteBudgetButton id={budget.id} name={budget.name} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        budget={editing}
        allowance={allowance}
      />
    </>
  );
}
