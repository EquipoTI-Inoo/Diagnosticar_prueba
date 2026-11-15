import Image from "next/image";
import type { Imagen } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * Foto real con tratamiento editorial (recorte, leve desaturación) y pie en mono.
 * Ej.: «Hallazgo real · Fugas de aceite».
 */
export function PhotoFigure({
  imagen,
  pie,
  tipo = "Hallazgo real",
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className,
}: {
  imagen: Imagen;
  pie?: string;
  tipo?: string;
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
        />
      </div>
      {(pie || tipo) && (
        <figcaption className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {tipo}
          {pie && <> · {pie}</>}
        </figcaption>
      )}
    </figure>
  );
}
