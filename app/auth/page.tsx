import Image from "next/image";
import { redirect } from "next/navigation";

import { getServerSession } from "@/app/_lib/get-server-session";

import { GoogleLoginButton } from "./_components/google-login-button";

const AuthPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden lg:flex-row lg:items-stretch">
      <div className="absolute inset-x-0 -top-[9.82%] h-full lg:relative lg:top-0 lg:h-auto lg:flex-1">
        <Image
          src="/login-background.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) calc(100vw - 460px), 100vw"
          className="object-cover object-[45.56%_50%]"
        />
      </div>

      <Image
        src="/fit-ai-logo.svg"
        alt="FIT.AI"
        width={84.6254}
        height={38.4066}
        priority
        className="relative mt-12 lg:absolute lg:top-12 lg:left-12 lg:mt-0"
      />

      <section className="relative mt-auto flex w-full flex-col items-center gap-15 rounded-t-[20px] bg-primary px-5 pt-12 pb-10 lg:mt-0 lg:-ml-5 lg:w-[480px] lg:shrink-0 lg:rounded-tr-none lg:rounded-l-[20px] lg:px-12">
        <div className="flex w-full max-w-[362px] flex-col items-center gap-6 lg:my-auto">
          <h1 className="w-full text-center font-heading text-[32px] leading-[1.05] font-semibold text-primary-foreground">
            O app que vai transformar a forma como você treina.
          </h1>
          <GoogleLoginButton />
        </div>
        <p className="font-heading text-xs leading-[1.4] whitespace-nowrap text-primary-foreground/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </section>
    </main>
  );
};

export default AuthPage;
