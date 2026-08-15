import { createClient } from "@/lib/supabase/server";
import { formatMonthLabel, getCurrentMonth } from "@/lib/onboarding/helpers";
import { SettingsManager } from "@/components/settings/SettingsManager";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const currentMonth = getCurrentMonth();

  const { data: month } = await supabase
    .from("months")
    .select("allowance")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .maybeSingle();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Settings
        </h1>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          {formatMonthLabel(currentMonth)}
        </p>
      </header>

      <SettingsManager
        allowance={month?.allowance ?? 0}
        email={user.email ?? ""}
        monthLabel={formatMonthLabel(currentMonth)}
      />
    </div>
  );
}
