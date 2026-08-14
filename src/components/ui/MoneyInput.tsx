"use client";

import { useState } from "react";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

// Formats the displayed value with en-IN grouping while typing.
export function MoneyInput({
  value,
  onChange,
  placeholder = "0",
  className = "",
}: MoneyInputProps) {
  const [text, setText] = useState(value > 0 ? value.toLocaleString("en-IN") : "");

  return (
    <input
      inputMode="numeric"
      type="text"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const digits = e.target.value.replace(/[^\d]/g, "");
        const next = digits ? parseInt(digits, 10) : 0;
        setText(next > 0 ? next.toLocaleString("en-IN") : "");
        onChange(next);
      }}
      className={className}
    />
  );
}