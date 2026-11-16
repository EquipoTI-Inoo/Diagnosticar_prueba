import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Pendiente } from "@/components/ui/pendiente";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stepper } from "@/components/ui/stepper";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaComoFunciona as p } from "@/content/conversion";
import { proceso } from "@/content/proceso";
import { schemaHowTo } from "@/lib/schema";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/como-funciona" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function ComoFuncionaPage() {
  const [antesMedios, despuesMedios] = p.reserva.medios.split("[PENDIENTE CLIENTE]");
  return (
    <>
      <PageHero
        migas={[{ nombre: p.h1, href: "/como-funciona" }]}
        eyebrow="Reserva y diagnóstico"
        titulo={p.h1}
        resumen={p.resumen}
      >
        <div className="mt-8">
          <WhatsAppButton ubicacion="como-funciona-hero" variant="primary" size="lg">
            Agendar diagnóstico
          </WhatsAppButton>
        </div>
      </PageHero>

      <section aria-labelledby="pasos-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading id="pasos-titulo" eyebrow="4 pasos" titulo="De la duda al veredicto." />
          <Stepper pasos={proceso} className="mt-12" />
        </div>
      </section>

      <section
        aria-labelledby="necesitamos-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <SectionHeading
              id="necesitamos-titulo"
              eyebrow="Para agendar"
              titulo="Qué necesitamos"
            />
            <ol
              role="list"
              className="mt-8 overflow-hidden rounded-card border border-line bg-white"
            >
              {p.necesitamos.map((n, i) => (
                <li
                  key={n}
                  className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line px-5 py-4 last:border-b-0"
                >
                  <span aria-hidden className="font-mono text-xs text-muted">
                    {pad(i + 1)}
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="surface-dark rounded-card p-6">
              <h2 className="text-h3">{p.reserva.titulo}</h2>
              <p className="mt-3 text-fg-muted">{p.reserva.texto}</p>
              <p className="mt-4 text-sm text-fg-muted">
                {antesMedios}
                <Pendiente />
                {despuesMedios}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="politicas-titulo"
        className="surface-light border-t border-line py-(--spacing-section)"
      >
        <div className="container-site">
          <SectionHeading
            id="politicas-titulo"
            eyebrow="Políticas en simple"
            titulo="Lo que tienes que saber"
            acento="antes de agendar."
          >
            Resumen en lenguaje simple. Lo que vale es el texto completo de los términos y
            condiciones.
          </SectionHeading>
          <dl className="mt-10 grid border-t border-line md:grid-cols-2">
            {p.politicas.map((x, i) => (
              <div
                key={x.titulo}
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-line py-5 md:pr-8 md:odd:border-r md:even:pl-8"
              >
                {/* Solo dt/dd dentro del div (estructura válida de <dl>); el número va dentro del dt. */}
                <dt className="col-span-2 grid grid-cols-subgrid font-medium">
                  <span aria-hidden className="pt-0.5 font-mono text-xs font-normal text-muted">
                    {pad(i + 1)}
                  </span>
                  <span>{x.titulo}</span>
                </dt>
                <dd className="col-start-2 mt-1 text-muted">{x.texto}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={p.tycHref}
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
          >
            Leer los términos y condiciones completos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>

      <JsonLd
        data={schemaHowTo(
          "Cómo agendar un diagnóstico vehicular con DiagnostiCAR",
          p.resumen,
          proceso,
        )}
      />
    </>
  );
}
