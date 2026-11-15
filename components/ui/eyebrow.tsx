import { cn } from "@/lib/utils";

/** Etiqueta pequeña: línea + texto en mono mayúsculas. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 shrink-0 bg-accent" />
      <span>{children}</span>
    </p>
  );
}
