import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComparatorToggle } from "@/components/ui/comparator-toggle";
import { FindingMeter } from "@/components/ui/finding-meter";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { SectionHeading } from "@/components/ui/section-heading";
import { comparador } from "@/content/comparador";
import { home } from "@/content/home";
import { problemas, problemasFuente } from "@/content/problemas";

/** §5.1.3 Problemas más comunes (hoja de inspección) + §5.1.4 comparador. */
export function HomeEvidencia() {
  const principal = problemas[0]!;
  const fotos = problemas.filter((p) => p.muestraHallazgo);
  return (
    <>
      <section aria-labelledby="problemas-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5 lg:pr-8">
            <SectionHeading
              id="problemas-titulo"
              eyebrow="Hallazgos"
              titulo={home.problemas.titulo}
            >
              {home.problemas.subtitulo}
            </SectionHeading>
            {/* Frase-dato citable, construida con los datos de problemas.ts */}
            <p className="mt-6 border-l-2 border-accent pl-4 text-fg">
              Según {problemasFuente.charAt(0).toLowerCase() + problemasFuente.slice(1)} de
              DiagnostiCAR, {principal.casos} de cada {principal.base} autos usados que revisamos
              tenían {principal.titulo.toLowerCase()}.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {fotos.slice(0, 2).map((p) => (
                <PhotoFigure
                  key={p.slug}
                  imagen={p.imagen}
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 1024px) 20vw, 50vw"
                />
              ))}
            </div>
            <Link
              href="/guia/problemas-comunes"
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
            >
              {home.problemas.cta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-card border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">
                <span>Hallazgo</span>
                <span>Frecuencia</span>
              </div>
              <ol role="list">
                {problemas.map((p, i) => (
                  <li key={p.slug} className="border-b border-line px-5 py-4 last:border-b-0">
                    <div className="grid grid-cols-[2rem_1fr] gap-x-2">
                      <span aria-hidden className="pt-0.5 font-mono text-xs text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-sans text-[1.0625rem] font-medium tracking-normal [font-stretch:100%]">
                          {p.titulo}
                        </h3>
                        {p.detalle && <p className="text-sm text-muted">{p.detalle}</p>}
                        <FindingMeter casos={p.casos} base={p.base} className="mt-2.5" />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="border-t border-line bg-paper px-5 py-3 font-mono text-xs text-muted">
                Fuente: {problemasFuente}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="comparador-titulo" className="surface-dark py-(--spacing-section)">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-6">
          <SectionHeading
            id="comparador-titulo"
            eyebrow={home.comparador.eyebrow}
            titulo={home.comparador.titulo}
            acento={home.comparador.tituloAcento}
            className="lg:col-span-5"
          >
            {home.comparador.texto}
          </SectionHeading>
          <div className="lg:col-span-6 lg:col-start-7">
            <ComparatorToggle sin={comparador.sin} con={comparador.con} />
          </div>
        </div>
      </section>
    </>
  );
}
