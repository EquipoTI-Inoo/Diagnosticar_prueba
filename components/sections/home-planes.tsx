import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/ui/plan-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stepper } from "@/components/ui/stepper";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { home } from "@/content/home";
import { etapas } from "@/content/navegacion";
import { proceso } from "@/content/proceso";
import { escalera } from "@/content/servicios";

/** §5.1.5 Planes + §5.1.6 Etapas + §5.1.7 Pasos. */
export function HomePlanes() {
  return (
    <>
      <section
        id="planes"
        aria-labelledby="planes-titulo"
        className="surface-light scroll-mt-16 py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="planes-titulo"
            eyebrow={home.planes.eyebrow}
            titulo={home.planes.titulo}
            acento={home.planes.tituloAcento}
          />
        </div>
        {/* Carrusel con snap en móvil/tablet, rejilla de 5 en escritorio */}
        <div className="container-site mt-10 px-0 lg:px-(--spacing-gutter)">
          <ul
            role="list"
            tabIndex={0}
            aria-label="Planes (desliza para ver todos)"
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-4 outline-offset-4 lg:grid lg:grid-cols-5 lg:grid-rows-[auto_auto_auto_1fr_auto] lg:gap-y-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {escalera.map((s, i) => (
              <li
                key={s.slug}
                className="w-[82%] max-w-[24rem] shrink-0 snap-start sm:w-[46%] lg:row-span-5 lg:grid lg:w-auto lg:max-w-none lg:grid-rows-subgrid"
              >
                <PlanCard
                  servicio={s}
                  indice={i + 1}
                  total={escalera.length}
                  ubicacion="home-planes"
                  compacta
                  subgrid
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{home.planes.nota}</p>
          <Link
            href="/servicios"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
          >
            {home.planes.comparar}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="etapas-titulo"
        className="surface-dark bg-inspeccion py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="etapas-titulo"
            eyebrow={home.etapas.eyebrow}
            titulo={home.etapas.titulo}
          />
          <ol role="list" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {etapas.map((e, i) => {
              const destacada = e.enlaces.some((l) => l.whatsapp);
              return (
                <li
                  key={e.titulo}
                  className={`flex flex-col rounded-card border p-6 ${destacada ? "border-brand bg-ink-2" : "border-border bg-ink"}`}
                >
                  <p className="font-mono text-xs tracking-[0.14em] text-fg-muted uppercase">
                    Etapa {String(i + 1).padStart(2, "0")}
                  </p>
                  {/* Barra de progreso de la etapa */}
                  <div aria-hidden className="mt-3 grid grid-cols-4 gap-1">
                    {[0, 1, 2, 3].map((k) => (
                      <span
                        key={k}
                        className={`h-1 rounded-full ${k <= i ? "bg-brand" : "bg-border"}`}
                      />
                    ))}
                  </div>
                  <h3 className="mt-5 text-h3">{e.titulo}</h3>
                  <p className="mt-2 flex-1 text-fg-muted">{e.texto}</p>
                  <ul role="list" className="mt-5 flex flex-wrap gap-2">
                    {e.enlaces.map((l) =>
                      l.whatsapp ? (
                        <li key={l.label} className="w-full">
                          <WhatsAppButton
                            ubicacion="home-etapas"
                            variant="primary"
                            className="w-full"
                          >
                            {l.label}
                          </WhatsAppButton>
                        </li>
                      ) : (
                        <li key={l.label}>
                          <Link
                            href={l.href}
                            className="inline-flex min-h-11 items-center rounded-pill border border-border-strong px-4 text-sm hover:border-accent hover:text-accent"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="pasos-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading
            id="pasos-titulo"
            eyebrow={home.pasos.eyebrow}
            titulo={home.pasos.titulo}
            acento={home.pasos.tituloAcento}
          />
          <Stepper pasos={proceso} className="mt-12" />
          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsAppButton ubicacion="home-pasos" variant="primary">
              Empezar por WhatsApp
            </WhatsAppButton>
            <Button href="/como-funciona" variant="secondary" arrow={false}>
              Cómo funciona en detalle
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
