import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth } from "@/lib/onboarding/helpers";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/welcome");

  const { data: month } = await supabase
    .from("months")
    .select("id")
    .eq("user_id", user.id)
    .eq("month", getCurrentMonth())
    .maybeSingle();
  if (!month) redirect("/allowance");

  return <AppShell>{children}</AppShell>;
}