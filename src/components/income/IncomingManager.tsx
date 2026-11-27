"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatINR } from "@/lib/money";
import type { IncomingTransaction } from "@/lib/types";
import { IncomingModal } from "./IncomingModal";
import { DeleteIncomingButton } from "./DeleteIncomingButton";

interface IncomingManagerProps {
  transactions: IncomingTransaction[];
  totalIncome: number;
  totalRepayments: number;
  addOnLoad: boolean;
  saved: string | null;
}

function formatShortDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function typeLabel(type: IncomingTransaction["type"]): string {
  return { income: "Income", repayment: "Repayment", transfer: "Transfer" }[type];
}

function typeChipClass(type: IncomingTransaction["type"]): string {
  return {
    income: "bg-secondary-container text-on-secondary-container",
    repayment: "bg-tertiary-container text-on-tertiary-container",
    transfer: "bg-surface-container text-on-surface-variant",
  }[type];
}

export function IncomingManager({
  transactions,
  totalIncome,
  totalRepayments,
  addOnLoad,
  saved,
}: IncomingManagerProps) {
  const [modalOpen, setModalOpen] = useState(addOnLoad);
  const [editing, setEditing] = useState<IncomingTransaction | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (t: IncomingTransaction) => {
    setEditing(t);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {saved && (
          <p className="rounded-lg bg-jade-botanical/10 px-4 py-3 font-body-md text-body-md text-jade-botanical" role="status">
            {saved}
          </p>
        )}

        {/* Summary chips */}
        {(totalIncome > 0 || totalRepayments > 0) && (
          <div className="flex flex-wrap gap-3">
            {totalIncome > 0 && (
              <Chip className="bg-secondary-container text-on-secondary-container">
                <Icon name="savings" className="text-[16px]" />
                {formatINR(totalIncome)} income
              </Chip>
            )}
            {totalRepayments > 0 && (
              <Chip className="bg-tertiary-container text-on-tertiary-container">
                <Icon name="currency_exchange" className="text-[16px]" />
                {formatINR(totalRepayments)} repaid
              </Chip>
            )}
          </div>
        )}

        {/* Transaction list */}
        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-title-md text-title-md text-on-surface">All transactions</h2>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
              </p>
              <Button onClick={openAdd}>
                <Icon name="add" className="text-[18px]" />
                Add money
              </Button>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon="savings"
                title="No transactions yet"
                description="Record money you receive — extra allowance, repayments, or transfers — with the Add money button."
                action={
                  <Button onClick={openAdd}>
                    <Icon name="add" className="text-[18px]" />
                    Add money
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-surface-variant">
              {transactions.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 first:pt-2 last:pb-0"
                >
                  {/* Source + meta */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-title-md text-[16px] text-on-surface">
                      {t.source}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <Chip className={`${typeChipClass(t.type)} px-2 py-0.5 text-[11px]`}>
                        {typeLabel(t.type)}
                      </Chip>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {formatShortDate(t.date)}
                      </span>
                      {t.description && (
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          · {t.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount (green positive) */}
                  <p className="font-title-md text-title-md text-jade-botanical">
                    +{formatINR(t.amount)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => openEdit(t)}
                      className="font-label-sm text-label-sm text-sangria-deep"
                    >
                      Edit
                    </Button>
                    <DeleteIncomingButton id={t.id} source={t.source} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <IncomingModal open={modalOpen} onClose={closeModal} transaction={editing} />
    </>
  );
}
