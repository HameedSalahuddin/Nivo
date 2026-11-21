"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = { error: null, message: null };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant">
          New password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          placeholder="At least 6 characters"
          leadingIcon={<SvgIcon name="lock" className="h-5 w-5" />}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="font-label-sm text-label-sm text-on-surface-variant">
          Confirm new password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          placeholder="Enter it again"
          leadingIcon={<SvgIcon name="lock" className="h-5 w-5" />}
        />
      </div>
      {state.error && <p className="font-body-md text-body-md text-error" role="alert">{state.error}</p>}
      <Button type="submit" fullWidth loading={pending}>
        Update password
      </Button>
    </form>
  );
}
