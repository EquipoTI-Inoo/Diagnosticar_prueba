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
 * por característica. Cabecera sticky y primera columna fija dentro de una región desplazable
 * accesible (tabindex=0, role=region, aria-label, foco visible).
 */
export function TablaComparativa() {
  const cols = columnasComparativa.map((c) => getServicio(c as ServicioSlug));
  return (
    <VistaComparativa>
      <div
        tabIndex={0}
        role="region"
        aria-label="Tabla comparativa de planes (desplazable)"
        className="max-h-[80vh] overflow-auto rounded-card border border-line bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
      >
        <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">{paginaServicios.tablaCaption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 left-0 z-30 w-[28%] border-b border-line bg-paper p-4 align-bottom font-mono text-[0.7rem] font-medium tracking-[0.14em] text-muted uppercase"
              >
                Característica
              </th>
              {cols.map((s) => (
                <th
                  key={s.slug}
                  scope="col"
                  className={cn(
                    "sticky top-0 z-20 border-b border-line p-4 text-center align-bottom",
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
                  className="sticky left-0 z-10 border-b border-line bg-white p-4 text-[0.95rem] font-medium group-hover:bg-paper"
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
                      "border-b border-line p-4 text-center group-hover:bg-paper",
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
