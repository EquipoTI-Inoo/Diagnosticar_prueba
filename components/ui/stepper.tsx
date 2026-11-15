import type { Paso } from "@/content/schema";
import { cn } from "@/lib/utils";

/** Proceso en pasos numerados 01–04 (lista ordenada; horizontal desde 1024 px). */
export function Stepper({ pasos, className }: { pasos: Paso[]; className?: string }) {
  return (
    <ol role="list" className={cn("grid gap-0 lg:grid-cols-4 lg:gap-6", className)}>
      {pasos.map((p, i) => (
        <li key={p.numero} className="relative flex gap-5 pb-8 lg:flex-col lg:gap-4 lg:pb-0">
          {/* línea conectora */}
          {i < pasos.length - 1 && (
            <span
              aria-hidden
              className="absolute top-12 bottom-0 left-6 w-px bg-border lg:top-6 lg:right-[-1.5rem] lg:bottom-auto lg:left-14 lg:h-px lg:w-auto"
            />
          )}
          <span
            aria-hidden
            className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-accent bg-bg font-mono text-sm font-medium text-accent"
          >
            {p.numero}
          </span>
          <div>
            <h3 className="text-h3">
              <span className="sr-only">Paso {Number(p.numero)}: </span>
              {p.titulo}
            </h3>
            <p className="mt-1.5 text-fg-muted">{p.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
