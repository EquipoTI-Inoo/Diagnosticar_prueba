import { ConPendientes } from "@/components/ui/pendiente";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Miga } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Cabecera de página interna: migas, eyebrow, H1 y resumen-respuesta (AEO, 40–60 palabras)
 * justo debajo del H1. `aside` = columna derecha (precio, CTA, sello…).
 */
export function PageHero({
  migas,
  eyebrow,
  titulo,
  resumen,
  children,
  aside,
  className,
}: {
  migas: Miga[];
  eyebrow?: string;
  titulo: React.ReactNode;
  resumen?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="pagina-titulo"
      className={cn("surface-dark bg-inspeccion pt-24 pb-14 lg:pt-36 lg:pb-20", className)}
    >
      <div className="container-site">
        <Breadcrumbs migas={migas} />
        <div className={cn("mt-6 grid gap-10", aside && "lg:grid-cols-12 lg:gap-6")}>
          <div className={cn(aside && "lg:col-span-7")}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 id="pagina-titulo" className={cn("text-h1", eyebrow && "mt-5")}>
              {titulo}
            </h1>
            {resumen && (
              <p className="mt-6 max-w-[40rem] text-[1.125rem] text-fg-muted">
                <ConPendientes>{resumen}</ConPendientes>
              </p>
            )}
            {children}
          </div>
          {aside && <div className="lg:col-span-5 lg:col-start-8">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
