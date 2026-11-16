import type { Metadata } from "next";
import Link from "next/link";
import { PortadaArticulo } from "@/components/blog/portada";
import { TarjetaArticulo } from "@/components/blog/tarjeta-articulo";
import { PageHero } from "@/components/sections/page-hero";
import { articulos, CATEGORIAS, fechaLarga } from "@/lib/blog";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos de DiagnostiCAR sobre diagnóstico vehicular, tips mecánicos y novedades para comprar un auto usado con información.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const todos = articulos();
  // Numeración estable por antigüedad: N.º 01 = el más antiguo.
  const numero = new Map([...todos].reverse().map((a, i) => [a.slug, i + 1]));
  const [destacado] = todos;
  return (
    <>
      <PageHero
        migas={[{ nombre: "Blog", href: "/blog" }]}
        eyebrow={`${todos.length} artículos`}
        titulo="Blog"
        resumen="Diagnósticos, tips mecánicos y novedades del mercado de autos usados, escritos por el equipo de DiagnostiCAR."
      >
        <nav aria-label="Categorías" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <li key={c}>
                <a href={`#${slugify(c)}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-strong px-4 text-sm hover:border-accent hover:text-accent">
                  {c}
                  <span className="font-mono text-xs text-fg-muted">{todos.filter((a) => a.categoria === c).length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <div className="surface-light">
        {destacado && (
          <section aria-labelledby="reciente-t" className="container-site pt-16">
            <h2 id="reciente-t" className="font-mono text-eyebrow tracking-[0.12em] text-muted uppercase">
              Lo más reciente
            </h2>
            <article className="group relative mt-5 grid gap-6 lg:grid-cols-12 lg:items-center">
              <PortadaArticulo titulo={destacado.titulo} categoria={destacado.categoria} grande className="lg:col-span-7" />
              <div className="lg:col-span-5">
                <p className="font-mono text-xs tracking-wide text-muted uppercase">
                  <time dateTime={destacado.fecha}>{fechaLarga(destacado.fecha)}</time> · {destacado.categoria}
                </p>
                <h3 className="mt-2 text-h3">
                  <Link href={`/blog/${destacado.slug}`} className="after:absolute after:inset-0 group-hover:text-brand-deep">
                    {destacado.titulo}
                  </Link>
                </h3>
                <p className="mt-3 text-muted">{destacado.resumen}</p>
              </div>
            </article>
          </section>
        )}
        {CATEGORIAS.map((c) => {
          const lista = todos.filter((a) => a.categoria === c);
          return (
            <section key={c} id={slugify(c)} aria-labelledby={`${slugify(c)}-t`} className="scroll-mt-20 pt-16 last:pb-20">
              <div className="container-site">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id={`${slugify(c)}-t`} className="text-h2">
                    {c}
                  </h2>
                  <span className="font-mono text-sm text-muted">{lista.length} artículos</span>
                </div>
                <ul role="list" className="mt-6 border-b border-line">
                  {lista.map((a) => (
                    <li key={a.slug}>
                      <TarjetaArticulo a={a} numero={numero.get(a.slug)!} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
