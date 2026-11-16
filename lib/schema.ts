/**
 * Datos estructurados JSON-LD (§8), tipados con schema-dts. Todo sale de content/*.ts
 * (generado desde docs/fuente/contenido.json): precios, NAP, geo, distritos, FAQ visibles.
 * La entidad global (AutomotiveBusiness + Organization, @id ORG_ID) se publica una vez en el
 * layout del sitio; el resto de nodos la referencian por @id.
 * Sin AggregateRating: Google no muestra estrellas auto-servidas para LocalBusiness (§8).
 * Sin openingHoursSpecification: el horario es [PENDIENTE CLIENTE] y no se inventa.
 */
import type {
  Article,
  AutomotiveBusiness,
  WebSite,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  HowTo,
  OfferCatalog,
  Service,
  WithContext,
} from "schema-dts";
import { cobertura } from "@/content/cobertura";
import { negocio } from "@/content/negocio";
import { servicios } from "@/content/servicios";
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

/** Article / BlogPosting (§8) para la guía y los artículos del blog. */
export function schemaArticulo(a: {
  tipo: "Article" | "BlogPosting";
  titulo: string;
  descripcion: string;
  path: string;
  publicado: string;
  modificado?: string;
  seccion?: string;
  imagen?: string;
}): WithContext<Article | BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": a.tipo,
    // Google recomienda headline ≤ 110 caracteres: si el título no cabe, se usa la parte antes
    // de los dos puntos y el título completo va en alternativeHeadline.
    headline: a.titulo.length > 110 ? a.titulo.split(":")[0]!.trim() : a.titulo,
    ...(a.titulo.length > 110 ? { alternativeHeadline: a.titulo } : {}),
    description: a.descripcion,
    url: url(a.path),
    mainEntityOfPage: url(a.path),
    datePublished: a.publicado,
    dateModified: a.modificado ?? a.publicado,
    inLanguage: "es-PE",
    ...(a.seccion ? { articleSection: a.seccion } : {}),
    ...(a.imagen ? { image: url(a.imagen) } : {}),
    author: { "@type": "Organization", name: "Equipo DiagnostiCAR", url: `${SITIO}/nosotros` },
    // Publisher embebido (además del @id) para validadores que no resuelven referencias entre bloques.
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: negocio.marca,
      url: `${SITIO}/`,
      logo: { "@type": "ImageObject", url: url("/logos/diagnosticar-logo-light.png") },
    },
  } as WithContext<Article | BlogPosting>;
}

/** Entidad global: AutomotiveBusiness (subtipo de LocalBusiness → Organization) + WebSite. */
export function schemaOrganizacion(): object[] {
  const d = negocio.direccion;
  const precios = servicios.map((x) => x.precio.actual).filter((p): p is number => p !== null);
  const redes = negocio.redes;
  // Tipado completo con schema-dts como AutomotiveBusiness…
  const org: WithContext<AutomotiveBusiness> = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": ORG_ID,
    name: negocio.marca,
    legalName: negocio.razonSocial,
    taxID: negocio.ruc,
    url: `${SITIO}/`,
    logo: {
      "@type": "ImageObject",
      url: url("/logos/diagnosticar-logo-light.png"),
    },
    image: url("/logos/diagnosticar-logo-light.png"),
    description: negocio.queEs,
    slogan: negocio.lema,
    telephone: negocio.telefono.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: d.calle,
      addressLocality: d.distrito,
      addressRegion: d.ciudad,
      postalCode: d.codigoPostal,
      addressCountry: d.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: d.geo.lat, longitude: d.geo.lng },
    areaServed,
    priceRange: `S/ ${Math.min(...precios)} – S/ ${Math.max(...precios)}`,
    currenciesAccepted: "PEN",
    sameAs: [redes.instagram.url, redes.youtube.url, redes.facebook.url, redes.tiktok.url].filter(
      (u) => u.startsWith("https://"),
    ),
  };
  const sitio: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITIO}/#sitio`,
    name: negocio.marca,
    url: `${SITIO}/`,
    inLanguage: "es-PE",
    publisher: { "@id": ORG_ID },
  };
  // …y publicado con doble tipo (AutomotiveBusiness ya hereda de Organization; §8 pide ambos).
  return [{ ...org, "@type": ["AutomotiveBusiness", "Organization"] }, sitio];
}
