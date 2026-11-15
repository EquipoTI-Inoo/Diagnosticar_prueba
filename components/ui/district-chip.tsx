import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/** Chip de distrito (cobertura). */
export function DistrictChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-border-strong bg-card px-3 text-[0.9rem]",
        className,
      )}
    >
      <MapPin aria-hidden className="size-3.5 text-accent" strokeWidth={1.75} />
      {children}
    </span>
  );
}

export function DistrictList({
  distritos,
  className,
}: {
  distritos: string[];
  className?: string;
}) {
  return (
    <ul role="list" className={cn("flex flex-wrap gap-2", className)}>
      {distritos.map((d) => (
        <li key={d}>
          <DistrictChip>{d}</DistrictChip>
        </li>
      ))}
    </ul>
  );
}
