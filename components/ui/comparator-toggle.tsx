"use client";

import { useId, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Lado = { etiqueta: string; items: string[] };

/**
 * Comparador «Sin diagnóstico / Con DiagnostiCAR» (patrón tabs WAI-ARIA:
 * flechas izquierda/derecha, Inicio/Fin; solo la pestaña activa es tabulable).
 */
export function ComparatorToggle({
  sin,
  con,
  className,
}: {
  sin: Lado;
  con: Lado;
  className?: string;
}) {
  const [activo, setActivo] = useState<0 | 1>(1);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const lados = [sin, con] as const;

  function onKey(e: React.KeyboardEvent) {
    const mapa: Record<string, 0 | 1> = { ArrowLeft: 0, Home: 0, ArrowRight: 1, End: 1 };
    const destino = mapa[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    setActivo(destino);
    tabs.current[destino]?.focus();
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="Comparar comprar con y sin diagnóstico"
        onKeyDown={onKey}
        className="inline-flex rounded-pill border border-border-strong p-1"
      >
        {lados.map((l, i) => (
          <button
            key={l.etiqueta}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={activo === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={activo === i ? 0 : -1}
            onClick={() => setActivo(i as 0 | 1)}
            className={cn(
              "min-h-11 rounded-pill px-5 text-[0.95rem] font-medium transition-colors duration-200",
              activo === i
                ? i === 1
                  ? "bg-brand text-ink"
                  : "bg-fg text-bg"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {l.etiqueta}
          </button>
        ))}
      </div>
      {lados.map((l, i) => (
        <div
          key={l.etiqueta}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={activo !== i}
          className="mt-6"
        >
          <ul role="list" className="divide-y divide-border border-y border-border">
            {l.items.map((item) => (
              <li key={item} className="flex gap-4 py-4">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                    i === 0 ? "bg-alert text-paper" : "bg-ok text-paper",
                  )}
                >
                  {i === 0 ? (
                    <X className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  )}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
