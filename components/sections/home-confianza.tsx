import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play, Star } from "lucide-react";
import { Counter } from "@/components/ui/counter";
import { DistrictList } from "@/components/ui/district-chip";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Highlight } from "@/components/ui/highlight";
import { LogoWall } from "@/components/ui/logo-wall";
import { Pendiente } from "@/components/ui/pendiente";
import { PhotoFigure } from "@/components/ui/photo-figure";
import { ReviewCard } from "@/components/ui/review-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackedLink } from "@/components/ui/tracked-link";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { cobertura } from "@/content/cobertura";
import { faqsHome } from "@/content/faqs";
import { home } from "@/content/home";
import { medios } from "@/content/medios";
import { negocio } from "@/content/negocio";
import { getServicio } from "@/content/servicios";
import { testimoniosConNombre } from "@/content/testimonios";

/** §5.1.8 Tecnología + §5.1.9 Confianza + §5.1.10 Prueba social. */
export function HomeConfianza() {
  const t = home.tecnologia;
  const aliados = negocio.aliados.filter((a) => a.vigente && a.logo);
  const numEscaneres = t.texto.match(/(\d+) escáneres/)?.[1] ?? "";
  // Datos concretos por punto de confianza (todos salen de /content).
  const dato: Record<string, React.ReactNode> = {
    tecnicos: (
      <>
        Certificaciones: <Pendiente />
      </>
    ),
    equipos: `${numEscaneres} escáneres · ${aliados.map((a) => a.nombre).join(" · ")}`,
    informes: getServicio("diagnosticar").resumen.find((r) => r.includes("fotos")) ?? "",
    atencion: `${negocio.horario.dias} · a domicilio`,
  };

  return (
    <>
      {/* Tecnología */}
      <section aria-labelledby="tecnologia-titulo" className="surface-dark py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <SectionHeading id="tecnologia-titulo" eyebrow={t.eyebrow} titulo={t.titulo}>
              {t.texto}
            </SectionHeading>
            <ul role="list" className="mt-8 divide-y divide-border border-y border-border">
              {t.lista.map((item, i) => (
                <li key={item} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 py-4">
                  <span aria-hidden className="font-mono text-xs text-fg-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                  <Check aria-hidden className="size-4 text-accent" strokeWidth={2} />
                </li>
              ))}
            </ul>
            <Link
              href="/tecnologia"
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
            >
              {t.enlace}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="flex flex-col justify-between gap-8 lg:col-span-4 lg:col-start-9">
            <div className="rounded-card border border-border p-6">
              <p
                aria-hidden
                className="font-mono text-[7rem] leading-[0.85] font-medium text-accent"
              >
                {numEscaneres}
              </p>
              <p className="mt-3 text-fg">
                <span className="sr-only">{numEscaneres} </span>escáneres profesionales; llevamos el
                adecuado a cada marca y modelo.
              </p>
            </div>
            <div>
              <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
                {t.aliados}
              </p>
              <ul role="list" className="mt-3 grid grid-cols-2 gap-3">
                {aliados.map((a) => (
                  <li key={a.nombre} className="relative aspect-[5/3] rounded-card bg-white">
                    <div className="absolute inset-x-[16%] inset-y-[30%]">
                      <Image
                        src={a.logo!.src}
                        alt={a.logo!.alt || a.nombre}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Confianza técnica */}
      <section aria-labelledby="confianza-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading
            id="confianza-titulo"
            eyebrow={home.confianza.eyebrow}
            titulo={home.confianza.titulo}
            acento={home.confianza.tituloAcento}
          />
          <ul role="list" className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {home.confianza.items.map((it, i) => (
              <li key={it.id} className="flex flex-col">
                <PhotoFigure
                  imagen={medios.confianza[it.id]!}
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="mt-4 border-t border-line pt-4">
                  <p aria-hidden className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-[1.375rem] leading-tight tracking-[-0.01em]">
                    {it.titulo} <span className="text-muted">{it.subtitulo}</span>
                  </h3>
                  <p className="mt-2 font-mono text-[0.8rem] text-ink">{dato[it.id]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prueba social */}
      <section
        aria-labelledby="social-titulo"
        className="surface-light border-t border-line bg-white py-(--spacing-section)"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <SectionHeading
              id="social-titulo"
              eyebrow={home.social.eyebrow}
              titulo={home.social.titulo}
            />
            <div className="mt-8 flex items-end gap-4">
              <Counter
                display={negocio.metricas.rating.display}
                className="text-[5.5rem] leading-[0.85] font-medium"
              />
              <div className="pb-1">
                <div
                  className="flex gap-0.5 text-brand-deep"
                  role="img"
                  aria-label="5 de 5 estrellas"
                >
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Star key={k} aria-hidden className="size-5 fill-current" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-1 text-muted">
                  {negocio.metricas.resenas.display} {negocio.metricas.resenas.etiqueta}
                </p>
              </div>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
              {home.social.verResenas}: <Pendiente>[PENDIENTE CLIENTE: URL de la ficha]</Pendiente>
            </p>
          </div>
          <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {testimoniosConNombre.slice(0, 6).map((r) => (
              <li key={r.id}>
                <ReviewCard testimonio={r} />
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site mt-14">
          <LogoWall
            grupos={[
              { titulo: home.social.medios, logos: negocio.medios },
              { titulo: home.social.automovilismo, logos: negocio.automovilismo },
            ]}
            columnas={2}
            className="max-w-lg"
          />
        </div>
      </section>
    </>
  );
}

/** §5.1.11 Tips + §5.1.12 FAQ + §5.1.13 CTA final. */
export function HomeCierre() {
  return (
    <>
      <section aria-labelledby="tips-titulo" className="surface-dark py-(--spacing-section)">
        <div className="container-site">
          <SectionHeading id="tips-titulo" eyebrow={home.tips.eyebrow} titulo={home.tips.titulo} />
          <ul role="list" className="mt-10 grid gap-6 sm:grid-cols-3">
            {medios.tips.map((v) => (
              <li key={v.url}>
                <TrackedLink
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  evento="video_play"
                  props={{ video: v.url, ubicacion: "home-tips" }}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink-2">
                    <Image
                      src={v.miniatura.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="foto-real object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full bg-brand text-ink">
                      <Play aria-hidden className="size-4 fill-current" strokeWidth={0} />
                    </span>
                  </div>
                  <p className="mt-3 text-[1.0625rem] font-medium group-hover:text-accent">
                    {v.titulo}
                    <span className="sr-only"> (reel de Instagram, se abre en otra pestaña)</span>
                  </p>
                  <p className="font-mono text-xs text-fg-muted uppercase">
                    {v.miniatura.pie?.tipo}
                  </p>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-titulo" eyebrow={home.faq.eyebrow} titulo={home.faq.titulo} />
            <Link
              href="/preguntas-frecuentes"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
            >
              {home.faq.verTodas}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <FaqAccordion faqs={faqsHome} className="lg:col-span-7 lg:col-start-6" />
        </div>
      </section>

      <section
        aria-labelledby="cta-titulo"
        className="surface-dark bg-inspeccion border-t border-border py-(--spacing-section)"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h2 id="cta-titulo" className="max-w-[18ch] text-h2">
              {home.ctaFinal.titulo} <Highlight>{home.ctaFinal.tituloAcento}</Highlight>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <WhatsAppButton ubicacion="home-cta-final" variant="primary" size="lg">
                {home.ctaFinal.primario}
              </WhatsAppButton>
              <WhatsAppButton
                ubicacion="home-cta-final"
                mensaje={home.ctaFinal.mensajeConsejos}
                servicio="consejos-gratis"
                variant="secondary"
                size="lg"
              >
                {home.ctaFinal.secundario}
              </WhatsAppButton>
            </div>
            <p className="mt-6 text-fg-muted">
              o llámanos al{" "}
              <TrackedLink
                href={`tel:${negocio.telefono.e164}`}
                evento="phone_click"
                props={{ ubicacion: "home-cta-final" }}
                className="font-mono text-fg underline underline-offset-4"
              >
                {negocio.telefono.display}
              </TrackedLink>
            </p>
          </div>
          <div className="self-end rounded-card border border-border bg-ink p-6 lg:col-span-4 lg:col-start-9">
            <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
              Vamos sin recargo a
            </p>
            <DistrictList distritos={cobertura.sinRecargo} className="mt-4" />
            <p className="mt-4 text-sm text-fg-muted">{cobertura.nota}</p>
            <Link
              href="/cobertura"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline underline-offset-4"
            >
              Ver cobertura
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
