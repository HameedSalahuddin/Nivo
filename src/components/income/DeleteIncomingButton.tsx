"use client";

import { Button } from "@/components/ui/Button";
import { deleteIncoming } from "@/lib/incoming/actions";

interface DeleteIncomingButtonProps {
  id: string;
  source: string;
}

export function DeleteIncomingButton({ id, source }: DeleteIncomingButtonProps) {
  return (
    <form
      action={deleteIncoming}
      onSubmit={(e) => {
        if (!window.confirm(`Delete transaction from "${source}"? This cannot be undone.`)) {
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
