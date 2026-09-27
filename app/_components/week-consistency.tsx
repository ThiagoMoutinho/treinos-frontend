import dayjs from "dayjs";
import Image from "next/image";

import type { GetHomeData200ConsistencyByDay } from "@/lib/api/rc-generated";
import { cn } from "@/lib/utils";

const WEEK_DAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONDAY_FIRST_OFFSETS = [1, 2, 3, 4, 5, 6, 0];

interface WeekConsistencyProps {
  today: dayjs.Dayjs;
  consistencyByDay: GetHomeData200ConsistencyByDay;
  workoutStreak: number;
}

export const WeekConsistency = ({
  today,
  consistencyByDay,
  workoutStreak,
}: WeekConsistencyProps) => {
  const weekStart = today.startOf("week");
  const todayKey = today.format("YYYY-MM-DD");

  const days = MONDAY_FIRST_OFFSETS.map((offset) => {
    const date = weekStart.add(offset, "day");
    const key = date.format("YYYY-MM-DD");
    const consistency = consistencyByDay[key];

    return {
      key,
      initial: WEEK_DAY_INITIALS[date.day()],
      isToday: key === todayKey,
      isCompleted: consistency?.workoutDayCompleted ?? false,
      isStarted: consistency?.workoutDayStarted ?? false,
    };
  });

  return (
    <div className="flex w-full items-stretch justify-center gap-3 font-heading">
      <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
        {days.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "size-5 rounded-md",
                day.isCompleted && "bg-primary",
                !day.isCompleted && day.isStarted && "bg-primary/20",
                !day.isCompleted &&
                  !day.isStarted &&
                  day.isToday &&
                  "border-[1.6px] border-primary",
                !day.isCompleted &&
                  !day.isStarted &&
                  !day.isToday &&
                  "border border-border",
              )}
            />
            <span className="text-xs leading-[1.4] text-muted-foreground">
              {day.initial}
            </span>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl bg-streak/8 px-5 py-2">
        <Image src="/fire-icon.svg" alt="" width={15.4979} height={20} />
        <span className="text-base leading-[1.15] font-semibold text-foreground">
          {workoutStreak}
        </span>
      </div>
    </div>
  );
};
