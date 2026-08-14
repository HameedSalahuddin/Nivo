import { Icon } from "@/components/ui/Icon";

interface IconCircleProps {
  icon: string;
  // Tinted background + icon colour, e.g. "bg-sangria-deep/10 text-sangria-deep".
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function IconCircle({
  icon,
  className = "bg-sangria-deep/10 text-sangria-deep",
  size = "md",
}: IconCircleProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${sizes[size]} ${className}`}
    >
      <Icon name={icon} className="text-[20px]" />
    </span>
  );
}