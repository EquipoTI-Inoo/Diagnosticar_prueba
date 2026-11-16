import type { Metadata } from "next";
import { LibroForm } from "@/components/forms/libro-form";
import { PageHero } from "@/components/sections/page-hero";
import { paginaLibro as p } from "@/content/educativo";
import { negocio } from "@/content/negocio";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/libro-de-reclamaciones" },
};

export default function LibroPage() {
  const hoy = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHero migas={[{ nombre: p.h1, href: "/libro-de-reclamaciones" }]} eyebrow="Indecopi" titulo={p.h1}>
        <dl className="mt-8 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm">
          <dt className="text-fg-muted">Razón social</dt>
          <dd>{negocio.razonSocial}</dd>
          <dt className="text-fg-muted">RUC</dt>
          <dd>{negocio.ruc}</dd>
          <dt className="text-fg-muted">Domicilio</dt>
          <dd>
            {negocio.direccion.calle}, {negocio.direccion.distrito}
          </dd>
        </dl>
      </PageHero>
      <div className="surface-light py-16 lg:py-24">
        <div className="container-site max-w-3xl">
          <p role="note" className="mb-10 rounded-card border border-dashed border-warn bg-card p-4 text-sm">
            {p.aviso}
          </p>
          <LibroForm
            hoy={hoy}
            o={{
              tiposDocumento: p.tiposDocumento,
              departamentos: p.departamentos,
              tiposReclamo: p.tiposReclamo,
              tiposConsumo: p.tiposConsumo,
              definiciones: p.definiciones,
              declaraciones: p.declaraciones,
              aceptacion: p.aceptacion,
            }}
          />
        </div>
      </div>
    </>
  );
}
