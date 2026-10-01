import { Calendar, Zap } from "lucide-react";

import { WEEK_DAY_LABELS, type WeekDay } from "@/app/_lib/week-days";

interface RestDayCardProps {
  weekDay: WeekDay;
}

export const RestDayCard = ({ weekDay }: RestDayCardProps) => {
  return (
    <div className="flex h-[110px] w-full flex-col items-start justify-between rounded-xl bg-muted p-5 font-heading">
      <div className="flex items-center justify-center gap-1 rounded-full bg-foreground/8 px-2.5 py-[5px] backdrop-blur-[4px]">
        <Calendar className="size-3.5 text-foreground" strokeWidth={1.5} />
        <span className="text-xs leading-none font-semibold text-foreground uppercase">
          {WEEK_DAY_LABELS[weekDay]}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Zap
          className="size-5 fill-primary text-primary"
          strokeWidth={1.714}
        />
        <span className="text-2xl leading-[1.05] font-semibold text-foreground">
          Descanso
        </span>
      </div>
    </div>
  );
};
