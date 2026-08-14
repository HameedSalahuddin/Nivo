// Money helpers — the app uses Indian Rupees (₹) with en-IN formatting.

export function formatINR(amount: number): string {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// Parses user input like "8,000" or "₹8,000" into a number.
export function parseINR(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}