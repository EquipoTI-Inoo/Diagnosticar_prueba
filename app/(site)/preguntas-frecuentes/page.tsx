import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaFaq as p } from "@/content/educativo";
import { faqCategoriaLabel, faqs } from "@/content/faqs";
import { faqCategorias } from "@/content/schema";
import { schemaFaq } from "@/lib/schema";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function PreguntasFrecuentesPage() {
  const grupos = faqCategorias.map((c) => ({ id: c, titulo: faqCategoriaLabel[c], faqs: faqs.filter((f) => f.categoria === c) })).filter((g) => g.faqs.length);
  return (
    <>
      <PageHero migas={[{ nombre: p.h1, href: "/preguntas-frecuentes" }]} eyebrow={`${faqs.length} preguntas`} titulo={p.h1} resumen={p.resumen}>
        <nav aria-label="Categorías" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {grupos.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-4 text-sm hover:border-accent hover:text-accent">
                  {g.titulo} <span className="font-mono text-xs text-fg-muted">{g.faqs.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <div className="surface-light py-(--spacing-section)">
        <div className="container-site space-y-16">
          {grupos.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-t`} className="grid scroll-mt-24 gap-6 lg:grid-cols-12">
              <h2 id={`${g.id}-t`} className="text-h3 lg:col-span-4">
                {g.titulo}
              </h2>
              <FaqAccordion faqs={g.faqs} className="lg:col-span-8" />
            </section>
          ))}
        </div>
        <div className="container-site mt-16">
          <p className="text-muted">¿No encuentras tu pregunta?</p>
          <div className="mt-3">
            <WhatsAppButton mensaje="Hola, tengo una consulta sobre el diagnóstico" servicio="consulta" ubicacion="faq-final">
              Escríbenos por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
      <JsonLd data={schemaFaq(faqs)} />
    </>
  );
}
