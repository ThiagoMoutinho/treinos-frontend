"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, Square, X } from "lucide-react";
import { useQueryStates } from "nuqs";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { chatSearchParams } from "@/app/_lib/chat-search-params";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./chat-message";
import { ChatTypingIndicator } from "./chat-typing-indicator";

const WELCOME_MESSAGE =
  "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?";
const SUGGESTED_MESSAGES = ["Monte o meu plano de treino"];

export const Chatbot = () => {
  const [{ chat_open: isOpen, chat_initial_message: initialMessage }, setChatParams] =
    useQueryStates(chatSearchParams);
  const [input, setInput] = useState("");
  const sentInitialMessageRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include"
    }),
    onError: () => {
      toast.error("Não foi possível falar com o Coach AI.");
    },
  });

  const isBusy = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const isWaitingForText =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      !lastMessage.parts.some((part) => part.type === "text" && part.text));

  useEffect(() => {
    if (!isOpen || !initialMessage) {
      return;
    }

    if (sentInitialMessageRef.current === initialMessage) {
      return;
    }

    sentInitialMessageRef.current = initialMessage;
    sendMessage({ text: initialMessage });
    setChatParams({ chat_initial_message: null });
  }, [isOpen, initialMessage, sendMessage, setChatParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleClose = () => {
    setChatParams({ chat_open: null, chat_initial_message: null });
  };

  const handleSend = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText || isBusy) {
      return;
    }

    sendMessage({ text: trimmedText });
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    handleSend(input);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 font-heading">
      <button
        type="button"
        aria-label="Fechar chat"
        onClick={handleClose}
        className="absolute inset-0 bg-foreground/30"
      />

      <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-3xl flex-col px-4 pt-40 pb-4">
        <div className="pointer-events-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
          <div className="flex w-full shrink-0 items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full border border-primary/8 bg-primary/8 p-3">
                <Sparkles className="size-[18px] text-primary" strokeWidth={2} />
              </div>
              <div className="flex flex-col items-start justify-center gap-1.5">
                <span className="text-base leading-[1.05] font-semibold text-foreground">
                  Coach AI
                </span>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-online" />
                  <span className="text-xs leading-[1.15] text-primary">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fechar chat"
              onClick={handleClose}
              className="size-6 text-muted-foreground hover:bg-transparent hover:text-muted-foreground [&_svg:not([class*='size-'])]:size-6"
            >
              <X strokeWidth={1.6} />
            </Button>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto pb-5">
            <ChatMessage role="assistant" text={WELCOME_MESSAGE} />
            {messages.map((message, index) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");

              if (!text) {
                return null;
              }

              return (
                <ChatMessage
                  key={message.id}
                  role={message.role === "user" ? "user" : "assistant"}
                  text={text}
                  isStreaming={
                    status === "streaming" && index === messages.length - 1
                  }
                />
              );
            })}
            {isWaitingForText && <ChatTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex w-full items-start gap-2.5 overflow-x-auto px-5">
                {SUGGESTED_MESSAGES.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="h-auto shrink-0 rounded-full bg-primary/13 px-4 py-2 text-sm leading-none font-normal text-foreground hover:bg-primary/20"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-end justify-center gap-2 border-t border-border p-5"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Digite sua mensagem"
                aria-label="Mensagem"
                className="field-sizing-content max-h-32 min-h-[42px] flex-1 resize-none rounded-[21px] border border-secondary bg-secondary px-4 py-3 text-sm leading-[1.15] text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {isBusy ? (
                <Button
                  type="button"
                  size="icon"
                  aria-label="Parar resposta"
                  onClick={stop}
                  className="size-[42px] shrink-0 rounded-full p-2.5 [&_svg:not([class*='size-'])]:size-4"
                >
                  <Square className="fill-primary-foreground" strokeWidth={1.92} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Enviar mensagem"
                  disabled={!input.trim()}
                  className="size-[42px] shrink-0 rounded-full p-2.5 disabled:opacity-100 [&_svg:not([class*='size-'])]:size-5"
                >
                  <ArrowUp strokeWidth={1.92} />
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
