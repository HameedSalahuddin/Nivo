"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "./helpers";

export interface OnboardingState {
  error: string | null;
}

export async function setAllowance(
  _state: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const allowance = Number(formData.get("allowance") ?? 0);
  if (!Number.isFinite(allowance) || allowance <= 0) {
    return { error: "Enter a valid allowance amount." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("months").insert({
    user_id: user.id,
    month: getCurrentMonth(),
    allowance: Math.round(allowance),
  });

  if (error) return { error: error.message };

  redirect("/first-budget");
}

export async function createFirstBudget(
  _state: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const name = String(formData.get("name") ?? "").trim();
  const allocated = Number(formData.get("amount") ?? 0);
  if (!name) return { error: "Give your budget branch a name." };
  if (!Number.isFinite(allocated) || allocated <= 0) {
    return { error: "Enter a valid amount." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: month, error: monthError } = await supabase
    .from("months")
    .select("id")
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth())
    .maybeSingle();
  if (monthError) return { error: monthError.message };
  if (!month) redirect("/allowance");

  const { error } = await supabase.from("budgets").insert({
    month_id: month.id,
    name,
    allocated_amount: Math.round(allocated),
  });

  if (error) return { error: error.message };

  redirect("/");
}