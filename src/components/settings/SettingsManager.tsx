"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { signOut } from "@/lib/auth/actions";
import {
  updateAllowance,
  type SettingsActionState,
} from "@/lib/settings/actions";

const initialState: SettingsActionState = { error: null };

interface SettingsManagerProps {
  allowance: number;
  email: string;
  monthLabel: string;
}

export function SettingsManager({ allowance, email, monthLabel }: SettingsManagerProps) {
  const [amount, setAmount] = useState(allowance);
  const [state, formAction, pending] = useActionState(updateAllowance, initialState);

  const dirty = amount !== allowance;

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-title-md text-title-md text-on-surface">
              Monthly allowance
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Your total money available for {monthLabel}.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="allowance" value={amount} />
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

            {state.error && (
              <p className="font-body-md text-body-md text-error" role="alert">
                {state.error}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" loading={pending} disabled={!dirty}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-title-md text-title-md text-on-surface">Account</h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Signed in as {email}.
            </p>
          </div>

          <form action={signOut}>
            <Button type="submit" variant="outline" fullWidth>
              <Icon name="logout" className="text-[18px]" />
              Sign out
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
