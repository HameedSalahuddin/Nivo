import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";
import { buildAlerts } from "@/lib/notifications";
import type { Budget, Expense } from "@/lib/types";
import { MobileNav } from "./MobileNav";
import { SideNav } from "./SideNav";
import { TopAppBar } from "./TopAppBar";

export async function AppShell({ children }: { children: ReactNode }) {
  let alerts: ReturnType<typeof buildAlerts> = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: month } = await supabase
        .from("months")
        .select("id, allowance")
        .eq("user_id", user.id)
        .eq("month", getCurrentMonth())
        .maybeSingle();
      if (month) {
        const { data: budgets } = await supabase
          .from("budgets")
          .select("id, name, allocated_amount")
          .eq("month_id", month.id);
        const budgetList = (budgets ?? []) as Budget[];

        const budgetIds = budgetList.map((budget) => budget.id);
        const { data: expenses } =
          budgetIds.length > 0
            ? await supabase
                .from("expenses")
                .select("id, budget_id, amount")
                .in("budget_id", budgetIds)
            : { data: [] };

        alerts = buildAlerts(budgetList, (expenses ?? []) as Expense[], month.allowance);
      }
    }
  } catch {
    // Notifications are non-critical; the shell still renders without them.
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-pebble-mist">
      <SideNav />
      <div className="flex w-full flex-col md:ml-64">
        <TopAppBar alerts={alerts} />
        <main className="flex-1 px-margin-mobile py-4 pb-24 md:px-margin-desktop md:py-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}