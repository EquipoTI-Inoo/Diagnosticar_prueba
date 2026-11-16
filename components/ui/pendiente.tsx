import { esProduccion, MARCA_PENDIENTE, neutralizar } from "@/lib/entorno";
import { cn } from "@/lib/utils";

/** Texto neutro para producción, con mayúscula inicial («Por confirmar»). */
export function textoNeutro(texto: string): string {
  const t = neutralizar(texto).trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Dato faltante (`[PENDIENTE CLIENTE]`).
 * - Preview: badge amarillo (warn + texto ink, 8,3:1) para que el cliente lo vea al revisar.
 * - Producción: neutro y discreto («Por confirmar» en el color secundario), o nada si
 *   `ocultarEnProduccion`.
 */
export function Pendiente({
  children = "[PENDIENTE CLIENTE]",
  className,
  ocultarEnProduccion = false,
}: {
  children?: string;
  className?: string;
  ocultarEnProduccion?: boolean;
}) {
  if (esProduccion) {
    if (ocultarEnProduccion) return null;
    return (
      <span data-pendiente="produccion" className={cn("text-fg-muted", className)}>
        {textoNeutro(children)}
      </span>
    );
  }
  return (
    <span
      data-pendiente="preview"
      className={cn(
        "inline-block rounded-sm border border-warn bg-warn px-1.5 font-mono text-[0.8em] font-medium text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Texto del contenido que puede traer marcas en línea («Precio: [PENDIENTE CLIENTE].»):
 * en preview cada marca va en un badge; en producción, el texto neutralizado.
 */
export function ConPendientes({ children }: { children: string }) {
  if (esProduccion) return <>{neutralizar(children)}</>;
  const partes = children.split(new RegExp(`(${MARCA_PENDIENTE.source})`, "g"));
  return <>{partes.map((p, i) => (i % 2 ? <Pendiente key={i}>{p}</Pendiente> : p))}</>;
}
