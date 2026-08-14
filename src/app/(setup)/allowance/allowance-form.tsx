"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { setAllowance, type OnboardingState } from "@/lib/onboarding/actions";

const initialState: OnboardingState = { error: null };

export function AllowanceForm({ monthLabel }: { monthLabel: string }) {
  const [amount, setAmount] = useState(0);
  const [state, formAction, pending] = useActionState(setAllowance, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="allowance" value={amount} />
      <div className="mb-6 rounded-full border border-outline-variant/30 bg-surface-container-low px-6 py-2 text-center font-label-sm text-label-sm text-on-surface-variant shadow-sm">
        {monthLabel}
      </div>
      <div className="mb-6 flex w-full items-baseline justify-center gap-1">
        <span className="font-display-lg text-display-lg select-none text-on-surface-variant">
          ₹
        </span>
        <MoneyInput
          value={amount}
          onChange={setAmount}
          placeholder="0"
          className="w-full max-w-[280px] border-0 border-b-2 border-outline-variant bg-transparent p-0 pb-1 text-center font-display-lg text-display-lg text-sangria-deep shadow-none outline-none transition-colors duration-200 hover:border-sangria-deep/50 focus:border-sangria-deep focus:ring-0"
        />
      </div>
      <p className="mx-auto mb-6 max-w-sm text-center font-body-md text-body-md text-on-surface-variant">
        This is your total money available for the month.
      </p>
      {state.error && (
        <p className="mb-6 text-center font-body-md text-body-md text-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          loading={pending}
          className="rounded-lg px-8 py-3"
        >
          <span>Continue</span>
          <SvgIcon name="arrow_forward" className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}