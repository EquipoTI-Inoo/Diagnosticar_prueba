import type { Metadata } from "next";
import { SiteChrome } from "@/components/layout/site-chrome";
import { BuscadorServicios, type Destino } from "@/components/sections/buscador-servicios";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { servicios } from "@/content/servicios";
import { formatPEN } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | DiagnostiCAR Lima" },
  robots: { index: false, follow: true },
};

const destinos: Destino[] = [
  ...servicios.map((s) => ({
    titulo: s.nombre,
    href: s.href,
    detalle: `${s.precio.actual !== null ? `${formatPEN(s.precio.actual)} · ` : ""}${s.tagline}`,
    claves: `servicio plan precio ${s.tipo} ${s.resumen.join(" ")} ${s.detalle.join(" ")}`,
  })),
  {
    titulo: "Planes y precios",
    href: "/servicios",
    detalle: "Compara todos los planes",
    claves: "precios tarifas comparar",
  },
  {
    titulo: "Guía para comprar un auto usado",
    href: "/guia",
    detalle: "Qué revisar y dónde",
    claves: "sunarp sat papeletas guia",
  },
  {
    titulo: "Checklist precompra",
    href: "/guia/checklist",
    detalle: "7 puntos para imprimir",
    claves: "lista imprimir",
  },
  {
    titulo: "Problemas más comunes",
    href: "/guia/problemas-comunes",
    detalle: "Fugas, choques, kilometraje…",
    claves: "kilometraje choques airbags clonados",
  },
  {
    titulo: "Consulta de placa gratis",
    href: "/guia/consulta-placa-gratis",
    detalle: "SOAT y Revisión Técnica",
    claves: "placa soat gratis revision tecnica",
  },
  {
    titulo: "Cobertura en Lima",
    href: "/cobertura",
    detalle: "Distritos sin recargo",
    claves: "distritos domicilio traslado",
  },
  {
    titulo: "Cómo funciona",
    href: "/como-funciona",
    detalle: "Reserva y proceso",
    claves: "reservar agendar cita proceso",
  },
  { titulo: "Blog", href: "/blog", detalle: "Artículos y tips", claves: "articulos noticias" },
  {
    titulo: "Contacto",
    href: "/contacto",
    detalle: "WhatsApp y oficina",
    claves: "telefono whatsapp direccion",
  },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <section
        aria-labelledby="pagina-titulo"
        className="surface-dark bg-inspeccion pt-24 pb-14 lg:pt-36 lg:pb-20"
      >
        <div className="container-site">
          <Eyebrow>Error 404</Eyebrow>
          <h1 id="pagina-titulo" className="mt-5 text-h1">
            No encontramos esta página.
          </h1>
          <p className="mt-5 max-w-[56ch] text-[1.125rem] text-fg-muted">
            Puede que el enlace sea del sitio anterior o que la página haya cambiado de dirección.
            Busca el servicio o la guía que necesitas.
          </p>
        </div>
      </section>
      <section aria-label="Buscador de servicios y guías" className="surface-light py-16">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <BuscadorServicios destinos={destinos} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-h3">¿Prefieres que te ayudemos?</h2>
            <p className="mt-3 text-muted">
              Escríbenos por WhatsApp y te recomendamos el plan para tu caso.
            </p>
            <div className="mt-5">
              <WhatsAppButton ubicacion="404" variant="primary">
                Escribir por WhatsApp
              </WhatsAppButton>
            </div>
          </aside>
        </div>
      </section>
    </SiteChrome>
  );
}
