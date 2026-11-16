import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Pendiente } from "@/components/ui/pendiente";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { VerifiedSeal } from "@/components/ui/verified-seal";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaVende as p } from "@/content/conversion";
import { faqs } from "@/content/faqs";
import { getServicio } from "@/content/servicios";
import { schemaFaq, schemaServicio } from "@/lib/schema";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/vende-tu-auto" });

const pad = (n: number) => String(n).padStart(2, "0");

export default function VendeTuAutoPage() {
  const faqsCert = faqs.filter((f) => f.categoria === "certificacion");
  const cert = getServicio("certifica-tu-auto");
  return (
    <>
      <PageHero
        migas={[{ nombre: "Vende tu auto", href: "/vende-tu-auto" }]}
        eyebrow="Certifica tu auto · Vehículo verificado"
        titulo={p.h1}
        resumen={p.resumen}
        aside={
          <div className="rounded-card border border-border bg-ink-2 p-6">
            <p className="text-[1.0625rem] text-fg">{p.sub}</p>
            <div className="mt-5 border-t border-border pt-5">
              <p className="font-mono text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
                Precio
              </p>
              <Price precio={p.precio} className="mt-2" />
            </div>
            <div className="mt-6">
              <WhatsAppButton
                mensaje={p.mensajeWhatsapp}
                servicio={cert.nombreWhatsapp}
                ubicacion="vende-hero"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Certificar mi auto
              </WhatsAppButton>
            </div>
          </div>
        }
      />

      {/* Beneficios: 4 renglones numerados, no tarjetas con ícono */}
      <section aria-labelledby="beneficios-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading
            id="beneficios-titulo"
            eyebrow="Beneficios"
            titulo="Vender con datos,"
            acento="no con promesas."
          />
          <ol role="list" className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {p.beneficios.map((b, i) => (
              <li
                key={b.titulo}
                className="border-b border-line py-6 sm:pr-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <p aria-hidden className="font-mono text-xs text-muted">
                  {pad(i + 1)}
                </p>
                <h3 className="mt-2 text-h3">{b.titulo}</h3>
                <p className="mt-2 text-muted">{b.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">
            Alcance: {p.cifras.leads} y {p.cifras.seguidores}{" "}
            <Pendiente>{p.cifras.marca}</Pendiente>
          </p>
        </div>
      </section>

      {/* Qué incluye */}
      <section
        aria-labelledby="incluye-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="incluye-titulo"
            eyebrow="Hoja de certificación"
            titulo="¿Qué incluye la certificación?"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {p.incluye.map((g, gi) => (
              <section
                key={g.titulo}
                aria-labelledby={`incluye-${gi}`}
                className="rounded-card border border-line bg-white"
              >
                <h3
                  id={`incluye-${gi}`}
                  className="flex items-baseline gap-3 border-b border-line px-5 py-4 text-[1.25rem]"
                >
                  <span aria-hidden className="font-mono text-xs font-normal text-muted">
                    {pad(gi + 1)}
                  </span>
                  {g.titulo}
                </h3>
                <ul role="list">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="grid grid-cols-[1fr_1.25rem] gap-3 border-b border-line px-5 py-3 last:border-b-0"
                    >
                      <span>{it}</span>
                      <Check aria-hidden className="mt-1 size-4 text-brand-deep" strokeWidth={2} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* Sello */}
      <section
        aria-labelledby="sello-titulo"
        className="surface-dark bg-inspeccion py-(--spacing-section)"
      >
        <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <figure className="lg:col-span-5">
            <VerifiedSeal className="mx-auto max-w-72" />
            <figcaption className="mt-4 text-center font-mono text-xs tracking-wide text-fg-muted uppercase">
              Mockup · QR ilustrativo, no escaneable
            </figcaption>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="sello-titulo"
              eyebrow="Sello de confianza"
              titulo="Vehículo verificado por"
              acento="DiagnostiCAR."
            />
            <p className="mt-6 text-fg-muted">
              Al certificar tu auto recibes un sello digital oficial con:
            </p>
            <ul role="list" className="mt-3 space-y-2">
              {p.sello.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2} />
                  {x}
                </li>
              ))}
            </ul>
            <h3 className="mt-8 font-mono text-eyebrow font-medium tracking-[0.12em] text-fg-muted uppercase [font-stretch:100%]">
              ¿Por qué importa?
            </h3>
            <ul role="list" className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.importa.map((x) => (
                <li key={x} className="border-l border-accent pl-3 text-fg">
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-fg-muted">
              {p.notaQr} URL de verificación: <Pendiente />
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section aria-labelledby="pasos-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading
            id="pasos-titulo"
            eyebrow="Cómo funciona"
            titulo="De tu auto a una publicación verificada."
          />
          <ol role="list" className="mt-10 grid gap-0 border-t border-line md:grid-cols-4">
            {p.pasos.map((x, i) => (
              <li
                key={x}
                className="flex gap-4 border-b border-line py-5 md:flex-col md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"
              >
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-deep font-mono text-sm text-brand-deep"
                >
                  {pad(i + 1)}
                </span>
                <span className="text-[1.0625rem] font-medium">{x}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="faq-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <SectionHeading
              id="faq-titulo"
              eyebrow="Preguntas frecuentes"
              titulo="Sobre la certificación"
            />
            <div className="mt-8">
              <WhatsAppButton
                mensaje={p.mensajeWhatsapp}
                servicio={cert.nombreWhatsapp}
                ubicacion="vende-faq"
                variant="primary"
              >
                Certificar mi auto
              </WhatsAppButton>
            </div>
          </div>
          <FaqAccordion faqs={faqsCert} className="lg:col-span-7 lg:col-start-6" />
        </div>
        <JsonLd data={schemaFaq(faqsCert)} />
      </section>
      <JsonLd data={schemaServicio(cert, p.resumen)} />
    </>
  );
}
