import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fechaLarga, type MetaArticulo } from "@/lib/blog";
import { cn } from "@/lib/utils";

const CODIGO: Record<string, string> = { Diagnósticos: "DX", "Tips mecánicos": "TM", Novedades: "NV" };

/**
 * Fila de índice de artículo (estilo hoja de informe): ficha tipográfica pequeña con el número
 * del artículo y el código de categoría, fecha en mono, título y resumen. Sin imágenes del blog
 * original (generadas con IA) y sin repetir el título dentro de la portada.
 */
export function TarjetaArticulo({
  a,
  numero,
  headingLevel = 3,
}: {
  a: MetaArticulo;
  numero: number;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="group relative grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line py-6 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-6">
      <div
        aria-hidden
        className="surface-dark relative flex aspect-square flex-col justify-between overflow-hidden rounded-sm border border-border p-2 sm:aspect-[4/3] sm:p-3"
      >
        <span className="absolute -top-px right-0 left-0 h-0.5 bg-brand" />
        <span className="font-mono text-[0.6rem] tracking-[0.14em] text-brand uppercase sm:text-[0.65rem]">
          {CODIGO[a.categoria] ?? "—"}
        </span>
        <span data-num-editorial className="font-mono text-[1.35rem] leading-none text-paper sm:text-[2rem]">
          {String(numero).padStart(2, "0")}
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xs tracking-wide text-muted uppercase">
          <time dateTime={a.fecha}>{fechaLarga(a.fecha)}</time>
          <span aria-hidden> · </span>
          {a.categoria}
        </p>
        <H className="mt-1.5 text-[1.125rem] leading-snug tracking-[-0.01em] sm:text-[1.3rem]">
          <Link href={`/blog/${a.slug}`} className="after:absolute after:inset-0 group-hover:text-brand-deep">
            {a.titulo}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 max-w-[70ch] text-sm text-muted">{a.resumen}</p>
      </div>
      <ArrowUpRight
        aria-hidden
        className={cn("hidden size-5 self-center text-muted transition-colors group-hover:text-brand-deep sm:block")}
        strokeWidth={1.5}
      />
    </article>
  );
}
