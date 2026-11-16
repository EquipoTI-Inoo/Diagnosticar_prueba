import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Pendiente } from "@/components/ui/pendiente";
import { paginasLegales } from "@/content/educativo";
import { educativoFuente } from "@/content/educativo-fuente";
import { negocio } from "@/content/negocio";

const p = paginasLegales.privacidad;

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  const info = educativoFuente.tyc.find((s) => s.titulo === "Información y contacto");
  return (
    <>
      <PageHero migas={[{ nombre: p.h1, href: "/legal/privacidad" }]} eyebrow="Legal" titulo={p.h1} />
      <div className="surface-light py-16 lg:py-24">
        <div className="container-site max-w-3xl">
          <div role="note" className="rounded-card border border-dashed border-muted bg-white p-6">
            <p className="font-medium">
              Texto pendiente: <Pendiente>{p.pendiente}</Pendiente>
            </p>
            <p className="mt-2 text-muted">{p.mientras}</p>
          </div>
          {info && (
            <section aria-labelledby="info-t" className="mt-10">
              <h2 id="info-t" className="text-h3">
                {info.titulo} <span className="font-sans text-base font-normal text-muted [font-stretch:100%]">(extracto literal de los T&amp;C)</span>
              </h2>
              {info.parrafos.slice(0, 2).map((par, i) => (
                <p key={i} className="mt-4 leading-relaxed">
                  {par}
                </p>
              ))}
              <Link href="/legal/terminos-y-condiciones#informacion-y-contacto" className="mt-4 inline-flex min-h-11 items-center text-brand-deep underline underline-offset-4">
                Ver la sección completa en los términos y condiciones
              </Link>
            </section>
          )}
          <p className="mt-10 text-sm text-muted">
            Responsable: {negocio.razonSocial} · RUC {negocio.ruc} · {negocio.direccion.calle}, {negocio.direccion.distrito}.
          </p>
        </div>
      </div>
    </>
  );
}
