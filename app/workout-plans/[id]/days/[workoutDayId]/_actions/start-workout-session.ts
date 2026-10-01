"use server";

import { revalidatePath } from "next/cache";

import { startWorkoutSession } from "@/lib/api/rc-generated";

export const startWorkoutSessionAction = async (
  workoutPlanId: string,
  workoutDayId: string,
) => {
  const response = await startWorkoutSession(workoutPlanId, workoutDayId);

  if (response.status !== 201) {
    return { error: response.data.error };
  }

  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);

  return { error: null };
};
