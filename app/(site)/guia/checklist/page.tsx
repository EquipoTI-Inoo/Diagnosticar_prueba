import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import Link from "next/link";
import { BotonImprimir } from "@/components/sections/boton-imprimir";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ACTUALIZADO, paginaChecklist as p } from "@/content/educativo";
import { negocio } from "@/content/negocio";
import { schemaHowTo } from "@/lib/schema";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/guia/checklist" });

const pad = (n: number) => String(n).padStart(2, "0");

export default function ChecklistPage() {
  return (
    <>
      <PageHero
        migas={[
          { nombre: "Guía", href: "/guia" },
          { nombre: "Checklist", href: "/guia/checklist" },
        ]}
        eyebrow="Hoja de revisión imprimible"
        titulo={p.h1}
        resumen={p.resumen}
      >
        <div data-no-print className="mt-8 flex flex-wrap gap-3">
          <BotonImprimir />
          <WhatsAppButton servicio="DiagnostiCAR" ubicacion="checklist-hero" variant="primary">
            Que lo revise un técnico
          </WhatsAppButton>
        </div>
      </PageHero>

      <section aria-labelledby="hoja-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site max-w-4xl">
          <div className="rounded-card border border-line bg-white">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-4">
              <h2 id="hoja-titulo" className="text-h3">
                Antes de comprar: revisa
              </h2>
              <p className="font-mono text-xs tracking-wide text-muted uppercase">
                Placa: ________ · Fecha: ________
              </p>
            </div>
            <ol role="list">
              {p.puntos.map((pt, i) => (
                <li key={pt} className="grid grid-cols-[2.5rem_1.5rem_1fr] items-start gap-3 border-b border-line px-5 py-4 last:border-b-0">
                  <span aria-hidden className="pt-0.5 font-mono text-sm text-muted">{pad(i + 1)}</span>
                  <span aria-hidden className="mt-0.5 size-5 rounded-[3px] border-2 border-ink" />
                  <span className="text-[1.0625rem]">{pt}</span>
                </li>
              ))}
            </ol>
            <p className="border-t border-line px-5 py-3 font-mono text-xs text-muted">
              DiagnostiCAR · {negocio.whatsapp.display} · Actualizado: {ACTUALIZADO.texto}
            </p>
          </div>
          <p data-no-print className="mt-6 text-sm text-muted">
            ¿Quieres saber por qué cada punto importa?{" "}
            <Link href="/guia/problemas-comunes" className="text-brand-deep underline underline-offset-4">
              Mira los problemas más comunes
            </Link>{" "}
            o lee la{" "}
            <Link href="/guia" className="text-brand-deep underline underline-offset-4">
              guía completa
            </Link>
            .
          </p>
        </div>
      </section>
      <JsonLd
        data={schemaHowTo(
          p.h1,
          p.resumen,
          p.puntos.map((pt, i) => ({ numero: pad(i + 1), titulo: pt.replace(/\.$/, ""), texto: pt })),
        )}
      />
    </>
  );
}
