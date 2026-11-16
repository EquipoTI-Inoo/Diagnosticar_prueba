import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Pendiente } from "@/components/ui/pendiente";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stepper } from "@/components/ui/stepper";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { fichaSlugs, fichaTextos as t, getFicha } from "@/content/conversion";
import { proceso } from "@/content/proceso";
import { getServicio } from "@/content/servicios";
import type { ServicioSlug } from "@/content/schema";
import { schemaFaq, schemaServicio } from "@/lib/schema";
import { formatPEN } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return fichaSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const f = getFicha((await params).slug);
  if (!f) return {};
  const s = f.servicio;
  const precio = s.precio.actual !== null ? ` · ${formatPEN(s.precio.actual)}` : "";
  return {
    title: `${s.nombre}${precio}`,
    description:
      f.resumen.length > 155 ? `${f.resumen.slice(0, 152).replace(/\s+\S*$/, "")}…` : f.resumen,
    alternates: { canonical: s.href },
  };
}

export default async function FichaServicio({ params }: { params: Promise<{ slug: string }> }) {
  const f = getFicha((await params).slug);
  if (!f) notFound();
  const s = f.servicio;
  const pasos = f.conVisita ? proceso : proceso.slice(0, 2);

  return (
    <>
      <PageHero
        migas={[
          { nombre: "Planes y precios", href: "/servicios" },
          { nombre: s.nombre, href: s.href },
        ]}
        eyebrow={s.tagline}
        titulo={s.nombre}
        resumen={f.resumen}
        aside={
          <div className="rounded-card border border-border bg-ink-2 p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3 font-mono text-[0.7rem] tracking-[0.14em] text-fg-muted uppercase">
              <span>Precio</span>
              {s.badge && <Badge>{s.badge}</Badge>}
            </div>
            <Price precio={s.precio} size="lg" className="mt-5" />
            <p className="mt-4 text-sm text-fg-muted">{t.programa}</p>
            {s.nota && <p className="mt-1 text-sm text-fg-muted">{s.nota}</p>}
            <div className="mt-6 flex flex-col gap-3">
              <WhatsAppButton
                servicio={s.nombreWhatsapp}
                ubicacion="ficha-hero"
                variant="primary"
                size="lg"
              >
                Reservar {s.nombre}
              </WhatsAppButton>
              <Link
                href="/servicios#comparativa"
                className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border-strong px-5 text-[0.95rem] font-medium text-fg hover:border-accent hover:text-accent"
              >
                Comparar todos los planes
              </Link>
            </div>
          </div>
        }
      />

      {/* Todo lo que revisamos + Qué recibes */}
      <section aria-labelledby="revisamos-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <SectionHeading
              id="revisamos-titulo"
              eyebrow="Hoja de inspección"
              titulo="Todo lo que revisamos"
            />
            <ol
              role="list"
              className="mt-8 overflow-hidden rounded-card border border-line bg-white"
            >
              {s.detalle.map((d, i) => (
                <li
                  key={d}
                  className="grid grid-cols-[2.5rem_1fr_1.25rem] items-start gap-2 border-b border-line px-5 py-3.5 last:border-b-0"
                >
                  <span aria-hidden className="pt-0.5 font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{d}</span>
                  <Check aria-hidden className="mt-1 size-4 text-brand-deep" strokeWidth={2} />
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <PhotoFigure
              imagen={f.foto}
              aspect={f.foto.src.startsWith("/img/informe/") ? "aspect-[1287/910]" : "aspect-[4/3]"}
              sizes="(min-width: 1024px) 380px, 100vw"
              className="mb-10"
            />
            <h2 className="font-mono text-eyebrow font-medium tracking-[0.12em] text-muted uppercase [font-stretch:100%]">
              Qué recibes
            </h2>
            <ul role="list" className="mt-4 space-y-3">
              {f.recibes.map((r) => (
                <li key={r} className="border-l-2 border-brand-deep pl-4 text-[1.0625rem]">
                  {r}
                </li>
              ))}
            </ul>
            {s.tipo === "inspeccion" && (
              <Link
                href="/informe-de-ejemplo"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
              >
                Ver un informe de ejemplo
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section
        aria-labelledby="proceso-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="proceso-titulo"
            eyebrow={f.conVisita ? "Cómo funciona" : t.comoSePide}
            titulo={f.conVisita ? "De la duda al veredicto, en 4 pasos." : "Lo pides por WhatsApp."}
          />
          <Stepper pasos={pasos} className="mt-12" />
          {!f.conVisita && (
            <p className="mt-6 text-sm text-muted">
              <Pendiente>{t.pasosSinVisita.nota}</Pendiente>
            </p>
          )}
        </div>
      </section>

      {f.faqs.length > 0 && (
        <section
          aria-labelledby="faq-titulo"
          className="surface-light border-t border-line py-(--spacing-section)"
        >
          <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <SectionHeading
                id="faq-titulo"
                eyebrow="Preguntas frecuentes"
                titulo={`Sobre el ${s.nombre}`}
              />
            </div>
            <FaqAccordion faqs={f.faqs} className="lg:col-span-7 lg:col-start-6" />
          </div>
          <JsonLd data={schemaFaq(f.faqs)} />
        </section>
      )}

      {/* Comparar + relacionados */}
      <section aria-labelledby="comparar-titulo" className="surface-dark py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <h2 id="comparar-titulo" className="text-h2">
              {t.compararTitulo}
            </h2>
            <p className="mt-4 text-fg-muted">{t.compararTexto}</p>
            <Link
              href="/servicios#comparativa"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
            >
              Ver tabla comparativa
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="font-mono text-eyebrow font-medium tracking-[0.12em] text-fg-muted uppercase [font-stretch:100%]">
              Servicios relacionados
            </h3>
            <ul role="list" className="mt-4 divide-y divide-border border-y border-border">
              {f.relacionados.map((slug) => {
                const r = getServicio(slug as ServicioSlug);
                return (
                  <li key={slug}>
                    <Link
                      href={r.href}
                      className="group grid min-h-16 grid-cols-[1fr_auto] items-center gap-4 py-4"
                    >
                      <span>
                        <span className="block font-medium group-hover:text-accent">
                          {r.nombre}
                        </span>
                        <span className="block text-sm text-fg-muted">{r.tagline}</span>
                      </span>
                      <span className="font-mono text-sm">
                        {r.precio.actual !== null ? formatPEN(r.precio.actual) : <Pendiente />}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <JsonLd data={schemaServicio(s, f.resumen)} />
    </>
  );
}
