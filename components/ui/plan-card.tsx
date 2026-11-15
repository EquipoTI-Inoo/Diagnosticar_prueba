import { Check } from "lucide-react";
import type { Servicio } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Price } from "./price";
import { WhatsAppButton } from "./whatsapp-button";

/**
 * Tarjeta de plan: badge, nombre, tagline, precio tachado/vigente, lista con checks y 2 CTA.
 * La tarjeta destacada («Más elegido») se pinta en superficie oscura dentro de fondos claros.
 */
export function PlanCard({
  servicio,
  ubicacion = "plan-card",
  headingLevel = 3,
  className,
}: {
  servicio: Servicio;
  ubicacion?: string;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const H = `h${headingLevel}` as const;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-card border p-6 transition-colors duration-200",
        servicio.destacado
          ? "surface-dark border-brand"
          : "border-border bg-card hover:border-accent",
        className,
      )}
    >
      <div className="flex min-h-6 items-start justify-between gap-3">
        {servicio.badge ? <Badge>{servicio.badge}</Badge> : <span />}
      </div>
      <H className="mt-4 text-h3">{servicio.nombre}</H>
      <p className="mt-1 text-fg-muted">{servicio.tagline}</p>
      <Price precio={servicio.precio} className="mt-6" />
      <ul className="mt-6 flex-1 space-y-2.5 text-[0.95rem]" role="list">
        {servicio.resumen.map((b) => (
          <li key={b} className="flex gap-2.5">
            <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {servicio.nota && <p className="mt-5 text-sm text-fg-muted">{servicio.nota}</p>}
      <div className="mt-6 flex flex-col gap-2.5">
        <WhatsAppButton
          servicio={servicio.nombreWhatsapp}
          ubicacion={ubicacion}
          variant={servicio.destacado ? "primary" : "whatsapp"}
        >
          Reservar
        </WhatsAppButton>
        <Button href={servicio.href} variant="secondary" arrow={false}>
          Ver detalle<span className="sr-only"> de {servicio.nombre}</span>
        </Button>
      </div>
    </article>
  );
}
