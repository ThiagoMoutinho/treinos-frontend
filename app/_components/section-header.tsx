import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  actionLabel: string;
}

export const SectionHeader = ({ title, actionLabel }: SectionHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between font-heading leading-[1.4] whitespace-nowrap">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-xs leading-[1.4] font-normal text-primary has-[>svg]:px-0"
      >
        {actionLabel}
      </Button>
    </div>
  );
};
