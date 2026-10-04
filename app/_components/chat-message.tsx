import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
}

export const ChatMessage = ({ role, text, isStreaming }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center pt-5",
        isUser ? "items-end pr-5 pl-[60px]" : "items-start pr-[60px] pl-5",
      )}
    >
      <div
        className={cn(
          "flex max-w-full items-center rounded-xl p-3 text-sm leading-[1.4]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "w-full bg-secondary text-foreground",
        )}
      >
        {isUser ? (
          <p className="break-words whitespace-pre-wrap">{text}</p>
        ) : (
          <Streamdown
            isAnimating={isStreaming}
            className="min-w-0 flex-1 space-y-2 break-words"
          >
            {text}
          </Streamdown>
        )}
      </div>
    </div>
  );
};
