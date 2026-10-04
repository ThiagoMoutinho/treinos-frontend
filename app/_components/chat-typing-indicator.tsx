const DOT_DELAYS = ["[animation-delay:-0.3s]", "[animation-delay:-0.15s]", ""];

export const ChatTypingIndicator = () => {
  return (
    <div className="flex w-full flex-col items-start justify-center pt-5 pr-[60px] pl-5">
      <div
        role="status"
        aria-label="Coach AI está digitando"
        className="flex h-[44px] items-center gap-1 rounded-xl bg-secondary px-4"
      >
        {DOT_DELAYS.map((delayClassName, index) => (
          <span
            key={index}
            className={`size-2 animate-bounce rounded-full bg-muted-foreground/60 ${delayClassName}`}
          />
        ))}
      </div>
    </div>
  );
};
