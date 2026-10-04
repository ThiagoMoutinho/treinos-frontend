"use client";

import { useChat } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, Square, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryStates } from "nuqs";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { chatSearchParams } from "@/app/_lib/chat-search-params";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { ChatMessage } from "./chat-message";
import { ChatTypingIndicator } from "./chat-typing-indicator";

const WELCOME_MESSAGE =
  "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?";
const SUGGESTED_MESSAGES = ["Monte o meu plano de treino"];
const ONBOARDING_MESSAGES = [
  { text: "Bem-vindo ao FIT.AI! 🎉", fullWidth: false },
  {
    text: "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
    fullWidth: true,
  },
  {
    text: "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
    fullWidth: false,
  },
  { text: "Vamos configurar seu perfil?", fullWidth: false },
];

interface ChatbotProps {
  mode?: "overlay" | "onboarding";
}

const chatFormSchema = z.object({
  message: z.string().trim().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export const Chatbot = ({ mode = "overlay" }: ChatbotProps) => {
  const pathname = usePathname();
  const isOnboarding = mode === "onboarding";
  const [{ chat_open: isOpen, chat_initial_message: initialMessage }, setChatParams] =
    useQueryStates(chatSearchParams);
  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    mode: "onChange",
    defaultValues: { message: "" },
  });
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
  };

  const handleSubmit = ({ message }: ChatFormValues) => {
    if (isBusy) {
      return;
    }

    handleSend(message);
    form.reset();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    form.handleSubmit(handleSubmit)();
  };

  if (!isOnboarding && (pathname === "/onboarding" || !isOpen)) {
    return null;
  }

  return (
    <div
      className={
        isOnboarding
          ? "mx-auto flex h-dvh w-full max-w-3xl flex-col bg-background font-heading"
          : "fixed inset-0 z-50 font-heading"
      }
    >
      {!isOnboarding && (
        <button
          type="button"
          aria-label="Fechar chat"
          onClick={handleClose}
          className="absolute inset-0 bg-foreground/30"
        />
      )}

      <div
        className={
          isOnboarding
            ? "flex min-h-0 w-full flex-1 flex-col"
            : "pointer-events-none absolute inset-0 mx-auto flex w-full max-w-3xl flex-col px-4 pt-40 pb-4"
        }
      >
        <div
          className={
            isOnboarding
              ? "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-background"
              : "pointer-events-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[20px] bg-background"
          }
        >
          <div className="flex w-full shrink-0 items-center justify-between gap-3 border-b border-border p-5">
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
            {isOnboarding ? (
              <Button
                asChild
                className="h-auto shrink-0 rounded-full px-4 py-2 text-sm leading-none font-semibold"
              >
                <Link href="/?skipOnboarding=true">Acessar FIT.IA</Link>
              </Button>
            ) : (
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
            )}
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto pb-5">
            {isOnboarding ? (
              <div className="flex w-full flex-col items-start gap-3 pt-5 pr-[60px] pl-5">
                {ONBOARDING_MESSAGES.map((message) => (
                  <div
                    key={message.text}
                    className={`rounded-xl bg-secondary p-3 text-sm leading-[1.4] break-words text-foreground ${
                      message.fullWidth ? "w-full" : "w-fit max-w-full"
                    }`}
                  >
                    <p className={message.fullWidth ? undefined : "max-w-[267px]"}>
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <ChatMessage role="assistant" text={WELCOME_MESSAGE} />
            )}
            {isOnboarding && messages.length === 0 && (
              <div className="flex w-full items-end justify-end pt-5 pr-5 pl-[60px]">
                <Button
                  type="button"
                  onClick={() => handleSend("Começar!")}
                  className="h-auto rounded-xl px-3 py-3 text-sm leading-[1.4] font-normal"
                >
                  Começar!
                </Button>
              </div>
            )}
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
            {!isOnboarding && messages.length === 0 && (
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex w-full items-end justify-center gap-2 border-t border-border p-5"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1 gap-0">
                      <FormControl>
                        <Textarea
                          {...field}
                          onKeyDown={handleKeyDown}
                          rows={1}
                          placeholder="Digite sua mensagem"
                          aria-label="Mensagem"
                          className="max-h-32 min-h-[42px] resize-none rounded-[21px] border-secondary bg-secondary px-4 py-3 text-sm leading-[1.15] text-foreground shadow-none placeholder:text-muted-foreground md:text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
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
                    disabled={!form.formState.isValid}
                    className="size-[42px] shrink-0 rounded-full p-2.5 disabled:opacity-100 [&_svg:not([class*='size-'])]:size-5"
                  >
                    <ArrowUp strokeWidth={1.92} />
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
