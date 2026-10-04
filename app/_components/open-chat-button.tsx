"use client";

import { Sparkles } from "lucide-react";
import { useQueryStates } from "nuqs";

import { chatSearchParams } from "@/app/_lib/chat-search-params";
import { Button } from "@/components/ui/button";

export const OpenChatButton = () => {
  const [, setChatParams] = useQueryStates(chatSearchParams);

  return (
    <Button
      type="button"
      aria-label="Abrir Coach AI"
      onClick={() => setChatParams({ chat_open: true })}
      className="size-14 rounded-full p-4 [&_svg:not([class*='size-'])]:size-6"
    >
      <Sparkles />
    </Button>
  );
};
