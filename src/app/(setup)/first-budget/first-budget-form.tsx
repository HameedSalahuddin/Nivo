"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { formatINR } from "@/lib/money";
import { createFirstBudget, type OnboardingState } from "@/lib/onboarding/actions";

const initialState: OnboardingState = { error: null };

export function FirstBudgetForm({ allowance }: { allowance: number }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [state, formAction, pending] = useActionState(
    createFirstBudget,
    initialState,
  );

  const allocatedPercent = allowance > 0 ? Math.min((amount / allowance) * 100, 100) : 0;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background font-body-md text-on-background md:flex-row">
      <div className="relative z-10 flex w-full flex-col justify-center bg-surface px-margin-mobile py-12 md:w-1/2 md:px-margin-desktop">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 font-display-lg text-display-lg text-sangria-deep">
              Give your money a purpose.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Create your first budget branch and decide how much you want to
              set aside.
            </p>
          </div>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="amount" value={amount} />
            <div className="space-y-2">
              <label
                htmlFor="budget-name"
                className="block font-label-sm text-label-sm font-semibold text-on-surface"
              >
                Budget Name
              </label>
              <Input
                id="budget-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Groceries"
                leadingIcon={<SvgIcon name="tag" className="h-5 w-5" />}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="budget-amount"
                className="block font-label-sm text-label-sm font-semibold text-on-surface"
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
            {state.error && (
              <p className="font-body-md text-body-md text-error" role="alert">
                {state.error}
              </p>
            )}
            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                loading={pending}
                className="rounded-xl py-3 font-title-md text-title-md shadow-[0_4px_14px_rgba(122,18,41,0.25)]"
              >
                Go to Nivo
                <SvgIcon name="arrow_forward" className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-pebble-mist md:flex">
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-surface-bright opacity-50 blur-3xl mix-blend-multiply"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full bg-secondary-fixed opacity-20 blur-3xl mix-blend-multiply"
        />
        <div className="relative flex w-full max-w-lg flex-col items-center">
          <div className="absolute -top-12 flex animate-bounce items-center gap-2 rounded-full bg-surface-container-lowest px-6 py-2 shadow-[0_8px_32px_rgba(122,18,41,0.08)]">
            <SvgIcon name="check" className="h-5 w-5 text-jade-botanical" />
            <span className="font-title-md text-title-md text-sangria-deep">
              Your first branch is ready 🎉
            </span>
          </div>
          <div className="glass-panel relative z-10 mt-16 w-64 rounded-xl p-6 text-center">
            <span className="mb-1 block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Available Allowance
            </span>
            <span className="block font-headline-lg text-headline-lg text-on-surface">
              {formatINR(allowance)}
            </span>
          </div>
          <svg
            className="z-0 -my-2 text-jade-botanical"
            height="80"
            viewBox="0 0 60 80"
            width="60"
            aria-hidden="true"
          >
            <path
              className="animate-connector"
              d="M30 0 C30 40, 30 40, 30 80"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth={4}
            />
          </svg>
          <div className="relative z-10 w-80 rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-[0_16px_40px_rgba(122,18,41,0.08)] transition-colors hover:border-sangria-deep/20">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-sangria-deep">
                <SvgIcon name="cart" className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface">
                  {name || "Groceries"}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Monthly Budget
                </p>
              </div>
            </div>
            <div className="mb-4 flex items-end justify-between">
              <span className="font-headline-lg text-headline-lg text-sangria-deep">
                {formatINR(amount)}
              </span>
            </div>
            <div className="mb-1 h-3 w-full overflow-hidden rounded-full bg-pebble-mist">
              <div
                className="h-full rounded-full bg-jade-botanical transition-all duration-300"
                style={{ width: `${allocatedPercent}%` }}
              />
            </div>
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>₹0 spent</span>
              <span>{formatINR(amount)} left</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}