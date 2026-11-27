"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { SvgIcon } from "@/components/ui/SvgIcon";
import {
  createIncoming,
  updateIncoming,
  type IncomingActionState,
} from "@/lib/incoming/actions";
import type { IncomingTransaction, IncomingType } from "@/lib/types";

const initialState: IncomingActionState = { error: null };

export interface IncomingFormValue {
  id: string;
  amount: number;
  source: string;
  type: IncomingType;
  date: string;
  description: string;
}

// ── Quick-pick source chips ───────────────────────────────────────────────────

const SOURCE_PRESETS = ["Dad", "Mom", "Parents", "Friend", "Scholarship", "Part-time work", "Gift"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function typeLabel(t: IncomingType): string {
  return { income: "Income", repayment: "Repayment", transfer: "Transfer" }[t];
}

function typeDescription(t: IncomingType): string {
  return {
    income: "New money — allowance, scholarship, gift, earnings",
    repayment: "Friend paying you back or reimbursing a shared expense",
    transfer: "Moving money from another account of yours",
  }[t];
}

// ── Form ──────────────────────────────────────────────────────────────────────

interface FormProps {
  initial: IncomingFormValue | null;
  onClose: () => void;
}

function IncomingForm({ initial, onClose }: FormProps) {
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [source, setSource] = useState(initial?.source ?? "");
  const [customSource, setCustomSource] = useState(false);
  const [type, setType] = useState<IncomingType>(initial?.type ?? "income");
  const [date, setDate] = useState(initial?.date ?? today());
  const [description, setDescription] = useState(initial?.description ?? "");

  const action = initial ? updateIncoming : createIncoming;
  const [state, formAction, pending] = useActionState(action, initialState);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !pending && state.error === null) {
      submitted.current = false;
      onClose();
    }
  }, [pending, state.error, onClose]);

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitted.current = true;
      }}
      className="flex flex-col gap-5"
    >
      {/* Hidden fields sent in FormData */}
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="date" value={date} />

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="incoming-amount"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-title-md text-title-md text-on-surface-variant">
            ₹
          </span>
          <MoneyInput
            value={amount}
            onChange={setAmount}
            placeholder="0"
            className="w-full rounded-lg border border-outline bg-pebble-mist py-2 pl-10 pr-3 font-body-md text-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-sangria-deep focus:ring-4 focus:ring-sangria-deep/10"
          />
        </div>
      </div>

      {/* Received from + quick-pick chips */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="incoming-source"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Received from
        </label>
        <Input
          id="incoming-source"
          name="source-display"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={customSource ? "Enter a source" : "e.g. Dad, friend, employer…"}
          maxLength={120}
          required
          leadingIcon={<SvgIcon name="gift" className="h-5 w-5" />}
          autoComplete="off"
        />
        {/* Quick-pick source buttons */}
        <div className="flex flex-wrap gap-2">
          {SOURCE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setSource(preset);
                setCustomSource(false);
              }}
              className={`rounded-full border px-3 py-1 font-label-sm text-label-sm transition-all duration-150 ${
                source === preset
                  ? "border-jade-botanical bg-jade-botanical text-white"
                  : "border-surface-variant bg-surface text-on-surface-variant hover:border-jade-botanical/50"
              }`}
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setSource("");
              setCustomSource(true);
            }}
            className={`rounded-full border px-3 py-1 font-label-sm text-label-sm transition-all duration-150 ${
              customSource
                ? "border-jade-botanical bg-jade-botanical text-white"
                : "border-surface-variant bg-surface text-on-surface-variant hover:border-jade-botanical/50"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      {/* Transaction type */}
      <div className="flex flex-col gap-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">Type</span>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Transaction type">
          {(["income", "repayment", "transfer"] as IncomingType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all duration-200 ${
                type === t
                  ? "border-jade-botanical bg-jade-botanical text-white"
                  : "border-surface-variant bg-surface text-on-surface-variant hover:border-jade-botanical/40"
              }`}
            >
              <span className="font-label-sm text-label-sm font-semibold">
                {typeLabel(t)}
              </span>
            </button>
          ))}
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          {typeDescription(type)}
        </p>
      </div>

      {/* Date */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="incoming-date"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Date received
        </label>
        <Input
          id="incoming-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Description (optional) */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="incoming-description"
          className="font-label-sm text-label-sm text-on-surface-variant"
        >
          Description{" "}
          <span className="text-on-surface-variant/60">(optional)</span>
        </label>
        <Input
          id="incoming-description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. November pocket money"
          maxLength={500}
          autoComplete="off"
        />
      </div>

      {state.error && (
        <p className="font-body-md text-body-md text-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="mt-1 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {initial ? "Save changes" : "Add money"}
        </Button>
      </div>
    </form>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────

interface IncomingModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: IncomingTransaction | null;
}

export function IncomingModal({ open, onClose, transaction }: IncomingModalProps) {
  const initial: IncomingFormValue | null = transaction
    ? {
        id: transaction.id,
        amount: transaction.amount,
        source: transaction.source,
        type: transaction.type,
        date: transaction.date,
        description: transaction.description ?? "",
      }
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={transaction ? "Edit transaction" : "Add money received"}
    >
      {/* key forces form state reset when switching add↔edit or between rows */}
      <IncomingForm key={transaction?.id ?? "new"} initial={initial} onClose={onClose} />
    </Modal>
  );
}
