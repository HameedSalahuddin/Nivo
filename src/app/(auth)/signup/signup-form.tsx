"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SvgIcon } from "@/components/ui/SvgIcon";
import { signUp, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = { error: null, message: null };

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          leadingIcon={<SvgIcon name="mail" className="h-5 w-5" />}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          leadingIcon={<SvgIcon name="lock" className="h-5 w-5" />}
        />
      </div>
      {state.error && (
        <p className="font-body-md text-body-md text-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="font-body-md text-body-md text-secondary" role="status">
          {state.message}
        </p>
      )}
      <Button type="submit" fullWidth loading={pending}>
        Create Account
      </Button>
    </form>
  );
}