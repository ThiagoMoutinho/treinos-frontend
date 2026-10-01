import dayjs from "dayjs";
import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getHomeData } from "@/lib/api/rc-generated";
import { cn } from "@/lib/utils";

const ITEM_CLASS_NAME =
  "size-12 rounded-none p-3 hover:bg-transparent [&_svg:not([class*='size-'])]:size-6";
const ACTIVE_ITEM_CLASS_NAME = "text-foreground hover:text-foreground";
const INACTIVE_ITEM_CLASS_NAME =
  "text-muted-foreground/66 hover:text-muted-foreground/66";

interface BottomNavigationProps {
  activeItem: "home" | "calendar";
}

export const BottomNavigation = async ({
  activeItem,
}: BottomNavigationProps) => {
  const homeResponse = await getHomeData(dayjs().format("YYYY-MM-DD"));
  const todayWorkoutDay =
    homeResponse.status === 200 ? homeResponse.data.todayWorkoutDay : undefined;

  const isHomeActive = activeItem === "home";
  const isCalendarActive = activeItem === "calendar";
  const calendarClassName = cn(
    ITEM_CLASS_NAME,
    isCalendarActive ? ACTIVE_ITEM_CLASS_NAME : INACTIVE_ITEM_CLASS_NAME,
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-3xl items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Button
        asChild
        variant="ghost"
        className={cn(
          ITEM_CLASS_NAME,
          isHomeActive ? ACTIVE_ITEM_CLASS_NAME : INACTIVE_ITEM_CLASS_NAME,
        )}
      >
        <Link href="/" aria-label="Início">
          <House />
        </Link>
      </Button>
      {todayWorkoutDay ? (
        <Button asChild variant="ghost" className={calendarClassName}>
          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
            aria-label="Treino de hoje"
          >
            <Calendar />
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          aria-label="Treino de hoje"
          className={calendarClassName}
        >
          <Calendar />
        </Button>
      )}
      <Button
        type="button"
        aria-label="IA"
        className="size-14 rounded-full p-4 [&_svg:not([class*='size-'])]:size-6"
      >
        <Sparkles />
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Estatísticas"
        className={cn(ITEM_CLASS_NAME, INACTIVE_ITEM_CLASS_NAME)}
      >
        <ChartNoAxesColumn />
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Perfil"
        className={cn(ITEM_CLASS_NAME, INACTIVE_ITEM_CLASS_NAME)}
      >
        <UserRound />
      </Button>
    </nav>
  );
};
