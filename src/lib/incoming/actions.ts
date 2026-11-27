"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { INCOMING_TYPES, type IncomingType } from "@/lib/types";

export interface IncomingActionState {
  error: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getUserId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Return the month row for a received date, creating a zero-starting-budget
 * month when the user is recording a historical or future transaction. */
async function getOrCreateMonthId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  date: string,
): Promise<{ id: string | null; error: string | null }> {
  const monthKey = date.slice(0, 7);
  const { data: existing, error: lookupError } = await supabase
    .from("months")
    .select("id")
    .eq("user_id", userId)
    .eq("month", monthKey)
    .maybeSingle();
  if (lookupError) return { id: null, error: lookupError.message };
  if (existing) return { id: existing.id, error: null };

  const { data: created, error: insertError } = await supabase
    .from("months")
    .insert({ user_id: userId, month: monthKey, allowance: 0 })
    .select("id")
    .single();
  if (!insertError && created) return { id: created.id, error: null };

  // If another request created the same month concurrently, read that row.
  if (insertError?.code === "23505") {
    const { data: raced } = await supabase
      .from("months")
      .select("id")
      .eq("user_id", userId)
      .eq("month", monthKey)
      .maybeSingle();
    if (raced) return { id: raced.id, error: null };
  }
  return { id: null, error: insertError?.message ?? "Could not prepare this month." };
}

function parsePositiveAmount(value: string): number | null {
  const amount = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
}

function isIncomingType(value: string): value is IncomingType {
  return (INCOMING_TYPES as readonly string[]).includes(value);
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/income");
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createIncoming(
  _state: IncomingActionState,
  formData: FormData,
): Promise<IncomingActionState> {
  const amount = parsePositiveAmount(String(formData.get("amount") ?? ""));
  const source = String(formData.get("source") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const date = String(formData.get("date") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (amount === null) return { error: "Enter a valid amount." };
  if (!source) return { error: "Enter where the money came from." };
  if (source.length > 120) return { error: "Keep the source under 120 characters." };
  if (!isIncomingType(type)) return { error: "Choose a transaction type." };
  if (!isValidDate(date)) return { error: "Enter a valid date." };
  if (description && description.length > 500) return { error: "Keep the description under 500 characters." };

  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { error: "You must be signed in." };
  const { id: monthId, error: monthError } = await getOrCreateMonthId(supabase, userId, date);
  if (!monthId) return { error: monthError ?? "Could not prepare this month." };

  const { error } = await supabase.from("incoming_transactions").insert({
    month_id: monthId,
    amount,
    source,
    type,
    date,
    description,
  });

  if (error) return { error: error.message };

  revalidateAll();
  redirect(`/income?month=${date.slice(0, 7)}&saved=created`);
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateIncoming(
  _state: IncomingActionState,
  formData: FormData,
): Promise<IncomingActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing transaction ID." };

  const amount = parsePositiveAmount(String(formData.get("amount") ?? ""));
  const source = String(formData.get("source") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const date = String(formData.get("date") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (amount === null) return { error: "Enter a valid amount." };
  if (!source) return { error: "Enter where the money came from." };
  if (source.length > 120) return { error: "Keep the source under 120 characters." };
  if (!isIncomingType(type)) return { error: "Choose a transaction type." };
  if (!isValidDate(date)) return { error: "Enter a valid date." };
  if (description && description.length > 500) return { error: "Keep the description under 500 characters." };

  const supabase = await createClient();
  const userId = await getUserId(supabase);
  if (!userId) return { error: "You must be signed in." };
  const { id: monthId, error: monthError } = await getOrCreateMonthId(supabase, userId, date);
  if (!monthId) return { error: monthError ?? "Could not prepare this month." };

  // RLS ensures the row belongs to the authenticated user's month.
  const { error } = await supabase
    .from("incoming_transactions")
    .update({ month_id: monthId, amount, source, type, date, description, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateAll();
  redirect(`/income?month=${date.slice(0, 7)}&saved=updated`);
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteIncoming(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // RLS ensures only the owner's rows are deletable.
  const { error } = await supabase.from("incoming_transactions").delete().eq("id", id);

  if (error) return;
  revalidateAll();
}
