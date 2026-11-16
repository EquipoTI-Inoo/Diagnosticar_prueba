import type { Metadata } from "next";
import Image from "next/image";
import { Download, TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Pendiente } from "@/components/ui/pendiente";
import { TrackedLink } from "@/components/ui/tracked-link";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { paginaInforme as p } from "@/content/conversion";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/informe-de-ejemplo" },
};

function Descargar({ ubicacion }: { ubicacion: string }) {
  return (
    <TrackedLink
      href={p.pdf.href}
      download
      evento="informe_descarga"
      props={{ ubicacion }}
      className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-6 py-3 font-medium text-fg hover:border-accent hover:text-accent"
    >
      <Download aria-hidden className="size-4" strokeWidth={1.75} />
      Descargar PDF
    </TrackedLink>
  );
}

export default function InformePage() {
  return (
    <>
      <PageHero
        migas={[{ nombre: "Informe de ejemplo", href: "/informe-de-ejemplo" }]}
        eyebrow="Muestra oficial"
        titulo={p.h1}
        resumen={p.texto}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton
            servicio="DiagnostiCAR"
            ubicacion="informe-hero"
            variant="primary"
            size="lg"
          >
            Agendar mi diagnóstico
          </WhatsAppButton>
          <Descargar ubicacion="informe-hero" />
        </div>
        <p
          role="note"
          className="mt-8 flex max-w-[40rem] items-start gap-3 rounded-sm border border-warn/60 px-4 py-3 text-sm text-fg"
        >
          <TriangleAlert
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-warn"
            strokeWidth={1.75}
          />
          <span>
            <strong className="font-medium">{p.aviso}</strong> <Pendiente>{p.pendiente}</Pendiente>
          </span>
        </p>
      </PageHero>

      <section aria-labelledby="visor-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <h2 id="visor-titulo" className="sr-only">
            Páginas del informe de ejemplo
          </h2>
          <ol role="list" className="grid gap-10">
            {p.paginasVisor.map((pg, i) => (
              <li key={pg.src}>
                <figure>
                  <figcaption className="mb-3 flex items-baseline justify-between gap-4 font-mono text-xs tracking-wide text-muted uppercase">
                    <span>{pg.titulo}</span>
                    <span>
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(p.paginasVisor.length).padStart(2, "0")}
                    </span>
                  </figcaption>
                  <div className="overflow-hidden rounded-card border border-line bg-ink">
                    <Image
                      src={pg.src}
                      alt={pg.alt}
                      width={1287}
                      height={910}
                      sizes="(min-width: 1248px) 1200px, 100vw"
                      priority={i === 0}
                      className="h-auto w-full"
                    />
                  </div>
                </figure>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Descargar ubicacion="informe-visor" />
            <p className="text-sm text-muted">{p.avisoFuente}</p>
          </div>
        </div>
      </section>
    </>
  );
}
