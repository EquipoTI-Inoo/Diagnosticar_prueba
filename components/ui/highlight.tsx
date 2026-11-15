import { cn } from "@/lib/utils";

/** Palabra clave en color de acento dentro de un titular (estilo «Las máquinas no mienten.»). */
export function Highlight({
  children,
  italic = false,
  className,
}: {
  children: React.ReactNode;
  italic?: boolean;
  className?: string;
}) {
  return (
    <em className={cn("text-accent", italic ? "italic" : "not-italic", className)}>{children}</em>
  );
}
