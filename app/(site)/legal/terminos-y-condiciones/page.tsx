import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { paginasLegales } from "@/content/educativo";
import { educativoFuente } from "@/content/educativo-fuente";
import { slugify } from "@/lib/utils";

const p = paginasLegales.terminos;

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/legal/terminos-y-condiciones" },
};

/**
 * T&C LITERALES (§5.14): cada sección y párrafo sale tal cual de
 * paginas[slug=terminos-y-condiciones].texto. Solo maquetación (índice y anclas).
 * `npm run check:tyc` compara el texto renderizado con el JSON.
 */
export default function TerminosPage() {
  const secciones = educativoFuente.tyc.map((s) => ({ ...s, id: slugify(s.titulo) }));
  return (
    <>
      <PageHero migas={[{ nombre: p.h1, href: "/legal/terminos-y-condiciones" }]} eyebrow="Legal" titulo={p.h1} resumen={p.nota} />
      <div className="surface-light py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <nav aria-labelledby="tyc-indice" className="lg:sticky lg:top-24 lg:col-span-3 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
            <h2 id="tyc-indice" className="font-mono text-eyebrow font-medium tracking-[0.12em] text-muted uppercase [font-stretch:100%]">
              Índice
            </h2>
            <ol className="mt-3 border-l border-line text-sm">
              {secciones.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex min-h-11 items-center gap-2 py-1 pl-3 text-muted hover:text-brand-deep lg:min-h-8">
                    <span aria-hidden className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article id="tyc-texto" className="min-w-0 max-w-[70ch] lg:col-span-8 lg:col-start-5">
            {secciones.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-line pt-8 pb-4 first:border-t-0 first:pt-0">
                <h2 id={`${s.id}-t`} className="text-[1.5rem] leading-tight tracking-[-0.01em]">
                  {s.titulo}
                </h2>
                {s.parrafos.map((par, i) => (
                  <p key={i} className="mt-4 leading-relaxed">
                    {par}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
