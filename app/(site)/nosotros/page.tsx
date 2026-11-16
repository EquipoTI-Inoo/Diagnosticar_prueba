import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { Counter } from "@/components/ui/counter";
import { LogoWall } from "@/components/ui/logo-wall";
import { Pendiente } from "@/components/ui/pendiente";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaNosotros as p } from "@/content/educativo";
import { medios } from "@/content/medios";
import { negocio } from "@/content/negocio";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/nosotros" });

export default function NosotrosPage() {
  // Única aparición de la foto del equipo en las páginas de la Fase 4.
  const equipo = medios.confianza.tecnicos!;
  return (
    <>
      <PageHero migas={[{ nombre: "Nosotros", href: "/nosotros" }]} eyebrow="Nosotros" titulo={p.titulo} resumen={p.bajada} />

      <section aria-labelledby="historia-t" className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <SectionHeading id="historia-t" eyebrow="Historia" titulo="Por qué existimos" />
            <p className="mt-6 text-[1.0625rem] leading-relaxed">{p.historia}</p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{p.porQueExistimos}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <PhotoFigure imagen={equipo} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 460px, 100vw" />
          </div>
        </div>
      </section>

      <section aria-labelledby="mision-t" className="surface-dark py-(--spacing-section)">
        <div className="container-site">
          <h2 id="mision-t" className="sr-only">
            Misión y visión
          </h2>
          <dl className="grid gap-10 md:grid-cols-2">
            <div className="border-t border-border pt-6">
              <dt className="font-mono text-eyebrow tracking-[0.12em] text-brand uppercase">Misión</dt>
              <dd className="mt-3 text-[1.125rem] leading-relaxed">{p.mision}</dd>
            </div>
            <div className="border-t border-border pt-6">
              <dt className="font-mono text-eyebrow tracking-[0.12em] text-brand uppercase">Visión</dt>
              <dd className="mt-3 text-[1.125rem] leading-relaxed">{p.vision}</dd>
            </div>
          </dl>
          <dl className="mt-16 grid grid-cols-1 border-t border-border sm:grid-cols-3">
            {p.contadores.map((c) => (
              <div key={c.etiqueta} className="flex flex-col border-b border-border py-6 sm:border-b-0 sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
                <dt className="order-2 mt-1 text-fg-muted">{c.etiqueta}</dt>
                <dd className="order-1">
                  <Counter display={c.valor} className="text-[3rem] leading-none font-medium" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="respaldo-t" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading id="respaldo-t" eyebrow="Respaldo" titulo="Equipos, medios y automovilismo" />
          <LogoWall
            className="mt-10"
            grupos={[
              {
                titulo: "Equipos de",
                logos: negocio.aliados.filter((a) => a.vigente && a.logo).map((a) => ({ nombre: a.nombre, logo: a.logo! })),
              },
              { titulo: "Estamos en los medios", logos: negocio.medios },
              { titulo: "Apoyamos el automovilismo", logos: negocio.automovilismo },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="equipo-t" className="surface-light border-t border-line py-16">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <h2 id="equipo-t" className="text-h3">
              El equipo
            </h2>
            <p className="mt-3 text-muted">
              <Pendiente>{p.equipo}</Pendiente>
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-h3">Datos legales</h2>
            <dl className="mt-3 divide-y divide-line border-y border-line">
              {p.legales.map((d) => (
                <div key={d.t} className="grid grid-cols-[9rem_1fr] gap-3 py-3 text-sm">
                  <dt className="font-mono text-xs tracking-wide text-muted uppercase">{d.t}</dt>
                  <dd>{d.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-n" className="surface-dark bg-inspeccion py-16">
        <div className="container-site flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="cta-n" className="max-w-[22ch] text-h2">
            ¿Listo para conocer el estado real de tu próximo auto?
          </h2>
          <WhatsAppButton ubicacion="nosotros-cta" variant="primary" size="lg">
            Agendar diagnóstico
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
