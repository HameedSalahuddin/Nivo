import { createClient } from "@/lib/supabase/server";
import { getCurrentMonth, formatMonthLabel } from "@/lib/onboarding/helpers";
import { formatINR } from "@/lib/money";
import { totalIncome, totalRepayments, totalIncoming } from "@/lib/calc";
import type { IncomingTransaction, Month } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { IncomingManager } from "@/components/income/IncomingManager";
import { MonthFilter } from "@/components/income/MonthFilter";

interface IncomePageProps {
  searchParams: Promise<{ month?: string; add?: string; saved?: string }>;
}

export default async function IncomePage({ searchParams }: IncomePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const currentMonth = getCurrentMonth();
  const { data: months } = await supabase
    .from("months")
    .select("id, month, allowance")
    .eq("user_id", user.id)
    .order("month", { ascending: false });
  const monthList = (months ?? []) as Month[];
  const params = await searchParams;
  const requestedMonth = params.month ?? currentMonth;
  const validMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth);
  const availableMonths = Array.from(new Set([currentMonth, ...monthList.map((m) => m.month)])).sort().reverse();
  const selectedMonth = validMonth && availableMonths.includes(requestedMonth)
    ? requestedMonth
    : currentMonth;
  const month = monthList.find((item) => item.month === selectedMonth);

  const { data: incoming } = month
    ? await supabase
        .from("incoming_transactions")
        .select("id, month_id, amount, source, type, date, description")
        .eq("month_id", month.id)
        .order("date", { ascending: false })
    : { data: [] };
  const transactionList = (incoming ?? []) as IncomingTransaction[];

  const incomeTotal = totalIncome(transactionList);
  const repaymentsTotal = totalRepayments(transactionList);
  const incomingTotal = totalIncoming(transactionList);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Money Received</h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {formatMonthLabel(selectedMonth)}
          </p>
        </div>
        <MonthFilter months={availableMonths} selectedMonth={selectedMonth} />
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon="savings"
          iconClass="bg-secondary-container text-on-secondary-container"
          label="Income received"
          value={formatINR(incomeTotal)}
          sub="Allowance top-ups, scholarships, gifts"
        />
        <StatCard
          icon="currency_exchange"
          iconClass="bg-tertiary-container text-on-tertiary-container"
          label="Repayments"
          value={formatINR(repaymentsTotal)}
          sub="Money friends paid you back"
        />
        <StatCard
          icon="account_balance"
          iconClass="bg-surface-container text-on-surface-variant"
          label="Total received"
          value={formatINR(incomingTotal)}
          sub={`${transactionList.length} transaction${transactionList.length === 1 ? "" : "s"}`}
        />
      </section>

      <IncomingManager
        transactions={transactionList}
        totalIncome={incomeTotal}
        totalRepayments={repaymentsTotal}
        addOnLoad={params.add === "1"}
        saved={params.saved === "created" ? "Money received saved." : params.saved === "updated" ? "Transaction updated." : null}
      />
    </div>
  );
}
