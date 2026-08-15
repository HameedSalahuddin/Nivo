"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";

export interface SettingsActionState {
  error: string | null;
}

// Updates the current month's allowance, which feeds every derived number on
// the dashboard, budgets page, and settings page itself.
export async function updateAllowance(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const amount = Number(String(formData.get("allowance") ?? "").replace(/[^\d]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid allowance amount." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("months")
    .update({ allowance: Math.round(amount) })
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth());

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/budgets");
  revalidatePath("/settings");
  return { error: null };
}
