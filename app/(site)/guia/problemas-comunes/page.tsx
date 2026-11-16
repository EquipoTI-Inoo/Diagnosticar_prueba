import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { FindingMeter } from "@/components/ui/finding-meter";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaProblemas as p } from "@/content/educativo";
import { getServicio } from "@/content/servicios";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/guia/problemas-comunes" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProblemasPage() {
  return (
    <>
      <PageHero
        migas={[
          { nombre: "Guía", href: "/guia" },
          { nombre: "Problemas comunes", href: "/guia/problemas-comunes" },
        ]}
        eyebrow="Hallazgos"
        titulo={p.h1}
        resumen={p.resumen}
      />
      <section aria-label="Los 7 problemas" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <ol role="list" className="space-y-6">
            {p.items.map((it, i) => {
              const s = getServicio(it.servicio);
              return (
                <li key={it.slug} id={it.slug} className="scroll-mt-24 overflow-hidden rounded-card border border-line bg-white">
                  <article aria-labelledby={`${it.slug}-t`} className="grid lg:grid-cols-12">
                    <div className="p-6 lg:col-span-7 lg:p-8">
                      <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                        Hallazgo {pad(i + 1)} / {pad(p.items.length)}
                      </p>
                      <h2 id={`${it.slug}-t`} className="mt-2 text-h3">
                        {it.titulo}
                        {it.detalle && <span className="block font-sans text-base font-normal text-muted [font-stretch:100%]">{it.detalle}</span>}
                      </h2>
                      <FindingMeter casos={it.casos} base={it.base} className="mt-5 max-w-md" />
                      <p className="mt-5 font-medium">{it.dato}</p>
                      <p className="mt-2 max-w-[60ch] text-muted">{it.explicacion}</p>
                      <Link href={s.href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-deep underline underline-offset-4">
                        Lo revisamos en el {s.nombre}
                        <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    </div>
                    <div className="border-t border-line p-4 lg:col-span-5 lg:border-t-0 lg:border-l">
                      <PhotoFigure imagen={it.imagen} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 460px, 100vw" />
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 font-mono text-xs text-muted">Fuente: {p.fuente}.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsAppButton servicio="DiagnostiCAR" ubicacion="problemas-cta" variant="primary">
              Agendar diagnóstico
            </WhatsAppButton>
            <Link href="/guia/checklist" className="inline-flex min-h-11 items-center rounded-pill border border-border-strong px-5 font-medium hover:border-accent hover:text-accent">
              Ver el checklist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
