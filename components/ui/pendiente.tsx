import { cn } from "@/lib/utils";

/**
 * Muestra un dato faltante (`[PENDIENTE CLIENTE]`) de forma visible.
 * En la Fase 6 se resaltará en modo preview y se neutralizará en producción.
 */
export function Pendiente({
  children = "[PENDIENTE CLIENTE]",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-pendiente
      className={cn(
        "inline-block rounded-sm border border-dashed border-border-strong px-1.5 font-mono text-[0.8em] text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
