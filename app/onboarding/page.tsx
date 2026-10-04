import { redirect } from "next/navigation";

import { Chatbot } from "@/app/_components/chatbot";
import { getServerSession } from "@/app/_lib/get-server-session";

const OnboardingPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth");
  }

  return <Chatbot mode="onboarding" />;
};

export default OnboardingPage;
