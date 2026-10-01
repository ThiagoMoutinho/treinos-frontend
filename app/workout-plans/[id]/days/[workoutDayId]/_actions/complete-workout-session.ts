"use server";

import { revalidatePath } from "next/cache";

import { updateWorkoutSession } from "@/lib/api/rc-generated";

export const completeWorkoutSessionAction = async (
  workoutPlanId: string,
  workoutDayId: string,
  workoutSessionId: string,
) => {
  const response = await updateWorkoutSession(
    workoutPlanId,
    workoutDayId,
    workoutSessionId,
    { completedAt: new Date().toISOString() },
  );

  if (response.status !== 200) {
    return { error: response.data.error };
  }

  revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);

  return { error: null };
};
