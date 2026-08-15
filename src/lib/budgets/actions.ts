"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";

export interface BudgetActionState {
  error: string | null;
}

async function getCurrentMonthId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("months")
    .select("id")
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth())
    .maybeSingle();
  return data?.id ?? null;
}

function parsePositiveAmount(value: string): number | null {
  const amount = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
}

export async function createBudget(
  _state: BudgetActionState,
  formData: FormData,
): Promise<BudgetActionState> {
  const supabase = await createClient();
  const monthId = await getCurrentMonthId(supabase);
  if (!monthId) return { error: "Set your monthly allowance first." };

  const name = String(formData.get("name") ?? "").trim();
  const amount = parsePositiveAmount(String(formData.get("amount") ?? ""));
  if (!name) return { error: "Enter a budget name." };
  if (amount === null) return { error: "Enter a valid amount." };

  const { error } = await supabase.from("budgets").insert({
    month_id: monthId,
    name,
    allocated_amount: amount,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A budget with that name already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/budgets");
  return { error: null };
}

export async function updateBudget(
  _state: BudgetActionState,
  formData: FormData,
): Promise<BudgetActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing budget." };

  const name = String(formData.get("name") ?? "").trim();
  const amount = parsePositiveAmount(String(formData.get("amount") ?? ""));
  if (!name) return { error: "Enter a budget name." };
  if (amount === null) return { error: "Enter a valid amount." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("budgets")
    .update({ name, allocated_amount: amount })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A budget with that name already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/budgets");
  return { error: null };
}

export async function deleteBudget(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("budgets").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/budgets");
}
