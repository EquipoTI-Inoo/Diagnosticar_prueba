/**
 * Metadata por página (§8): title «{Tema} | DiagnostiCAR Lima» ≤ 60, description ≤ 155,
 * canonical absoluto (https://diagnosticarperu.com), Open Graph y Twitter.
 * Los límites se validan al construir: una página que no los cumple rompe el build.
 * Imagen OG: por defecto la global (app/opengraph-image.tsx). Las fichas, los artículos y la guía
 * tienen su propio opengraph-image.tsx en el segmento (`ogPropia: true`: no se declara imagen).
 * (Un `openGraph` definido en la página reemplaza al heredado, por eso se declara aquí.)
 */
import type { Metadata } from "next";
import { negocio } from "@/content/negocio";

export const SITIO = negocio.sitio.replace(/\/$/, "");
export const SUFIJO_TITULO = `${negocio.marca} Lima`;
const IMAGEN_OG = {
  url: `${SITIO}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "DiagnostiCAR: diagnóstico vehicular pre-compra a domicilio en Lima",
};

export function metadatos({
  tema,
  descripcion,
  path,
  tipo = "website",
  publicado,
  modificado,
  ogPropia = false,
}: {
  tema: string;
  descripcion: string;
  path: string;
  tipo?: "website" | "article";
  publicado?: string;
  modificado?: string;
  /** true si el segmento tiene su propio opengraph-image.tsx (si no, Next usaría este valor). */
  ogPropia?: boolean;
}): Metadata {
  const titulo = `${tema} | ${SUFIJO_TITULO}`;
  if (titulo.length > 60)
    throw new Error(`Title de ${path} con ${titulo.length} caracteres (> 60): «${titulo}»`);
  if (descripcion.length > 155)
    throw new Error(
      `Description de ${path} con ${descripcion.length} caracteres (> 155): «${descripcion}»`,
    );
  const url = `${SITIO}${path === "/" ? "" : path}` || SITIO;
  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: { canonical: path === "/" ? `${SITIO}/` : url },
    openGraph: {
      type: tipo,
      locale: "es_PE",
      siteName: negocio.marca,
      url: path === "/" ? `${SITIO}/` : url,
      title: titulo,
      description: descripcion,
      ...(ogPropia ? {} : { images: [IMAGEN_OG] }),
      ...(tipo === "article" && publicado
        ? {
            publishedTime: publicado,
            modifiedTime: modificado ?? publicado,
            authors: ["Equipo DiagnostiCAR"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      ...(ogPropia ? {} : { images: [IMAGEN_OG.url] }),
    },
  };
}
