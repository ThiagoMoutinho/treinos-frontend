import dayjs from "dayjs";

import type { GetStats200ConsistencyByDay } from "@/lib/api/rc-generated";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const MONTHS_COUNT = 3;
const DAYS_IN_WEEK = 7;

interface ConsistencyHeatmapProps {
  today: dayjs.Dayjs;
  consistencyByDay: GetStats200ConsistencyByDay;
}

const getMondayOfWeek = (date: dayjs.Dayjs) =>
  date.subtract((date.day() + 6) % DAYS_IN_WEEK, "day");

const buildMonths = (today: dayjs.Dayjs) =>
  Array.from({ length: MONTHS_COUNT }, (_, index) => {
    const monthStart = today
      .startOf("month")
      .subtract(MONTHS_COUNT - 1 - index, "month");
    const monthEnd = monthStart.endOf("month");
    const weeks: { key: string; date: dayjs.Dayjs; isInMonth: boolean }[][] =
      [];

    for (
      let weekStart = getMondayOfWeek(monthStart);
      !weekStart.isAfter(monthEnd, "day");
      weekStart = weekStart.add(1, "week")
    ) {
      weeks.push(
        Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => {
          const date = weekStart.add(dayIndex, "day");

          return {
            key: date.format("YYYY-MM-DD"),
            date,
            isInMonth: date.month() === monthStart.month(),
          };
        }),
      );
    }

    return {
      key: monthStart.format("YYYY-MM"),
      label: MONTH_LABELS[monthStart.month()],
      weeks,
    };
  });

export const ConsistencyHeatmap = ({
  today,
  consistencyByDay,
}: ConsistencyHeatmapProps) => {
  const months = buildMonths(today);

  return (
    <div className="flex w-full items-start gap-1 overflow-x-auto rounded-xl border border-border p-5 font-heading">
      {months.map((month) => (
        <div
          key={month.key}
          className="flex shrink-0 flex-col items-start justify-center gap-1.5"
        >
          <span className="text-xs leading-[1.4] whitespace-nowrap text-muted-foreground">
            {month.label}
          </span>
          <div className="flex items-start gap-1">
            {month.weeks.map((week) => (
              <div
                key={week[0].key}
                className="flex flex-col items-start gap-1"
              >
                {week.map((day) => {
                  const consistency = consistencyByDay[day.key];
                  const isCompleted = consistency?.workoutDayCompleted ?? false;
                  const isStarted = consistency?.workoutDayStarted ?? false;

                  return (
                    <div
                      key={day.key}
                      className={cn(
                        "size-5 shrink-0 rounded-md",
                        !day.isInMonth && "invisible",
                        day.isInMonth && isCompleted && "bg-primary",
                        day.isInMonth &&
                          !isCompleted &&
                          isStarted &&
                          "bg-primary/20",
                        day.isInMonth &&
                          !isCompleted &&
                          !isStarted &&
                          "border border-border",
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
