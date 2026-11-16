import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { ConsultaPlacaForm } from "@/components/forms/consulta-placa-form";
import { PageHero } from "@/components/sections/page-hero";
import { formTextos } from "@/content/conversion";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: "Consulta de placa gratis",
  description: "Te decimos gratis si el SOAT y la Revisión Técnica del auto que quieres comprar están vigentes. Solo necesitas la placa y tu celular.",
  alternates: { canonical: "/guia/consulta-placa-gratis" },
};

export default function ConsultaPlacaPage() {
  return (
    <>
      <PageHero
        migas={[
          { nombre: "Guía", href: "/guia" },
          { nombre: "Consulta de placa gratis", href: "/guia/consulta-placa-gratis" },
        ]}
        eyebrow="Gratis"
        titulo={home.consultaPlaca.titulo}
        resumen={home.consultaPlaca.texto}
      />
      <section aria-label="Formulario de consulta" className="surface-light py-(--spacing-section)">
        <div className="container-site max-w-5xl">
          <div className="rounded-card border border-line bg-white p-6 lg:p-8">
            <ConsultaPlacaForm
              textos={{ ...formTextos.placa, errorFormulario: formTextos.errorFormulario, otraConsulta: formTextos.otraConsulta }}
              ubicacion="guia-consulta-placa"
            />
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-h3">Qué te respondemos gratis</h2>
              {/* Fuente: contenido.json → recursos_gratis[0] (SOAT y RT por placa) y recursos_gratis[1] (dueños, en landings). */}
              <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
                {["Si el SOAT está vigente.", "Si la Revisión Técnica está vigente.", "Cuántos dueños ha tenido el auto."].map((t) => (
                  <li key={t} className="flex items-start gap-3 py-3">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand-deep" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-h3">¿Necesitas más que eso?</h2>
              <p className="mt-4 text-muted">
                Papeletas en provincias, órdenes de captura, gravámenes o antecedentes de robo se revisan en el informe Antecedentes
                Completo. La guía te explica dónde se consulta cada cosa.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <Link href="/servicios/antecedentes-completo" className="text-brand-deep underline underline-offset-4">
                  Ver Antecedentes Completo
                </Link>
                <Link href="/guia" className="text-brand-deep underline underline-offset-4">
                  Leer la guía 2026
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
