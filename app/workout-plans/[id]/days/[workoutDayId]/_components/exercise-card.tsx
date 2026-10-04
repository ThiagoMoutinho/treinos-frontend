import { Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { ExerciseHelpButton } from "./exercise-help-button";

const BADGE_CLASS_NAME =
  "h-[22px] rounded-full bg-muted px-2.5 py-[5px] text-xs leading-none font-semibold text-muted-foreground uppercase";

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
}

export const ExerciseCard = ({
  name,
  sets,
  reps,
  restTimeInSeconds,
}: ExerciseCardProps) => {
  const setsLabel = sets === 1 ? "série" : "séries";

  return (
    <div className="flex w-full flex-col items-start justify-center gap-3 rounded-xl border border-border p-5 font-heading">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-base leading-[1.4] font-semibold text-foreground">
          {name}
        </h3>
        <ExerciseHelpButton exerciseName={name} />
      </div>
      <div className="flex items-start gap-1.5">
        <Badge className={BADGE_CLASS_NAME}>
          {sets} {setsLabel}
        </Badge>
        <Badge className={BADGE_CLASS_NAME}>{reps} reps</Badge>
        <Badge className={BADGE_CLASS_NAME}>
          <Zap className="size-3.5" strokeWidth={1.5} />
          {restTimeInSeconds}s
        </Badge>
      </div>
    </div>
  );
};
