/**
 * Datos estructurados JSON-LD (§8) para las páginas de la Fase 3. Tipos de schema-dts.
 * Los precios salen de servicios.ts (los mismos que se muestran en la página).
 * La entidad global Organization/AutomotiveBusiness completa llega en la Fase 5; aquí se
 * referencia por @id.
 */
import type {
  BreadcrumbList,
  FAQPage,
  HowTo,
  OfferCatalog,
  Service,
  WithContext,
} from "schema-dts";
import { cobertura } from "@/content/cobertura";
import { negocio } from "@/content/negocio";
import type { Faq, Paso, Servicio } from "@/content/schema";

export const SITIO = negocio.sitio.replace(/\/$/, "");
export const ORG_ID = `${SITIO}/#organizacion`;
const url = (path: string) => `${SITIO}${path}`;

const areaServed = [
  ...cobertura.sinRecargo.map((d) => ({ "@type": "Place" as const, name: `${d}, Lima` })),
  { "@type": "City" as const, name: "Lima Metropolitana" },
];

function oferta(s: Servicio) {
  if (s.precio.actual === null) return undefined;
  return {
    "@type": "Offer" as const,
    price: s.precio.actual,
    priceCurrency: "PEN",
    url: url(s.href),
    availability: "https://schema.org/InStock" as const,
    ...(s.precio.antes
      ? {
          priceSpecification: [
            {
              "@type": "UnitPriceSpecification" as const,
              price: s.precio.actual,
              priceCurrency: "PEN",
            },
            {
              "@type": "UnitPriceSpecification" as const,
              price: s.precio.antes,
              priceCurrency: "PEN",
              priceType: "https://schema.org/StrikethroughPrice",
            },
          ],
        }
      : {}),
  };
}

function servicioNodo(s: Servicio, descripcion?: string): Service {
  const o = oferta(s);
  return {
    "@type": "Service",
    "@id": `${url(s.href)}#servicio`,
    name: s.nombre,
    serviceType:
      s.tipo === "antecedentes"
        ? "Informe de antecedentes vehiculares"
        : s.tipo === "asesoria"
          ? "Asesoría precompra de vehículos"
          : s.tipo === "certificacion"
            ? "Certificación de vehículo para la venta"
            : "Inspección vehicular pre-compra",
    description: descripcion ?? s.tagline,
    url: url(s.href),
    provider: { "@id": ORG_ID },
    areaServed,
    ...(o ? { offers: o } : {}),
  };
}

export function schemaServicio(s: Servicio, descripcion: string): WithContext<Service> {
  return { "@context": "https://schema.org", ...servicioNodo(s, descripcion) };
}

export function schemaCatalogo(lista: Servicio[]): WithContext<OfferCatalog> {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Planes de DiagnostiCAR",
    url: url("/servicios"),
    itemListElement: lista.map((s) => ({
      "@type": "Offer" as const,
      itemOffered: servicioNodo(s),
      ...(s.precio.actual !== null ? { price: s.precio.actual, priceCurrency: "PEN" } : {}),
    })),
  };
}

export function schemaFaq(lista: Faq[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lista.map((f) => ({
      "@type": "Question" as const,
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer" as const, text: f.respuesta },
    })),
  };
}

export function schemaHowTo(
  nombre: string,
  descripcion: string,
  pasos: Paso[],
): WithContext<HowTo> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: nombre,
    description: descripcion,
    step: pasos.map((p, i) => ({
      "@type": "HowToStep" as const,
      position: i + 1,
      name: p.titulo,
      text: p.texto,
    })),
  };
}

export type Miga = { nombre: string; href: string };

export function schemaMigas(migas: Miga[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: m.nombre,
      item: url(m.href),
    })),
  };
}
