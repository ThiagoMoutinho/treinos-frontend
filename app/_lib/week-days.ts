import type { GetWorkoutDay200WeekDay } from "@/lib/api/rc-generated";

export type WeekDay = GetWorkoutDay200WeekDay;

export const WEEK_DAYS_BY_INDEX: WeekDay[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export const WEEK_DAYS_FROM_MONDAY: WeekDay[] = [
  ...WEEK_DAYS_BY_INDEX.slice(1),
  WEEK_DAYS_BY_INDEX[0],
];

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};
