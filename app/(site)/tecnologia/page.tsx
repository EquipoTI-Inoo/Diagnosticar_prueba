import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaTecnologia as p } from "@/content/educativo";
import { negocio } from "@/content/negocio";
import { problemas } from "@/content/problemas";
import type { Imagen } from "@/content/schema";
import { getServicio } from "@/content/servicios";

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/tecnologia" });

const informe = (n: 2 | 3, tema: string, alt: string): Imagen => ({
  src: `/img/informe/informe-pagina-0${n}.webp`,
  alt,
  ancho: 1287,
  alto: 910,
  pie: { tipo: "Informe de ejemplo", texto: `2022 · placa de ejemplo · ${tema}` },
});
const FOTOS: Record<string, Imagen> = {
  "informe-2": informe(2, "escaneo y puntaje por sistema", "Página de un informe DiagnostiCAR de ejemplo con el puntaje por sistema, incluido el escaneo computarizado."),
  "informe-3": informe(3, "detalle de motor y escape", "Página de un informe DiagnostiCAR de ejemplo con el detalle de motor y escape, ítem por ítem."),
  videoscopio: problemas.find((x) => x.slug === "motor-o-caja-reparados")!.imagen,
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function TecnologiaPage() {
  const aliados = negocio.aliados.filter((a) => a.vigente && a.logo);
  return (
    <>
      <PageHero migas={[{ nombre: "Tecnología", href: "/tecnologia" }]} eyebrow="Tecnología" titulo={p.h1} resumen={p.resumen}>
        <nav aria-label="Herramientas" className="mt-8">
          <ol className="flex flex-wrap gap-2">
            {p.herramientas.map((h, i) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-4 text-sm hover:border-accent hover:text-accent">
                  <span aria-hidden className="font-mono text-xs text-fg-muted">{pad(i + 1)}</span>
                  {h.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>

      {p.herramientas.map((h, i) => {
        const foto = h.foto ? FOTOS[h.foto] : undefined;
        const oscuro = i % 2 === 1;
        return (
          <section
            key={h.id}
            id={h.id}
            aria-labelledby={`${h.id}-titulo`}
            className={`${oscuro ? "surface-dark" : "surface-light"} scroll-mt-20 py-16 lg:py-24`}
          >
            <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-6">
              <div className={foto ? "lg:col-span-6" : "lg:col-span-8"}>
                <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
                  Herramienta {pad(i + 1)} · {h.titulo}
                </p>
                <h2 id={`${h.id}-titulo`} className="mt-3 text-h2">
                  {h.pregunta}
                </h2>
                {h.texto.map((t) => (
                  <p key={t} className="mt-5 max-w-[60ch] text-[1.0625rem] text-fg-muted">
                    {t}
                  </p>
                ))}
                {"lista" in h && h.lista && (
                  <div className="mt-8">
                    <h3 className="font-mono text-eyebrow font-medium tracking-[0.12em] text-fg-muted uppercase [font-stretch:100%]">
                      {h.lista.titulo}
                    </h3>
                    <ul role="list" className="mt-3 grid border-t border-border sm:grid-cols-2">
                      {h.lista.items.map((it) => (
                        <li key={it} className="flex items-center gap-3 border-b border-border py-2.5 sm:odd:pr-4">
                          <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {h.id === "escaneo" && (
                  <ul role="list" aria-label="Marcas de escáneres" className="mt-8 flex gap-3">
                    {aliados.map((a) => (
                      <li key={a.nombre} className="relative h-16 w-32 rounded-card border border-line bg-white">
                        <div className="absolute inset-x-[14%] inset-y-[28%]">
                          <Image src={a.logo!.src} alt={a.logo!.alt || a.nombre} fill sizes="128px" className="object-contain" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {"servicio" in h && h.servicio && (
                  <Link
                    href={getServicio(h.servicio).href}
                    className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
                  >
                    Ver el {getServicio(h.servicio).nombre}
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                )}
              </div>
              {foto && (
                <div className="lg:col-span-5 lg:col-start-8">
                  <PhotoFigure
                    imagen={foto}
                    aspect={foto.src.startsWith("/img/informe/") ? "aspect-[1287/910]" : "aspect-[4/3]"}
                    sizes="(min-width: 1024px) 460px, 100vw"
                  />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section aria-labelledby="tec-cta" className="surface-dark bg-inspeccion border-t border-border py-16">
        <div className="container-site flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="tec-cta" className="max-w-[22ch] text-h2">
            Todas estas herramientas van a donde está el auto.
          </h2>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton ubicacion="tecnologia-cta" variant="primary" size="lg">
              Agendar diagnóstico
            </WhatsAppButton>
            <Link href="/servicios" className="inline-flex min-h-11 items-center rounded-pill border border-border-strong px-6 py-3.5 font-medium hover:border-accent hover:text-accent">
              Ver planes y precios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
