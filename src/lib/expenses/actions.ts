"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";
import { isCategory } from "@/lib/categories";

export interface ExpenseActionState {
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

export async function createExpense(
  _state: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const supabase = await createClient();
  const monthId = await getCurrentMonthId(supabase);
  if (!monthId) return { error: "Set your monthly allowance first." };

  const name = String(formData.get("name") ?? "").trim();
  const amount = parsePositiveAmount(String(formData.get("amount") ?? ""));
  const budgetId = String(formData.get("budget_id") ?? "");
  const category = String(formData.get("category") ?? "");
  const date = String(formData.get("date") ?? "");

  if (!name) return { error: "Enter a name for this expense." };
  if (amount === null) return { error: "Enter a valid amount." };
  if (!budgetId) return { error: "Choose a budget for this expense." };
  if (!isCategory(category)) return { error: "Choose a category for this expense." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Enter a valid date." };

  const { data: budget } = await supabase
    .from("budgets")
    .select("id")
    .eq("id", budgetId)
    .eq("month_id", monthId)
    .maybeSingle();
  if (!budget) return { error: "That budget no longer exists." };

  const { error } = await supabase.from("expenses").insert({
    budget_id: budgetId,
    name,
    amount,
    category,
    date,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/expenses");
  revalidatePath("/budgets");
  return { error: null };
}
