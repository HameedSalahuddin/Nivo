import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";
import type { Budget, Expense } from "@/lib/types";
import { ExpensesManager } from "@/components/expenses/ExpensesManager";

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: month } = await supabase
    .from("months")
    .select("id")
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth())
    .maybeSingle();
  if (!month) return null;

  const { data: budgets } = await supabase
    .from("budgets")
    .select("id, name")
    .eq("month_id", month.id)
    .order("name", { ascending: true });
  const budgetList = (budgets ?? []) as Budget[];

  const budgetIds = budgetList.map((budget) => budget.id);
  const { data: expenses } =
    budgetIds.length > 0
      ? await supabase
          .from("expenses")
          .select("id, budget_id, name, amount, category, date")
          .in("budget_id", budgetIds)
          .order("date", { ascending: false })
      : { data: [] };
  const expenseList = (expenses ?? []) as Expense[];

  return <ExpensesManager expenses={expenseList} budgets={budgetList} />;
}
