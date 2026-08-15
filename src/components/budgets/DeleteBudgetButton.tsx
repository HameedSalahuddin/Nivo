"use client";

import { Button } from "@/components/ui/Button";
import { deleteBudget } from "@/lib/budgets/actions";

interface DeleteBudgetButtonProps {
  id: string;
  name: string;
}

export function DeleteBudgetButton({ id, name }: DeleteBudgetButtonProps) {
  return (
    <form
      action={deleteBudget}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${name}"? Its expenses will also be removed.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        className="font-label-sm text-label-sm text-error hover:bg-error/10 hover:text-error"
      >
        Delete
      </Button>
    </form>
  );
}
