import { cn } from "@/lib/utils";

/**
 * Portada tipográfica generada (título + categoría sobre color de marca): reemplaza las
 * imágenes del blog original, que el propio sitio reconoce como generadas con IA.
 */
export function PortadaArticulo({
  titulo,
  categoria,
  fecha,
  grande = false,
  className,
}: {
  titulo: string;
  categoria: string;
  fecha?: string;
  grande?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "surface-dark bg-inspeccion relative flex flex-col justify-between overflow-hidden rounded-card border border-border",
        grande ? "aspect-[4/3] p-6 sm:aspect-[2/1] sm:p-10" : "aspect-[16/10] p-5",
        className,
      )}
    >
      <span className="absolute -top-px right-0 left-0 h-1 bg-brand" />
      <span className="flex items-center justify-between gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-brand uppercase">
        <span>{categoria}</span>
        {fecha && <span className="text-fg-muted">{fecha}</span>}
      </span>
      <span
        className={cn(
          "font-display leading-[1.02] font-extrabold tracking-[-0.02em] text-paper [font-stretch:87.5%]",
          grande ? "line-clamp-4 text-[clamp(1.5rem,4vw,3rem)]" : "line-clamp-4 text-[1.35rem]",
        )}
      >
        {titulo}
      </span>
      <span className="font-mono text-[0.65rem] tracking-[0.14em] text-fg-muted uppercase">Blog · DiagnostiCAR</span>
    </div>
  );
}
