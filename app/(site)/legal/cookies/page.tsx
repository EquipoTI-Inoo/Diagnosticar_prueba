import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { CookiePrefsButton } from "@/components/layout/cookie-prefs-button";
import { PageHero } from "@/components/sections/page-hero";
import { Pendiente } from "@/components/ui/pendiente";
import { paginasLegales } from "@/content/educativo";

const p = paginasLegales.cookies;

export const metadata: Metadata = metadatos({ tema: p.seo.title, descripcion: p.seo.description, path: "/legal/cookies" });

export default function CookiesPage() {
  return (
    <>
      <PageHero migas={[{ nombre: p.h1, href: "/legal/cookies" }]} eyebrow="Legal" titulo={p.h1} />
      <div className="surface-light py-16 lg:py-24">
        <div className="container-site max-w-3xl">
          <div role="note" className="rounded-card border border-dashed border-muted bg-white p-6">
            <p className="font-medium">
              Texto pendiente: <Pendiente>{p.pendiente}</Pendiente>
            </p>
          </div>
          <section aria-labelledby="como-t" className="mt-10">
            <h2 id="como-t" className="text-h3">
              Cómo funciona hoy este sitio
            </h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {p.comoFunciona.map((c) => (
                <div key={c.t} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="font-medium">{c.t}</dt>
                  <dd className="text-muted">{c.d}</dd>
                </div>
              ))}
            </dl>
            <CookiePrefsButton className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-pill border border-border-strong px-5 font-medium hover:border-accent hover:text-accent" />
          </section>
        </div>
      </div>
    </>
  );
}
