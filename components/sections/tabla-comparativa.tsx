import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import {
  columnasComparativa,
  comparativa,
  paginaServicios,
  type Celda,
} from "@/content/conversion";
import { getServicio } from "@/content/servicios";
import type { ServicioSlug } from "@/content/schema";
import { cn, formatPEN } from "@/lib/utils";
import { VistaComparativa } from "./vista-comparativa";

function Valor({ celda }: { celda: Celda }) {
  if (celda === "si")
    return (
      <>
        <Check aria-hidden className="mx-auto size-5 text-accent" strokeWidth={2.25} />
        <span className="sr-only">Incluido</span>
      </>
    );
  if (celda === "no")
    return (
      <>
        <Minus aria-hidden className="mx-auto size-4 text-fg-muted" strokeWidth={1.5} />
        <span className="sr-only">No incluido</span>
      </>
    );
  if (celda === "confirmar")
    return (
      <span className="font-mono text-[0.72rem] tracking-wide text-fg-muted uppercase">
        Por confirmar
      </span>
    );
  return <span className="text-sm">{celda}</span>;
}

/**
 * Tabla comparativa HTML real (§5.2): <caption>, <th scope="col"> por plan y <th scope="row">
 * por característica. Móvil/tablet: región con scroll horizontal accesible (tabindex=0, role=region,
 * aria-label, foco visible) y primera columna fija de 144 px. Escritorio (≥1024): la tabla se ve
 * completa (overflow visible) y la cabecera es sticky respecto de la página, bajo el header compacto.
 */
export function TablaComparativa() {
  const cols = columnasComparativa.map((c) => getServicio(c as ServicioSlug));
  return (
    <VistaComparativa>
      <div
        tabIndex={0}
        role="region"
        aria-label="Tabla comparativa de planes (desplazable)"
        className="relative overflow-x-auto rounded-card border border-line bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep lg:overflow-visible"
      >
        <table className="w-full min-w-[42rem] border-separate border-spacing-0 text-left lg:min-w-0">
          <caption className="sr-only">{paginaServicios.tablaCaption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-30 w-36 min-w-36 border-b border-line bg-paper px-3 py-3 align-bottom font-mono text-[0.68rem] font-medium tracking-[0.14em] text-muted uppercase lg:top-16 lg:w-[28%] lg:p-4"
              >
                Característica
              </th>
              {cols.map((s) => (
                <th
                  key={s.slug}
                  scope="col"
                  className={cn(
                    "z-20 min-w-[6.75rem] border-b border-line px-2 py-3 text-center align-bottom lg:sticky lg:top-16 lg:p-4",
                    s.destacado ? "bg-ink text-paper" : "bg-paper",
                  )}
                >
                  {s.badge && (
                    <span className="mb-2 block font-mono text-[0.62rem] tracking-[0.14em] text-brand uppercase">
                      {s.badge}
                    </span>
                  )}
                  <Link
                    href={s.href}
                    className="block font-display text-[1.05rem] leading-tight font-extrabold underline-offset-4 hover:underline"
                  >
                    {s.nombre}
                  </Link>
                  <span className="mt-2 block font-mono">
                    {s.precio.antes !== null && (
                      <s
                        className={cn(
                          "mr-1.5 text-xs",
                          s.destacado ? "text-ink-muted" : "text-muted",
                        )}
                      >
                        <span className="sr-only">Antes </span>
                        {formatPEN(s.precio.antes)}
                      </s>
                    )}
                    <span className="text-lg">
                      {s.precio.antes !== null && <span className="sr-only">Ahora </span>}
                      {s.precio.actual !== null ? formatPEN(s.precio.actual) : "—"}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparativa.map((f) => (
              <tr key={f.id} className="group">
                <th
                  scope="row"
                  className="sticky left-0 z-10 w-36 min-w-36 border-b border-line bg-white px-3 py-3 text-[0.875rem] leading-snug font-medium group-hover:bg-paper lg:p-4 lg:text-[0.95rem]"
                >
                  {f.caracteristica}
                  {f.nota && (
                    <span className="mt-1 block text-xs font-normal text-muted">{f.nota}</span>
                  )}
                </th>
                {cols.map((s) => (
                  <td
                    key={s.slug}
                    className={cn(
                      "border-b border-line px-2 py-3 text-center group-hover:bg-paper lg:p-4",
                      s.destacado && "bg-brand/[0.06]",
                    )}
                  >
                    <Valor celda={f.celdas[s.slug] ?? "no"} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-white p-4 text-[0.95rem] font-medium"
              >
                Reservar
              </th>
              {cols.map((s) => (
                <td
                  key={s.slug}
                  className={cn("p-3 text-center", s.destacado && "bg-brand/[0.06]")}
                >
                  <WhatsAppButton
                    servicio={s.nombreWhatsapp}
                    ubicacion="servicios-tabla"
                    variant={s.destacado ? "primary" : "whatsapp"}
                    size="sm"
                    className="w-full px-3 text-sm"
                  >
                    Reservar<span className="sr-only"> {s.nombre}</span>
                  </WhatsAppButton>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </VistaComparativa>
  );
}
