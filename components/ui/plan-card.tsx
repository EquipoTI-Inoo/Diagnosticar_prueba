import { Check } from "lucide-react";
import type { Servicio } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Price } from "./price";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Tarjeta de plan con lenguaje de «ficha de inspección»: código de plan en mono
 * (PLAN 03 / 05), cabecera con regla fina, precio grande en mono y la lista de lo que
 * incluye como renglones numerados de una hoja de inspección. La destacada va en oscuro.
 */
export function PlanCard({
  servicio,
  indice,
  total,
  ubicacion = "plan-card",
  headingLevel = 3,
  compacta = false,
  subgrid = false,
  className,
}: {
  servicio: Servicio;
  /** Posición en la escalera de planes (1-based), para el código «PLAN 03 / 05». */
  indice?: number;
  total?: number;
  ubicacion?: string;
  headingLevel?: 2 | 3;
  /** Menos padding y titular más chico (rejilla de 5 columnas). */
  compacta?: boolean;
  /**
   * La tarjeta ocupa 5 filas de la rejilla padre (`grid-rows-subgrid`): código, nombre,
   * precio, «Incluye» y botones quedan a la misma altura en todas las tarjetas de la fila.
   * Solo desde 1024 px (en el carrusel móvil la tarjeta es flex). El padre debe ser `grid`
   * con 5 filas por tarjeta (ver home-planes).
   */
  subgrid?: boolean;
  className?: string;
}) {
  const H = `h${headingLevel}` as const;
  const pad = (n: number) => String(n).padStart(2, "0");
  const px = compacta ? "px-5" : "px-6";
  const fondo = servicio.destacado ? "bg-bg" : "bg-card";
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-card border transition-colors duration-200",
        // Cuadrícula de hoja de inspección en la cabecera; el cuerpo la tapa con su fondo.
        "bg-inspeccion",
        fondo,
        "flex h-full flex-col",
        subgrid && "lg:row-span-5 lg:grid lg:grid-rows-subgrid",
        servicio.destacado ? "surface-dark border-brand" : "border-border hover:border-accent",
        className,
      )}
    >
      {/* 1 · Código del plan */}
      <div className={cn("pt-5", px)}>
        <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border pb-3 font-mono text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
          <span className="whitespace-nowrap">
            {indice && total ? (
              <>
                Plan {pad(indice)} <span aria-hidden>/</span>
                <span className="sr-only"> de </span> {pad(total)}
              </>
            ) : (
              "Plan"
            )}
          </span>
          {servicio.badge && <Badge>{servicio.badge}</Badge>}
        </div>
      </div>

      {/* 2 · Nombre y tagline */}
      <div className={px}>
        <H
          className={cn(
            "mt-4 leading-[1.1] tracking-[-0.02em]",
            compacta ? "text-[1.4rem]" : "text-[1.625rem]",
          )}
        >
          {servicio.nombre}
        </H>
        <p className="mt-1 text-[0.95rem] text-fg-muted">{servicio.tagline}</p>
      </div>

      {/* 3 · Precio (la fila del tachado se reserva siempre) */}
      <div className={cn("self-end pt-5 pb-5", px)}>
        <Price precio={servicio.precio} reservarAntes />
      </div>

      {/* 4 · Renglones de la hoja de inspección */}
      <div className={cn("flex flex-1 flex-col", px, fondo)}>
        <p className="border-t border-border-strong pt-3 pb-1 font-mono text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
          Incluye
        </p>
        <ul role="list" className="text-[0.95rem]">
          {servicio.resumen.map((b, i) => (
            <li
              key={b}
              className="grid grid-cols-[1.75rem_1fr_1rem] items-start gap-2 border-b border-border py-2.5 last:border-b-0"
            >
              <span aria-hidden className="pt-0.5 font-mono text-xs text-fg-muted">
                {pad(i + 1)}
              </span>
              <span>{b}</span>
              <Check aria-hidden className="mt-1 size-4 text-accent" strokeWidth={2} />
            </li>
          ))}
        </ul>
      </div>

      {/* 5 · Nota y botones, alineados abajo */}
      <div className={cn("flex flex-col justify-end pb-6", px, fondo)}>
        {servicio.nota && (
          <p className="mt-3 border-t border-border pt-3 text-sm text-fg-muted">{servicio.nota}</p>
        )}
        <div className="mt-5 flex flex-col gap-2.5">
          <WhatsAppButton
            servicio={servicio.nombreWhatsapp}
            ubicacion={ubicacion}
            size="sm"
            variant={servicio.destacado ? "primary" : "whatsapp"}
          >
            Reservar<span className="sr-only"> {servicio.nombre}</span>
          </WhatsAppButton>
          <Button href={servicio.href} variant="secondary" size="sm" arrow={false}>
            Ver detalle<span className="sr-only"> de {servicio.nombre}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
