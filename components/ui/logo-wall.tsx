import Image from "next/image";
import type { Imagen } from "@/content/schema";
import { cn } from "@/lib/utils";

type Grupo = { titulo: string; logos: { nombre: string; logo: Imagen }[] };

/** Muro de logos por grupos (aliados, medios, automovilismo). Los logos van en placa blanca. */
export function LogoWall({ grupos, className }: { grupos: Grupo[]; className?: string }) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-3", className)}>
      {grupos.map((g) => (
        <div key={g.titulo}>
          <h3 className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase [font-stretch:100%] font-medium">
            {g.titulo}
          </h3>
          <ul role="list" className="mt-4 flex flex-wrap gap-3">
            {g.logos.map((l) => (
              <li
                key={l.nombre}
                className={cn(
                  "grid h-20 min-w-36 place-items-center rounded-card border px-5",
                  l.logo.fondo === "oscuro" ? "border-ink-2 bg-ink-2" : "border-border bg-white",
                )}
              >
                <Image
                  src={l.logo.src}
                  alt={l.logo.alt || l.nombre}
                  width={l.logo.ancho}
                  height={l.logo.alto}
                  sizes="160px"
                  className="h-auto max-h-14 w-auto max-w-36 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
