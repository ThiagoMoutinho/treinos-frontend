import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export const StatCard = ({
  icon: Icon,
  value,
  label,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5",
        className,
      )}
    >
      <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
        <Icon className="size-4 text-primary" strokeWidth={1.8} />
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 whitespace-nowrap">
        <span className="text-2xl leading-[1.15] font-semibold text-foreground">
          {value}
        </span>
        <span className="text-xs leading-[1.4] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
};
