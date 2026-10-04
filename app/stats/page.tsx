import dayjs from "dayjs";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { redirect } from "next/navigation";

import { BottomNavigation } from "@/app/_components/bottom-navigation";
import { StatCard } from "@/app/_components/stat-card";
import { getServerSession } from "@/app/_lib/get-server-session";
import { getStats } from "@/lib/api/rc-generated";

import { ConsistencyHeatmap } from "./_components/consistency-heatmap";
import { StreakBanner } from "./_components/streak-banner";
import { formatTotalTime } from "./_lib/format-total-time";

const StatsPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const today = dayjs();
  const statsResponse = await getStats({
    from: today.startOf("month").subtract(2, "month").format("YYYY-MM-DD"),
    to: today.format("YYYY-MM-DD"),
  });

  if (statsResponse.status === 401) {
    redirect("/auth");
  }

  const stats = statsResponse.status === 200 ? statsResponse.data : null;
  const workoutStreak = stats?.workoutStreak ?? 0;
  const conclusionRate = Math.round((stats?.conclusionRate ?? 0) * 100);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center bg-background pb-28 font-heading">
      <header className="flex h-14 w-full items-center p-5">
        <span className="font-display text-[22px] leading-[1.15] text-foreground uppercase">
          Fit.ai
        </span>
      </header>

      <section className="flex w-full flex-col items-start px-5">
        <StreakBanner workoutStreak={workoutStreak} />
      </section>

      <section className="flex w-full flex-col items-start gap-3 p-5">
        <h2 className="text-lg leading-[1.4] font-semibold text-foreground">
          Consistência
        </h2>
        <ConsistencyHeatmap
          today={today}
          consistencyByDay={stats?.consistencyByDay ?? {}}
        />
        <div className="flex w-full items-stretch gap-3">
          <StatCard
            icon={CircleCheck}
            value={String(stats?.completedWorkoutsCount ?? 0)}
            label="Treinos Feitos"
            className="flex-1"
          />
          <StatCard
            icon={CirclePercent}
            value={`${conclusionRate}%`}
            label="Taxa de conclusão"
            className="flex-1"
          />
        </div>
        <StatCard
          icon={Hourglass}
          value={formatTotalTime(stats?.totalTimeInSeconds ?? 0)}
          label="Tempo Total"
          className="w-full"
        />
      </section>

      <BottomNavigation activeItem="stats" />
    </main>
  );
};

export default StatsPage;
