import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const INACTIVE_ITEM_CLASS_NAME =
  "size-12 rounded-none p-3 text-muted-foreground/66 hover:bg-transparent hover:text-muted-foreground/66 [&_svg:not([class*='size-'])]:size-6";

export const BottomNavigation = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-3xl items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Button
        asChild
        variant="ghost"
        className="size-12 rounded-none p-3 text-foreground hover:bg-transparent [&_svg:not([class*='size-'])]:size-6"
      >
        <Link href="/" aria-label="Início">
          <House />
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Calendário"
        className={INACTIVE_ITEM_CLASS_NAME}
      >
        <Calendar />
      </Button>
      <Button
        type="button"
        aria-label="IA"
        className="size-14 rounded-full p-4 [&_svg:not([class*='size-'])]:size-6"
      >
        <Sparkles />
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Estatísticas"
        className={INACTIVE_ITEM_CLASS_NAME}
      >
        <ChartNoAxesColumn />
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Perfil"
        className={INACTIVE_ITEM_CLASS_NAME}
      >
        <UserRound />
      </Button>
    </nav>
  );
};
