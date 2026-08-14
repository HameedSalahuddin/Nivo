// Month helpers for the onboarding flow and beyond.

export function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split("-");
  const d = new Date(Number(year), Number(monthNum) - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}