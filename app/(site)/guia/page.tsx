import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ACTUALIZADO, paginaGuia as p } from "@/content/educativo";
import { getServicio } from "@/content/servicios";
import { schemaArticulo } from "@/lib/schema";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/guia", ogPropia: true });

const SUBPAGINAS = [
  { href: "/guia/checklist", titulo: "Checklist imprimible", texto: "Los 7 puntos a revisar cuando vayas a ver el auto." },
  { href: "/guia/problemas-comunes", titulo: "Problemas más comunes", texto: "Frecuencia real sobre los autos que revisamos." },
  { href: "/guia/consulta-placa-gratis", titulo: "Consulta de placa gratis", texto: "SOAT y Revisión Técnica vigentes, sin costo." },
];

export default function GuiaPage() {
  return (
    <>
      <PageHero migas={[{ nombre: "Guía", href: "/guia" }]} eyebrow="Guía de compra" titulo={p.h1} resumen={p.resumen}>
        <p className="mt-6 font-mono text-xs tracking-wide text-fg-muted uppercase">
          Actualizado: <time dateTime={ACTUALIZADO.iso}>{ACTUALIZADO.texto}</time> · Equipo DiagnostiCAR
        </p>
      </PageHero>

      <div className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          {/* Índice */}
          <nav aria-labelledby="indice-titulo" className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
            <h2 id="indice-titulo" className="font-mono text-eyebrow font-medium tracking-[0.12em] text-muted uppercase [font-stretch:100%]">
              Índice
            </h2>
            <ol className="mt-4 space-y-4 text-sm">
              {p.partes.map((parte) => (
                <li key={parte.id}>
                  <a href={`#${parte.id}`} className="inline-flex min-h-11 items-center font-medium hover:text-brand-deep lg:min-h-8">
                    {parte.titulo}
                  </a>
                  <ol className="mt-1 border-l border-line">
                    {parte.secciones.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="flex min-h-11 items-center py-1 pl-3 text-muted hover:text-brand-deep lg:min-h-8">
                          {s.titulo}
                        </a>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
              <li>
                <a href="#conclusion" className="inline-flex min-h-11 items-center font-medium hover:text-brand-deep lg:min-h-8">
                  3. En resumen
                </a>
              </li>
            </ol>
          </nav>

          <article className="min-w-0 lg:col-span-8 lg:col-start-5">
            <p className="text-[1.125rem] leading-relaxed">{p.intro}</p>
            <p className="mt-6 border-l-2 border-brand-deep pl-4">{p.dato}</p>

            {p.partes.map((parte) => (
              <section key={parte.id} id={parte.id} aria-labelledby={`${parte.id}-t`} className="scroll-mt-24 pt-16">
                <h2 id={`${parte.id}-t`} className="text-h2">
                  {parte.titulo}
                </h2>
                <p className="mt-3 max-w-[60ch] text-muted">{parte.bajada}</p>
                {parte.secciones.map((s) => (
                  <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24 border-t border-line pt-8 mt-10">
                    <h3 id={`${s.id}-t`} className="text-h3">
                      {s.titulo}
                    </h3>
                    {s.texto.map((t) => (
                      <p key={t} className="mt-3 max-w-[64ch] text-[1.0625rem] leading-relaxed">
                        {t}
                      </p>
                    ))}
                    {s.consulta && (
                      <aside aria-label={`Dónde se consulta: ${s.titulo}`} className="mt-5 flex gap-4 rounded-card border border-line bg-white p-4">
                        <Search aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-deep" strokeWidth={1.75} />
                        <div>
                          <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">Dónde se consulta</p>
                          <p className="mt-1 font-medium">{s.consulta.donde}</p>
                          <p className="text-sm text-muted">{s.consulta.detalle}</p>
                        </div>
                      </aside>
                    )}
                  </section>
                ))}
              </section>
            ))}

            <section id="conclusion" aria-labelledby="conclusion-t" className="scroll-mt-24 pt-16">
              <h2 id="conclusion-t" className="text-h2">
                3. En resumen
              </h2>
              <p className="mt-4 max-w-[64ch] text-[1.0625rem]">{p.conclusion}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppButton servicio={getServicio("diagnosticar").nombreWhatsapp} ubicacion="guia-conclusion" variant="primary">
                  Agendar diagnóstico
                </WhatsAppButton>
                <Link href="/servicios" className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-5 font-medium hover:border-accent hover:text-accent">
                  Ver planes y precios
                </Link>
              </div>
            </section>

            <section aria-labelledby="sub-t" className="mt-16 border-t border-line pt-10">
              <h2 id="sub-t" className="font-mono text-eyebrow font-medium tracking-[0.12em] text-muted uppercase [font-stretch:100%]">
                Sigue con
              </h2>
              <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
                {SUBPAGINAS.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="group grid min-h-16 grid-cols-[1fr_auto] items-center gap-4 py-4">
                      <span>
                        <span className="block font-medium group-hover:text-brand-deep">{s.titulo}</span>
                        <span className="block text-sm text-muted">{s.texto}</span>
                      </span>
                      <ArrowRight aria-hidden className="size-4 text-brand-deep" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </div>

      <JsonLd
        data={schemaArticulo({
          tipo: "Article",
          titulo: p.h1,
          descripcion: p.resumen,
          path: "/guia",
          publicado: ACTUALIZADO.iso,
        })}
      />
    </>
  );
}
