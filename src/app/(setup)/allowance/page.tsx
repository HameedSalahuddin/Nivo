import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMonthLabel, getCurrentMonth } from "@/lib/onboarding/helpers";
import { AllowanceForm } from "./allowance-form";

export default async function AllowancePage() {
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
  if (month) redirect("/");

  return (
    <main className="flex min-h-screen flex-col bg-pebble-mist font-body-md text-on-surface">
      <div className="flex flex-grow items-center justify-center p-margin-mobile md:p-margin-desktop">
        <div className="w-full max-w-3xl">
          <header className="mb-8 md:mb-12">
            <Link
              href="/welcome"
              className="group mb-6 inline-flex items-center gap-1 text-on-surface-variant transition-colors hover:text-sangria-deep"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform group-active:-translate-x-1">
                arrow_back
              </span>
              <span className="font-label-sm text-label-sm">Back</span>
            </Link>
            <h1 className="mb-1 font-headline-lg text-headline-lg text-on-surface">
              How much do you have this month?
            </h1>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Enter your monthly allowance. You can change it whenever your
              allowance changes.
            </p>
          </header>
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-transparent bg-surface-container-lowest p-8 shadow-[0_2px_16px_rgba(122,18,41,0.04)] transition-colors duration-300 hover:border-sangria-deep/10 md:p-12">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-sangria-deep/20 via-sangria-deep to-sangria-deep/20 opacity-50" />
            <AllowanceForm monthLabel={formatMonthLabel(getCurrentMonth())} />
          </div>
        </div>
      </div>
    </main>
  );
}