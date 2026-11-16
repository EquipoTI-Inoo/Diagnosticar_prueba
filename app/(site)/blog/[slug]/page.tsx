import type { Metadata } from "next";
import { seoBlog } from "@/content/seo-blog";
import { metadatos } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CuerpoArticulo } from "@/components/blog/cuerpo-articulo";
import { TarjetaArticulo } from "@/components/blog/tarjeta-articulo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Pendiente } from "@/components/ui/pendiente";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { ServicioSlug } from "@/content/schema";
import { getServicio } from "@/content/servicios";
import { articulo, articulos, fechaLarga } from "@/lib/blog";
import { schemaArticulo } from "@/lib/schema";
import { formatPEN } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return articulos().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = articulo((await params).slug);
  if (!a) return {};
  const seo = seoBlog[a.slug] ?? {};
  return metadatos({
    tema: seo.titulo ?? a.titulo,
    descripcion: seo.descripcion ?? a.resumen,
    path: `/blog/${a.slug}`,
    tipo: "article",
    publicado: a.fecha,
    imagen: `/blog/${a.slug}/og.png`,
  });
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = articulo((await params).slug);
  if (!a) notFound();
  const s = getServicio(a.servicio as ServicioSlug);
  const todos = articulos();
  const numero = new Map([...todos].reverse().map((x, i) => [x.slug, i + 1]));
  const relacionados = todos
    .filter((x) => x.categoria === a.categoria && x.slug !== a.slug)
    .slice(0, 3);
  return (
    <>
      <section className="surface-dark bg-inspeccion pt-24 pb-12 lg:pt-36">
        <div className="container-site">
          <Breadcrumbs
            migas={[
              { nombre: "Blog", href: "/blog" },
              { nombre: a.titulo, href: `/blog/${a.slug}` },
            ]}
          />
          <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <p className="font-mono text-eyebrow tracking-[0.12em] text-brand uppercase">{a.categoria}</p>
              <h1 className="mt-4 text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.02] tracking-[-0.02em]">{a.titulo}</h1>
              <p className="mt-5 max-w-[56ch] text-[1.125rem] text-fg-muted">{a.resumen}</p>
              <p className="mt-6 font-mono text-xs tracking-wide text-fg-muted uppercase">
                <time dateTime={a.fecha}>{fechaLarga(a.fecha)}</time> · {a.autor}{" "}
                <Pendiente ocultarEnProduccion>[PENDIENTE CLIENTE: autor técnico con bio]</Pendiente>
              </p>
            </div>
            <dl className="self-end rounded-card border border-border p-5 font-mono text-sm lg:col-span-4 lg:col-start-9">
              {[
                ["Categoría", a.categoria],
                ["Publicado", fechaLarga(a.fecha)],
                ["Lectura", `${Math.max(1, Math.round(a.palabras / 200))} min`],
                ["Servicio", s.nombre],
              ].map(([t, d]) => (
                <div key={t} className="flex justify-between gap-4 border-b border-border py-2 last:border-b-0">
                  <dt className="text-fg-muted uppercase tracking-wide text-xs">{t}</dt>
                  <dd className="text-right">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="surface-light py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <article aria-label={a.titulo} className="min-w-0 lg:col-span-7">
            <CuerpoArticulo bloques={a.bloques} />
          </article>
          <aside aria-labelledby="servicio-t" className="lg:col-span-4 lg:col-start-9">
            <div className="surface-dark rounded-card p-6 lg:sticky lg:top-24">
              <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">Servicio relacionado</p>
              <h2 id="servicio-t" className="mt-2 text-h3">
                {s.nombre}
              </h2>
              <p className="mt-1 text-fg-muted">{s.tagline}</p>
              <p className="mt-4 font-mono text-2xl">{s.precio.actual !== null ? formatPEN(s.precio.actual) : <Pendiente />}</p>
              <div className="mt-5 flex flex-col gap-3">
                <WhatsAppButton servicio={s.nombreWhatsapp} ubicacion={`blog-${a.slug}`} variant="primary">
                  Reservar
                </WhatsAppButton>
                <Link href={s.href} className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border-strong px-5 font-medium hover:border-accent hover:text-accent">
                  Ver el {s.nombre}
                </Link>
                <Link href="/servicios" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm text-accent underline underline-offset-4">
                  Comparar todos los planes
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section aria-labelledby="rel-t" className="surface-light border-t border-line py-16">
          <div className="container-site">
            <h2 id="rel-t" className="text-h3">
              Más en {a.categoria}
            </h2>
            <ul role="list" className="mt-6 border-b border-line">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <TarjetaArticulo a={r} numero={numero.get(r.slug)!} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd
        data={schemaArticulo({
          tipo: "BlogPosting",
          titulo: a.titulo,
          descripcion: a.resumen,
          path: `/blog/${a.slug}`,
          publicado: a.fecha,
          seccion: a.categoria,
          imagen: `/blog/${a.slug}/og.png`,
        })}
      />
    </>
  );
}
