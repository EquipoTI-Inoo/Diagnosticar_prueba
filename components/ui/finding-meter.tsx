"use client";

import { cn } from "@/lib/utils";
import { useInViewOnce } from "./use-in-view";

export type Tono = "ok" | "warn" | "alert";

/** Umbrales del semáforo de hallazgos (frecuencia del problema). Ver docs/DECISIONES.md. */
export function tonoFrecuencia(casos: number, base: number): Tono {
  const r = casos / base;
  if (r >= 0.5) return "alert";
  if (r >= 0.2) return "warn";
  return "ok";
}

const fill: Record<Tono, string> = { ok: "bg-ok", warn: "bg-warn", alert: "bg-alert" };
const CELDAS = 10;

/**
 * Medidor de hallazgo: barra segmentada de 10 celdas en semáforo + cifra en mono.
 * Las celdas se llenan una vez al entrar al viewport (respeta prefers-reduced-motion vía CSS).
 */
export function FindingMeter({
  casos,
  base,
  className,
}: {
  casos: number;
  base: number;
  className?: string;
}) {
  const { ref, visto } = useInViewOnce<HTMLDivElement>();
  const tono = tonoFrecuencia(casos, base);
  // Escala a 10 celdas; un valor muy bajo (1/1000) muestra una astilla visible.
  const llenas = (casos / base) * CELDAS;
  const etiqueta = `${casos} de cada ${base.toLocaleString("es-PE")} autos`;

  return (
    <div ref={ref} className={cn("flex items-center gap-4", className)}>
      <div role="img" aria-label={etiqueta} className="grid flex-1 grid-cols-10 gap-1">
        {Array.from({ length: CELDAS }, (_, i) => {
          const parcial = Math.max(0, Math.min(1, llenas - i));
          const ancho = parcial > 0 ? Math.max(parcial, 0.12) : 0;
          return (
            <span key={i} className="relative h-3 overflow-hidden rounded-[2px] bg-meter-empty">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 transition-[width] duration-500 ease-out-soft",
                  fill[tono],
                )}
                style={{ width: `${(visto ? ancho : 0) * 100}%`, transitionDelay: `${i * 45}ms` }}
              />
            </span>
          );
        })}
      </div>
      <p aria-hidden className="shrink-0 font-mono text-sm text-fg">
        <span className="text-lg font-medium">{casos}</span>
        <span className="text-fg-muted"> / {base.toLocaleString("en-US")}</span>
      </p>
    </div>
  );
}
