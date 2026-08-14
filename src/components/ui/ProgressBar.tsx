interface ProgressBarProps {
  // Ratio between 0 and 1.
  value: number;
  // Fill switches to the warning colour at or above this ratio.
  warnThreshold?: number;
  className?: string;
}

export function ProgressBar({
  value,
  warnThreshold = 0.8,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const warning = value >= warnThreshold;

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-pebble-mist ${className}`}
    >
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${warning ? "bg-sangria-deep" : "bg-jade-botanical"}`}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}