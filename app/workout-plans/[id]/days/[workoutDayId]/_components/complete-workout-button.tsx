"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { completeWorkoutSessionAction } from "../_actions/complete-workout-session";

interface CompleteWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
  workoutSessionId: string;
}

export const CompleteWorkoutButton = ({
  workoutPlanId,
  workoutDayId,
  workoutSessionId,
}: CompleteWorkoutButtonProps) => {
  const [isCompleting, startTransition] = useTransition();

  const handleCompleteWorkout = () => {
    startTransition(async () => {
      const { error } = await completeWorkoutSessionAction(
        workoutPlanId,
        workoutDayId,
        workoutSessionId,
      );

      if (error) {
        toast.error(error);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCompleteWorkout}
      disabled={isCompleting}
      className="h-auto w-full rounded-full border-border py-3 text-sm leading-none font-semibold text-foreground shadow-none"
    >
      Marcar como concluído
    </Button>
  );
};
