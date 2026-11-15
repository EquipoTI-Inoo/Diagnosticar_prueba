import type { Precio } from "@/content/schema";
import { cn, formatPEN } from "@/lib/utils";
import { Pendiente } from "./pendiente";

/**
 * Precio en JetBrains Mono: anterior tachado legible (≥ 15 px, muted) encima y vigente grande
 * con «S/» alineado arriba. Para lectores de pantalla se lee «Antes S/ 400. Ahora S/ 239».
 * Sin precio en el contenido → `[PENDIENTE CLIENTE]`.
 */
export function Price({
  precio,
  size = "md",
  reservarAntes = false,
  className,
}: {
  precio: Precio;
  size?: "md" | "lg";
  /** Reserva la línea del precio tachado aunque no exista (alinea tarjetas en una fila). */
  reservarAntes?: boolean;
  className?: string;
}) {
  if (precio.actual === null) {
    return (
      <p className={cn("font-mono", className)}>
        <span className="sr-only">Precio: </span>
        <Pendiente />
      </p>
    );
  }
  return (
    <div className={cn("font-mono font-medium", className)}>
      {precio.antes !== null && (
        <p className="text-[0.9375rem] leading-none text-fg-muted">
          <span className="sr-only">Antes </span>
          <s className="decoration-1">{formatPEN(precio.antes)}</s>
        </p>
      )}
      {precio.antes === null && reservarAntes && (
        <p aria-hidden className="text-[0.9375rem] leading-none">
          &nbsp;
        </p>
      )}
      <p
        className={cn(
          "mt-1.5 flex items-start leading-none tracking-tight text-fg tabular-nums",
          size === "lg" ? "text-6xl" : "text-[2.75rem]",
        )}
      >
        <span className="sr-only">{precio.antes !== null ? "Ahora " : "Precio "}</span>
        <span className="mt-[0.12em] mr-1 text-[0.42em] leading-none text-fg-muted">S/</span>
        <span>{precio.actual.toLocaleString("en-US")}</span>
      </p>
    </div>
  );
}
