"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { startWorkoutSessionAction } from "../_actions/start-workout-session";

interface StartWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
}

export const StartWorkoutButton = ({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) => {
  const [isStarting, startTransition] = useTransition();

  const handleStartWorkout = () => {
    startTransition(async () => {
      const { error } = await startWorkoutSessionAction(
        workoutPlanId,
        workoutDayId,
      );

      if (error) {
        toast.error(error);
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleStartWorkout}
      disabled={isStarting}
      className="h-auto shrink-0 rounded-full px-4 py-2 font-heading text-sm leading-none font-semibold"
    >
      Iniciar Treino
    </Button>
  );
};
