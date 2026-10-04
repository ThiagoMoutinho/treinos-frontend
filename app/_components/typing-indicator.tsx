const DOT_DELAYS = ["0ms", "150ms", "300ms"];

export const TypingIndicator = () => {
  return (
    <div className="flex w-full flex-col items-start justify-center pt-5 pr-[60px] pl-5">
      <div
        role="status"
        aria-label="Coach AI está digitando"
        className="flex h-[44px] items-center gap-1 rounded-xl bg-secondary px-4"
      >
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: delay }}
            className="size-2 animate-bounce rounded-full bg-muted-foreground/60"
          />
        ))}
      </div>
    </div>
  );
};
