import Image from "next/image";
import type { Imagen } from "@/content/schema";
import { cn } from "@/lib/utils";

type Grupo = { titulo: string; logos: { nombre: string; logo: Imagen }[] };

/**
 * Muro de logos: placas de alto y ancho uniformes en una sola grilla (subgrid por grupo).
 * Tamaño óptico parejo: los logotipos apaisados se limitan por ancho y los emblemas
 * cuadrados por alto, siempre centrados. Los logos claros van sobre placa oscura.
 */
export function LogoWall({
  grupos,
  columnas = 4,
  className,
}: {
  grupos: Grupo[];
  /** Columnas desde 640 px (2 o 4). */
  columnas?: 2 | 4;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-3",
        columnas === 4 && "sm:grid-cols-4",
        className,
      )}
    >
      {grupos.map((g) => (
        <div
          key={g.titulo}
          className="row-span-2 grid grid-cols-subgrid grid-rows-subgrid"
          style={{ gridColumn: `span ${g.logos.length} / span ${g.logos.length}` }}
        >
          <h3 className="col-span-full self-end border-b border-border pb-2 font-mono text-eyebrow font-medium tracking-[0.12em] text-fg-muted uppercase [font-stretch:100%]">
            {g.titulo}
          </h3>
          <ul role="list" className="col-span-full mb-3 grid grid-cols-subgrid">
            {g.logos.map((l) => {
              const apaisado = l.logo.ancho / l.logo.alto >= 2.5;
              return (
                <li
                  key={l.nombre}
                  className={cn(
                    "relative aspect-[5/3] rounded-card border",
                    l.logo.fondo === "oscuro" ? "border-ink-2 bg-ink-2" : "border-border bg-white",
                  )}
                >
                  {/* Área óptica: apaisados limitados por ancho, emblemas por alto. */}
                  <div
                    className={cn(
                      "absolute",
                      apaisado ? "inset-x-[16%] inset-y-[30%]" : "inset-x-[16%] inset-y-[12%]",
                    )}
                  >
                    <Image
                      src={l.logo.src}
                      alt={l.logo.alt || l.nombre}
                      fill
                      sizes="(min-width: 640px) 180px, 35vw"
                      className="object-contain"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
