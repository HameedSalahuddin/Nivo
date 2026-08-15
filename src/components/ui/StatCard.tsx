import { Card } from "@/components/ui/Card";
import { IconCircle } from "@/components/ui/IconCircle";

interface StatCardProps {
  icon: string;
  iconClass: string;
  label: string;
  value: string;
  sub?: string;
  subClass?: string;
}

export function StatCard({ icon, iconClass, label, value, sub, subClass }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 md:p-5">
      <IconCircle icon={icon} className={iconClass} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
        <p className="mt-0.5 font-display-lg text-[30px] leading-tight text-on-surface md:text-[34px]">
          {value}
        </p>
        {sub && (
          <p className={`mt-0.5 font-label-sm text-label-sm ${subClass ?? "text-on-surface-variant"}`}>
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
}
