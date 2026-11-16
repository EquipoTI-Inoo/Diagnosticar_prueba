import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Ban } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { PlanesCarrusel } from "@/components/sections/planes-carrusel";
import { TablaComparativa } from "@/components/sections/tabla-comparativa";
import { JsonLd } from "@/components/seo/json-ld";
import { PlanCard } from "@/components/ui/plan-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaServicios as p, paginaVende } from "@/content/conversion";
import { escalera, getServicio } from "@/content/servicios";
import { schemaCatalogo } from "@/lib/schema";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/servicios" });

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        migas={[{ nombre: p.h1, href: "/servicios" }]}
        eyebrow="Servicios"
        titulo={p.h1}
        resumen={p.resumen}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton ubicacion="servicios-hero" variant="primary" size="lg">
            Agendar diagnóstico
          </WhatsAppButton>
          <Link
            href="#comparativa"
            className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-6 py-3.5 font-medium text-fg hover:border-accent hover:text-accent"
          >
            Ver la tabla comparativa
          </Link>
        </div>
      </PageHero>

      <section aria-labelledby="planes-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading
            id="planes-titulo"
            eyebrow="5 planes"
            titulo="Elige cuánto quieres saber"
            acento="antes de comprar."
          />
        </div>
        <div className="mt-10">
          <PlanesCarrusel ubicacion="servicios-planes" />
        </div>
      </section>

      <section
        id="comparativa"
        aria-labelledby="comparativa-titulo"
        className="surface-light scroll-mt-20 border-t border-line pb-(--spacing-section) pt-16"
      >
        <div className="container-site">
          <SectionHeading id="comparativa-titulo" eyebrow="Comparativa" titulo={p.preguntaH2}>
            Todo lo que revisa cada plan, lado a lado. En el celular, desliza la tabla hacia la
            derecha.
          </SectionHeading>
          <div className="mt-10">
            <TablaComparativa />
          </div>
          <ul role="list" className="mt-6 space-y-2 text-sm text-muted">
            {p.notas.map((n) => (
              <li key={n} className="flex gap-2">
                <span aria-hidden className="font-mono text-brand-deep">
                  *
                </span>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="otros-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="otros-titulo"
            eyebrow="Además"
            titulo="Asesoría online y certificación para vender"
          />
          <ul role="list" className="mt-10 grid gap-4 md:grid-cols-2">
            {p.otros.map((slug) => (
              <li key={slug}>
                <PlanCard
                  servicio={getServicio(slug)}
                  ubicacion="servicios-otros"
                  mensajeWhatsapp={
                    slug === "certifica-tu-auto" ? paginaVende.mensajeWhatsapp : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="no-hacemos-titulo" className="surface-dark py-16">
        <div className="container-site grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2 font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
              <Ban aria-hidden className="size-4 text-alert-soft" strokeWidth={1.75} />
              Transparencia
            </p>
            <h2 id="no-hacemos-titulo" className="mt-3 text-h3">
              {p.noHacemos.titulo}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="font-medium text-fg">{p.noHacemos.servicio}</p>
            <p className="mt-2 text-fg-muted">{p.noHacemos.texto}</p>
            <Link
              href="/legal/terminos-y-condiciones"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline underline-offset-4"
            >
              Ver términos y condiciones
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={schemaCatalogo([...escalera, ...p.otros.map(getServicio)])} />
    </>
  );
}
