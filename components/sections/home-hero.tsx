import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight } from "@/components/ui/highlight";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { home } from "@/content/home";
import { medios } from "@/content/medios";
import { negocio } from "@/content/negocio";
import { ConsultaPlacaForm } from "@/components/forms/consulta-placa-form";
import { formTextos } from "@/content/conversion";
import { VideoFacade } from "./video-facade";

/** §5.1.1 Hero + §5.1.2 barra «Consulta gratis por placa». */
export function HomeHero() {
  const h = home.hero;
  const m = negocio.metricas;
  const metricas = [
    { valor: m.diagnosticos.display, etiqueta: m.diagnosticos.etiqueta },
    { valor: `${m.rating.display}★`, etiqueta: m.rating.etiqueta },
    { valor: m.resenas.display, etiqueta: m.resenas.etiqueta.replace(" en Google", "") },
    { valor: m.independencia.display, etiqueta: m.independencia.etiqueta },
  ];
  const foto = medios.confianza.tecnicos;
  return (
    <>
      <section
        aria-labelledby="hero-titulo"
        className="surface-dark bg-inspeccion relative overflow-hidden pt-28 pb-16 lg:pt-44 lg:pb-24"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <Eyebrow>{h.eyebrow}</Eyebrow>
            <h1 id="hero-titulo" className="mt-6 text-h1">
              {h.h1Linea1}
              <br />
              <Highlight>{h.h1Linea2}</Highlight>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.125rem] text-fg-muted lg:text-[1.1875rem]">
              {h.subtitulo}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton ubicacion="hero" variant="primary" size="lg">
                {h.ctaPrimario}
              </WhatsAppButton>
              <Button href="#planes" variant="secondary" size="lg" arrow={false}>
                {h.ctaSecundario}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            {/* Foto real con recorte editorial: esquina recortada como ficha */}
            <figure className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card [clip-path:polygon(0_0,88%_0,100%_14%,100%_100%,0_100%)]">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="foto-real object-cover"
                />
              </div>
              <div className="absolute bottom-3 left-3">
                <VideoFacade
                  id={medios.youtube.id}
                  titulo={medios.youtube.titulo}
                  label={h.verVideo}
                />
              </div>
              <figcaption className="mt-2.5 font-mono text-xs tracking-wide text-fg-muted uppercase">
                {foto.pie?.tipo} · {h.fotoPie}
              </figcaption>
            </figure>

            {/* Columna de métricas */}
            <dl className="mt-8 grid grid-cols-2 border-t border-border">
              {metricas.map((x, i) => (
                <div
                  key={x.etiqueta}
                  className={`flex flex-col border-b border-border py-4 ${i % 2 === 0 ? "pr-4" : "border-l pl-4"}`}
                >
                  <dt className="order-2 text-sm text-fg-muted">{x.etiqueta}</dt>
                  <dd className="order-1">
                    <Counter
                      display={x.valor}
                      className="text-[2rem] leading-none font-medium text-fg"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Consulta gratis por placa */}
      <section aria-labelledby="placa-titulo" className="surface-light border-b border-line">
        <div className="container-site py-10 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-4">
              <p className="font-mono text-eyebrow tracking-[0.12em] text-accent uppercase">
                Gratis
              </p>
              <h2
                id="placa-titulo"
                className="mt-2 text-[1.75rem] leading-tight tracking-[-0.02em]"
              >
                {home.consultaPlaca.titulo}
              </h2>
              <p className="mt-2 text-fg-muted">{home.consultaPlaca.texto}</p>
            </div>
            <div className="lg:col-span-8">
              <ConsultaPlacaForm
                textos={{
                  ...formTextos.placa,
                  errorFormulario: formTextos.errorFormulario,
                  otraConsulta: formTextos.otraConsulta,
                }}
                ubicacion="home-placa"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
