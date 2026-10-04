import Image from "next/image";

interface StreakBannerProps {
  workoutStreak: number;
}

export const StreakBanner = ({ workoutStreak }: StreakBannerProps) => {
  const isActive = workoutStreak > 0;
  const daysLabel = workoutStreak === 1 ? "dia" : "dias";

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10">
      <Image
        src={
          isActive
            ? "/streak-banner-active.png"
            : "/streak-banner-inactive.png"
        }
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 728px, 100vw"
        className="object-cover"
      />

      <div className="relative flex flex-col items-center gap-3">
        <div className="rounded-full border border-background/12 bg-background/12 p-3 backdrop-blur-[4px]">
          <Image
            src={
              isActive
                ? "/streak-fire-active.svg"
                : "/streak-fire-inactive.svg"
            }
            alt=""
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-background">
          <span className="text-center text-5xl leading-[0.95] font-semibold">
            {workoutStreak} {daysLabel}
          </span>
          <span className="text-base leading-[1.15] opacity-60">
            Sequência Atual
          </span>
        </div>
      </div>
    </div>
  );
};
