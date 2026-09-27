import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { GetHomeData200TodayWorkoutDayWeekDay } from "@/lib/api/rc-generated";

const WEEK_DAY_LABELS: Record<GetHomeData200TodayWorkoutDayWeekDay, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface WorkoutDayCardProps {
  name: string;
  weekDay: GetHomeData200TodayWorkoutDayWeekDay;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl?: string | null;
  className?: string;
}

export const WorkoutDayCard = ({
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
  className,
}: WorkoutDayCardProps) => {
  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);
  const exercisesLabel = exercisesCount === 1 ? "exercício" : "exercícios";

  return (
    <div
      className={cn(
        "relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5 font-heading",
        className,
      )}
    >
      <Image
        src={coverImageUrl ?? "/login-background.png"}
        alt=""
        fill
        sizes="(min-width: 768px) 728px, 100vw"
        className="object-cover"
      />

      <div className="relative flex items-center justify-center gap-1 rounded-full bg-background/16 px-2.5 py-[5px] backdrop-blur-[4px]">
        <Calendar className="size-3.5 text-background" strokeWidth={1.5} />
        <span className="text-xs leading-none font-semibold text-background uppercase">
          {WEEK_DAY_LABELS[weekDay]}
        </span>
      </div>

      <div className="relative flex flex-col items-start gap-2">
        <h3 className="text-2xl leading-[1.05] font-semibold text-background">
          {name}
        </h3>
        <div className="flex items-start gap-2">
          <div className="flex items-center justify-center gap-1">
            <Timer className="size-3.5 text-background" strokeWidth={1.5} />
            <span className="text-xs leading-[1.4] text-background/70">
              {durationInMinutes}min
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Dumbbell className="size-3.5 text-background" strokeWidth={1.5} />
            <span className="text-xs leading-[1.4] text-background/70">
              {exercisesCount} {exercisesLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
