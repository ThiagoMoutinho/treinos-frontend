import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerSession } from "@/app/_lib/get-server-session";
import { Button } from "@/components/ui/button";
import { getHomeData, getUserTrainData } from "@/lib/api/rc-generated";

import { BottomNavigation } from "./_components/bottom-navigation";
import { SectionHeader } from "./_components/section-header";
import { WeekConsistency } from "./_components/week-consistency";
import { WorkoutDayCard } from "./_components/workout-day-card";

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const { skipOnboarding } = await searchParams;
  const today = dayjs();
  const [homeResponse, trainDataResponse] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeResponse.status === 401 || trainDataResponse.status === 401) {
    redirect("/auth");
  }

  if (
    skipOnboarding !== "true" &&
    (homeResponse.status === 404 || trainDataResponse.status === 404)
  ) {
    redirect("/onboarding");
  }

  const homeData = homeResponse.status === 200 ? homeResponse.data : null;
  const todayWorkoutDay = homeData?.todayWorkoutDay;
  const firstName = session.user.name.split(" ")[0];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center bg-background pb-28 font-heading">
      <section className="relative flex h-[296px] w-full shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pt-5 pb-10">
        <Image
          src="/home-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover object-[50%_70%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(242.47deg,transparent_34.457%,var(--foreground)_100%)]" />

        <span className="relative font-display text-[22px] leading-[1.15] text-background uppercase">
          Fit.ai
        </span>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-1.5 whitespace-nowrap">
            <h1 className="text-2xl leading-[1.05] font-semibold text-background">
              Olá, {firstName}
            </h1>
            <p className="text-sm leading-[1.15] text-background/70">
              Bora treinar hoje?
            </p>
          </div>
          <Button
            type="button"
            className="h-auto rounded-full px-4 py-2 text-sm leading-none font-semibold"
          >
            Bora!
          </Button>
        </div>
      </section>

      <section className="flex w-full flex-col items-start gap-3 px-5 pt-5">
        <SectionHeader title="Consistência" actionLabel="Ver histórico" />
        <WeekConsistency
          today={today}
          consistencyByDay={homeData?.consistencyByDay ?? {}}
          workoutStreak={homeData?.workoutStreak ?? 0}
        />
      </section>

      <section className="flex w-full flex-col items-start gap-3 p-5">
        <SectionHeader title="Treino de Hoje" actionLabel="Ver treinos" />
        {todayWorkoutDay ? (
          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
            className="w-full"
          >
            <WorkoutDayCard
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        ) : (
          <div className="flex w-full items-center justify-center rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground">
              Nenhum treino programado para hoje.
            </p>
          </div>
        )}
      </section>

      <BottomNavigation activeItem="home" />
    </main>
  );
}
