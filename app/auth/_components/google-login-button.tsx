"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message ?? "Não foi possível fazer login com o Google.");
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="h-[38px] gap-2 rounded-full bg-background px-6 py-3 text-sm leading-none font-semibold text-foreground hover:bg-background/90"
    >
      <span className="flex size-4 items-center justify-center">
        <Image src="/google-icon.svg" alt="" width={13.5122} height={13.9941} />
      </span>
      Fazer login com Google
    </Button>
  );
};
