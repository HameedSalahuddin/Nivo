import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";
import { FirstBudgetForm } from "./first-budget-form";

export default async function FirstBudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");

  const { data: month, error } = await supabase
    .from("months")
    .select("id, allowance")
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth())
    .maybeSingle();
  if (error) redirect("/");
  if (!month) redirect("/allowance");

  const { data: budgets } = await supabase
    .from("budgets")
    .select("id")
    .eq("month_id", month.id)
    .limit(1);
  if (budgets && budgets.length > 0) redirect("/");

  return <FirstBudgetForm allowance={month.allowance} />;
}