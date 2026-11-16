import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { MapaLima } from "@/components/sections/mapa-lima";
import { PageHero } from "@/components/sections/page-hero";
import { DistrictList } from "@/components/ui/district-chip";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { cobertura } from "@/content/cobertura";
import { paginaCobertura as p } from "@/content/conversion";
import { negocio } from "@/content/negocio";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/cobertura" });

export default function CoberturaPage() {
  return (
    <>
      <PageHero
        migas={[{ nombre: p.h1, href: "/cobertura" }]}
        eyebrow="A domicilio · Lima Metropolitana"
        titulo={p.h1}
        resumen={p.resumen}
      />
      <section
        aria-labelledby="distritos-titulo"
        className="surface-dark border-t border-border pb-(--spacing-section) pt-12"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <SectionHeading
              id="distritos-titulo"
              eyebrow={`${cobertura.sinRecargo.length} distritos`}
              titulo="Sin recargo de traslado"
            />
            <DistrictList distritos={cobertura.sinRecargo} className="mt-8" />
            <div className="mt-10 rounded-card border border-border p-6">
              <p className="font-medium text-fg">{p.otroDistrito}</p>
              <div className="mt-4">
                <WhatsAppButton
                  mensaje={p.mensajeWhatsapp}
                  servicio="cobertura"
                  ubicacion="cobertura-otro-distrito"
                >
                  Consultar mi distrito
                </WhatsAppButton>
              </div>
            </div>
          </div>
          <figure className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-card border border-border bg-ink-2 p-4">
              <MapaLima distritos={cobertura.sinRecargo} oficina={negocio.direccion.distrito} />
            </div>
            <figcaption className="mt-3 font-mono text-xs tracking-wide text-fg-muted uppercase">
              {p.mapaNota}
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
