"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error: string | null;
  message: string | null;
}

export async function signUp(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message, message: null };

  if (!data.session) {
    // Email confirmation is enabled in the Supabase project.
    return {
      error: null,
      message: "Check your email to confirm your account, then log in.",
    };
  }

  redirect("/");
}

export async function signIn(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message, message: null };

  redirect("/");
}

export async function requestPasswordReset(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address.", message: null };

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `${protocol}://${host}` : null);
  if (!siteUrl) {
    return { error: "Could not determine the site URL. Please try again later.", message: null };
  }

  const redirectTo = new URL("/auth/callback?next=/reset-password", siteUrl).toString();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) return { error: "Could not send the reset email. Please try again.", message: null };

  // Keep the response the same for existing and unknown addresses.
  return {
    error: null,
    message: "If an account uses that email, you’ll receive a password reset link shortly.",
  };
}

export async function updatePassword(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: "Your password must be at least 6 characters.", message: null };
  }
  if (password !== confirmation) {
    return { error: "The passwords do not match.", message: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message, message: null };

  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/welcome");
}
