import { Goal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BottomNavigation } from "@/app/_components/bottom-navigation";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { getServerSession } from "@/app/_lib/get-server-session";
import { WEEK_DAYS_FROM_MONDAY } from "@/app/_lib/week-days";
import { Badge } from "@/components/ui/badge";
import { getWorkoutPlan } from "@/lib/api/rc-generated";

import { RestDayCard } from "./_components/rest-day-card";

const WorkoutPlanPage = async ({ params }: PageProps<"/workout-plans/[id]">) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const { id } = await params;
  const workoutPlanResponse = await getWorkoutPlan(id);

  if (workoutPlanResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutPlanResponse.status !== 200) {
    notFound();
  }

  const workoutPlan = workoutPlanResponse.data;
  const workoutDays = workoutPlan.workoutDays.toSorted(
    (first, second) =>
      WEEK_DAYS_FROM_MONDAY.indexOf(first.weekDay) -
      WEEK_DAYS_FROM_MONDAY.indexOf(second.weekDay),
  );

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center bg-background pb-28 font-heading">
      <section className="relative flex h-[296px] w-full shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pt-5 pb-10">
        <Image
          src="/workout-plan-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-[238.09deg] from-transparent to-foreground/80" />

        <span className="relative font-display text-[22px] leading-[1.15] text-background uppercase">
          Fit.ai
        </span>

        <div className="relative flex flex-col items-start gap-3">
          <Badge className="h-auto gap-1 rounded-full px-2.5 py-[5px] text-xs leading-none font-semibold uppercase">
            <Goal className="size-4" strokeWidth={1.8} />
            {workoutPlan.name}
          </Badge>
          <h1 className="text-2xl leading-[1.05] font-semibold text-background">
            Plano de Treino
          </h1>
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center gap-3 p-5">
        {workoutDays.map((workoutDay) =>
          workoutDay.isRest ? (
            <RestDayCard key={workoutDay.id} weekDay={workoutDay.weekDay} />
          ) : (
            <Link
              key={workoutDay.id}
              href={`/workout-plans/${workoutPlan.id}/days/${workoutDay.id}`}
              className="w-full"
            >
              <WorkoutDayCard
                name={workoutDay.name}
                weekDay={workoutDay.weekDay}
                estimatedDurationInSeconds={
                  workoutDay.estimatedDurationInSeconds
                }
                exercisesCount={workoutDay.exercisesCount}
                coverImageUrl={workoutDay.coverImageUrl}
              />
            </Link>
          ),
        )}
      </section>

      <BottomNavigation activeItem="calendar" />
    </main>
  );
};

export default WorkoutPlanPage;
