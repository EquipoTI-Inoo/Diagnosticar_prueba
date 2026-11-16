import type { MetadataRoute } from "next";
import { fichaSlugs, getFicha } from "@/content/conversion";
import { ACTUALIZADO } from "@/content/educativo";
import { articulos } from "@/lib/blog";
import { SITIO } from "@/lib/seo";

/**
 * sitemap.xml (§8): todas las páginas públicas indexables. `lastModified` real solo donde hay
 * fecha (artículos: fecha original; guía y resto: fecha de actualización del contenido).
 */
const ESTATICAS: { path: string; prioridad: number }[] = [
  { path: "/", prioridad: 1 },
  { path: "/servicios", prioridad: 0.9 },
  { path: "/vende-tu-auto", prioridad: 0.8 },
  { path: "/como-funciona", prioridad: 0.7 },
  { path: "/cobertura", prioridad: 0.6 },
  { path: "/informe-de-ejemplo", prioridad: 0.6 },
  { path: "/tecnologia", prioridad: 0.6 },
  { path: "/guia", prioridad: 0.8 },
  { path: "/guia/checklist", prioridad: 0.7 },
  { path: "/guia/problemas-comunes", prioridad: 0.7 },
  { path: "/guia/consulta-placa-gratis", prioridad: 0.7 },
  { path: "/blog", prioridad: 0.6 },
  { path: "/nosotros", prioridad: 0.5 },
  { path: "/preguntas-frecuentes", prioridad: 0.6 },
  { path: "/contacto", prioridad: 0.6 },
  { path: "/legal/terminos-y-condiciones", prioridad: 0.3 },
  { path: "/legal/privacidad", prioridad: 0.2 },
  { path: "/legal/cookies", prioridad: 0.2 },
  { path: "/libro-de-reclamaciones", prioridad: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => (p === "/" ? `${SITIO}/` : `${SITIO}${p}`);
  return [
    ...ESTATICAS.map((e) => ({
      url: u(e.path),
      lastModified: ACTUALIZADO.iso,
      priority: e.prioridad,
    })),
    ...fichaSlugs.map((s) => ({
      url: u(getFicha(s)!.servicio.href),
      lastModified: ACTUALIZADO.iso,
      priority: 0.8,
    })),
    ...articulos().map((a) => ({
      url: u(`/blog/${a.slug}`),
      lastModified: a.fecha,
      priority: 0.5,
    })),
  ];
}
