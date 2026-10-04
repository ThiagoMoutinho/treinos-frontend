"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/auth");
          },
          onError: () => {
            toast.error("Não foi possível sair da conta.");
          },
        },
      });
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="h-auto gap-2 rounded-full px-4 py-2 text-base leading-none font-semibold text-destructive hover:bg-transparent hover:text-destructive [&_svg:not([class*='size-'])]:size-4"
    >
      Sair da conta
      <LogOut strokeWidth={2.4} />
    </Button>
  );
};
