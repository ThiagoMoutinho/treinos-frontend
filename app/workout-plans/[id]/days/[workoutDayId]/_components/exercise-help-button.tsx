"use client";

import { CircleQuestionMark } from "lucide-react";
import { useQueryStates } from "nuqs";

import { chatSearchParams } from "@/app/_lib/chat-search-params";
import { Button } from "@/components/ui/button";

interface ExerciseHelpButtonProps {
  exerciseName: string;
}

export const ExerciseHelpButton = ({ exerciseName }: ExerciseHelpButtonProps) => {
  const [, setChatParams] = useQueryStates(chatSearchParams);

  const handleClick = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Como executar o exercicio ${exerciseName} corretamente?`,
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Sobre o exercício ${exerciseName}`}
      onClick={handleClick}
      className="size-5 rounded-full text-foreground hover:bg-transparent [&_svg:not([class*='size-'])]:size-5"
    >
      <CircleQuestionMark />
    </Button>
  );
};
