import { BicepsFlexed, Ruler, User, WeightTilde } from "lucide-react";
import { redirect } from "next/navigation";

import { BottomNavigation } from "@/app/_components/bottom-navigation";
import { StatCard } from "@/app/_components/stat-card";
import { getServerSession } from "@/app/_lib/get-server-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserTrainData } from "@/lib/api/rc-generated";

import { SignOutButton } from "./_components/sign-out-button";

const EMPTY_VALUE = "-";

const ProfilePage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  const trainDataResponse = await getUserTrainData();

  if (trainDataResponse.status === 401) {
    redirect("/auth");
  }

  const trainData =
    trainDataResponse.status === 200 ? trainDataResponse.data : null;
  const userName = trainData?.userName ?? session.user.name;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center bg-background pb-28 font-heading">
      <header className="flex h-14 w-full items-center p-5">
        <span className="font-display text-[22px] leading-[1.15] text-foreground uppercase">
          Fit.ai
        </span>
      </header>

      <section className="flex w-full flex-col items-center justify-center gap-5 p-5">
        <div className="flex w-full items-center gap-3">
          <Avatar className="size-[52px]">
            {session.user.image && (
              <AvatarImage
                src={session.user.image}
                alt={userName}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            )}
            <AvatarFallback className="text-lg font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center gap-1.5 whitespace-nowrap">
            <h1 className="text-lg leading-[1.05] font-semibold text-foreground">
              {userName}
            </h1>
            <p className="text-sm leading-[1.15] text-foreground/70">
              Plano Básico
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard
            icon={WeightTilde}
            value={
              trainData
                ? String(Number((trainData.weightInGrams / 1000).toFixed(1)))
                : EMPTY_VALUE
            }
            label="KG"
          />
          <StatCard
            icon={Ruler}
            value={
              trainData ? String(trainData.heightInCentimeters) : EMPTY_VALUE
            }
            label="CM"
          />
          <StatCard
            icon={BicepsFlexed}
            value={
              trainData ? `${trainData.bodyFatPercentage}%` : EMPTY_VALUE
            }
            label="GC"
          />
          <StatCard
            icon={User}
            value={trainData ? String(trainData.age) : EMPTY_VALUE}
            label="ANOS"
          />
        </div>

        <SignOutButton />
      </section>

      <BottomNavigation activeItem="profile" />
    </main>
  );
};

export default ProfilePage;
