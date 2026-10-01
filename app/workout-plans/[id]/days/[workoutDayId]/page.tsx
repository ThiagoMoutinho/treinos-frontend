import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BottomNavigation } from "@/app/_components/bottom-navigation";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { getServerSession } from "@/app/_lib/get-server-session";
import { WEEK_DAY_LABELS, WEEK_DAYS_BY_INDEX } from "@/app/_lib/week-days";
import { Button } from "@/components/ui/button";
import { getWorkoutDay } from "@/lib/api/rc-generated";

import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import { ExerciseCard } from "./_components/exercise-card";
import { StartWorkoutButton } from "./_components/start-workout-button";

const WorkoutDayPage = async ({
  params,
}: PageProps<"/workout-plans/[id]/days/[workoutDayId]">) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const { id: workoutPlanId, workoutDayId } = await params;
  const workoutDayResponse = await getWorkoutDay(workoutPlanId, workoutDayId);

  if (workoutDayResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutDayResponse.status !== 200) {
    notFound();
  }

  const workoutDay = workoutDayResponse.data;
  const isToday = WEEK_DAYS_BY_INDEX[dayjs().day()] === workoutDay.weekDay;
  const title = isToday ? "Treino de Hoje" : WEEK_DAY_LABELS[workoutDay.weekDay];
  const sessionInProgress = workoutDay.sessions.find(
    (workoutSession) => !workoutSession.completedAt,
  );
  const hasSessionInProgress = Boolean(sessionInProgress);
  const hasCompletedSession = workoutDay.sessions.some(
    (workoutSession) => workoutSession.completedAt,
  );
  const hasNoSession = workoutDay.sessions.length === 0;
  const isCompleted = !hasSessionInProgress && hasCompletedSession;

  const workoutDayAction = hasNoSession ? (
    <StartWorkoutButton
      workoutPlanId={workoutPlanId}
      workoutDayId={workoutDayId}
    />
  ) : isCompleted ? (
    <Button
      type="button"
      variant="ghost"
      className="h-auto shrink-0 rounded-full px-4 py-2 text-sm leading-none font-semibold text-background hover:bg-transparent hover:text-background"
    >
      Concluído!
    </Button>
  ) : null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center bg-background pb-28 font-heading">
      <section className="flex w-full flex-col items-start gap-5 p-5">
        <div className="flex w-full items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-6 text-foreground hover:bg-transparent [&_svg:not([class*='size-'])]:size-6"
          >
            <Link href="/" aria-label="Voltar">
              <ChevronLeft />
            </Link>
          </Button>
          <h1 className="text-lg leading-[1.4] font-semibold text-foreground">
            {title}
          </h1>
          <div className="size-6" />
        </div>

        <WorkoutDayCard
          name={workoutDay.name}
          weekDay={workoutDay.weekDay}
          estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
          exercisesCount={workoutDay.exercises.length}
          coverImageUrl={workoutDay.coverImageUrl}
          action={workoutDayAction}
        />

        <div className="flex w-full flex-col items-start gap-3">
          {workoutDay.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              restTimeInSeconds={exercise.restTimeInSeconds}
            />
          ))}
        </div>

        {sessionInProgress && (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            workoutSessionId={sessionInProgress.id}
          />
        )}
      </section>

      <BottomNavigation activeItem="calendar" />
    </main>
  );
};

export default WorkoutDayPage;
