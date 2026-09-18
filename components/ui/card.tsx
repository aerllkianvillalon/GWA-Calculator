import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-ink-100 bg-paper-raised", className)}>
      {children}
    </div>
  );
}
