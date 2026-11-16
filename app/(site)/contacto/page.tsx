import type { Metadata } from "next";
import { ContactoForm } from "@/components/forms/contacto-form";
import { PageHero } from "@/components/sections/page-hero";
import { Pendiente } from "@/components/ui/pendiente";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackedLink } from "@/components/ui/tracked-link";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { formTextos, paginaContacto as p } from "@/content/conversion";
import { negocio } from "@/content/negocio";
import { esPendiente } from "@/lib/utils";

export const metadata: Metadata = {
  title: p.seo.title,
  description: p.seo.description,
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const { redes } = negocio;
  const datos: { t: string; v: React.ReactNode }[] = [
    {
      t: "Teléfono",
      v: (
        <TrackedLink
          href={`tel:${negocio.telefono.e164}`}
          evento="phone_click"
          props={{ ubicacion: "contacto" }}
          className="font-mono underline underline-offset-4"
        >
          {negocio.telefono.display}
        </TrackedLink>
      ),
    },
    {
      t: "Oficina",
      v: (
        <>
          {negocio.direccion.calle}, {negocio.direccion.distrito}, {negocio.direccion.ciudad}
          <span className="mt-1 block text-sm text-fg-muted">{p.aclaracionOficina}</span>
        </>
      ),
    },
    {
      t: "Horario",
      v: (
        <>
          {negocio.horario.dias},{" "}
          {esPendiente(negocio.horario.horas) ? <Pendiente /> : negocio.horario.horas}
        </>
      ),
    },
    { t: "Correo", v: <Pendiente /> },
    {
      t: "Redes",
      v: (
        <span className="flex flex-wrap gap-x-4">
          {[
            ["Instagram", redes.instagram.url],
            ["YouTube", redes.youtube.url],
            ["Facebook", redes.facebook.url],
            ["TikTok", redes.tiktok.url],
          ].map(([n, u]) => (
            <a
              key={n}
              href={u}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              {n}
            </a>
          ))}
        </span>
      ),
    },
    {
      t: "Grupo de Facebook",
      v: (
        <>
          «{redes.grupoFacebook.nombre}» <Pendiente>URL [PENDIENTE CLIENTE]</Pendiente>
        </>
      ),
    },
  ];
  return (
    <>
      <PageHero
        migas={[{ nombre: "Contacto", href: "/contacto" }]}
        eyebrow="Atención por WhatsApp"
        titulo={p.h1}
        resumen={p.texto}
      >
        <div className="mt-8">
          <WhatsAppButton ubicacion="contacto-hero" size="lg">
            Escribir por WhatsApp{" "}
            <span className="whitespace-nowrap">· {negocio.whatsapp.display}</span>
          </WhatsAppButton>
        </div>
      </PageHero>
      <section aria-labelledby="form-titulo" className="surface-light py-(--spacing-section)">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <SectionHeading id="form-titulo" eyebrow="Formulario" titulo="Escríbenos" />
            <div className="mt-8">
              <ContactoForm
                textos={{
                  ...formTextos.contacto,
                  errorFormulario: formTextos.errorFormulario,
                  otraConsulta: formTextos.otraConsulta,
                }}
              />
            </div>
          </div>
          <aside aria-labelledby="datos-titulo" className="lg:col-span-4 lg:col-start-9">
            <h2
              id="datos-titulo"
              className="font-mono text-eyebrow font-medium tracking-[0.12em] text-muted uppercase [font-stretch:100%]"
            >
              Datos de contacto
            </h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {datos.map((d) => (
                <div key={d.t} className="py-4">
                  <dt className="font-mono text-xs tracking-wide text-muted uppercase">{d.t}</dt>
                  <dd className="mt-1">{d.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
