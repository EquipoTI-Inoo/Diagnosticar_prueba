import Image from "next/image";
import type { Imagen } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * Foto real con tratamiento editorial (recorte, leve desaturación) y pie en mono.
 * El pie sale de `imagen.pie` (definido en /content): nunca se afirma «hallazgo real»
 * por defecto. Sin pie en el contenido, no se muestra pie.
 */
export function PhotoFigure({
  imagen,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className,
}: {
  imagen: Imagen;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2.5", className)}>
      <div className={cn("relative overflow-hidden rounded-card bg-ink-2", aspect)}>
        <Image
          src={imagen.src}
          alt={imagen.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="foto-real object-cover"
          style={imagen.posicion ? { objectPosition: imagen.posicion } : undefined}
        />
      </div>
      {imagen.pie && (
        <figcaption className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {imagen.pie.tipo}
          {imagen.pie.texto && <> · {imagen.pie.texto}</>}
        </figcaption>
      )}
    </figure>
  );
}
