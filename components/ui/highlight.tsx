import { cn } from "@/lib/utils";

/**
 * Palabra o línea clave en color de acento dentro de un titular.
 * Sin cursiva: Archivo se carga sin estilo italic y el navegador la falsearía.
 */
export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("text-accent", className)}>{children}</span>;
}
