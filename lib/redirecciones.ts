/**
 * Redirecciones del sitio WordPress actual al nuevo (§4 del PROMPT_MAESTRO).
 * Fuente de verdad única para: next.config.ts (301), middleware.ts (410),
 * scripts/check-redirecciones.ts y docs/REDIRECTS.md (scripts/build-redirects-md.ts).
 *
 * Las URLs antiguas se escriben como en `contenido.json → paginas[].url` (con barra final).
 * Las de los artículos (/AAAA/MM/DD/slug/) se generan desde el frontmatter `urlOriginal`
 * de content/blog/*.mdx (ver lib/redirecciones-blog.ts).
 *
 * Este archivo no usa `fs`: lo importa el middleware (Edge).
 */

export type Redireccion = { origen: string; destino: string; motivo: string };
export type Eliminada = { origen: string; motivo: string };

const r = (origenes: string[], destino: string, motivo: string): Redireccion[] =>
  origenes.map((origen) => ({ origen, destino, motivo }));

/** 301 permanentes. */
export const REDIRECCIONES: Redireccion[] = [
  // --- Tabla de la §4 ---
  ...r(
    ["/precios/", "/servicios-1/", "/servicios/", "/service/", "/diagnostico/"],
    "/servicios",
    "§4",
  ),
  ...r(
    ["/servicio-diagnosticar/", "/diagnosticar/", "/reporte-diagnosticar-2/"],
    "/servicios/diagnosticar",
    "§4",
  ),
  ...r(
    ["/servicio-diagnostico-basico/", "/reporte-basico/", "/reporteverbal/"],
    "/servicios/diagnostico-basico",
    "§4",
  ),
  ...r(
    ["/servicio-diagnosticar-plus/", "/reporte-diagnosticar-plus/"],
    "/servicios/diagnosticar-plus",
    "§4",
  ),
  ...r(["/servicio-antecedentes-basico/"], "/servicios/antecedentes-basico", "§4"),
  ...r(
    [
      "/servicio-antecedentes-completo/",
      "/antecedentes/",
      "/antecedentes-3/",
      "/revision-antecedes-boost/",
    ],
    "/servicios/antecedentes-completo",
    "§4",
  ),
  ...r(
    ["/servicio-asesoria-precompra/", "/asesoria-virtual/", "/asesoria-pre-compra-online/"],
    "/servicios/asesoria-precompra-online",
    "§4",
  ),
  ...r(["/servicio-certifica-tu-auto/", "/venta-sin-consignar/"], "/vende-tu-auto", "§4"),
  ...r(["/nosotros/", "/about/"], "/nosotros", "§4"),
  ...r(["/contact/", "/contacto/"], "/contacto", "§4"),
  ...r(["/guia/", "/guia-2/", "/gratis/"], "/guia", "§4"),
  ...r(["/checklist-precompra/"], "/guia/checklist", "§4"),
  ...r(["/top-5-problemas/", "/puntos-importantes/"], "/guia/problemas-comunes", "§4"),
  ...r(
    ["/centro-de-ayuda/", "/unico-dueno-2/", "/verbal-gratis/"],
    "/guia/consulta-placa-gratis",
    "§4",
  ),
  ...r(
    [
      "/escaneo/",
      "/detector-de-choques/",
      "/videoscopo/",
      "/revision-vehicular/",
      "/manejo/",
      "/escrito/",
      "/verbal/",
    ],
    "/tecnologia",
    "§4",
  ),
  ...r(["/como-comprar/"], "/como-funciona", "§4"),
  ...r(["/informe-ejemplo/"], "/informe-de-ejemplo", "§4"),
  ...r(["/terminos-y-condiciones/"], "/legal/terminos-y-condiciones", "§4"),

  // --- URLs del JSON que la §4 no lista (decisión del prototipo, ver docs/REDIRECTS.md) ---
  ...r(["/blog/"], "/blog", "Misma página sin barra final"),
  ...r(["/cobertura/"], "/cobertura", "Misma página sin barra final"),
  ...r(["/libro-de-reclamaciones/"], "/libro-de-reclamaciones", "Misma página sin barra final"),
  ...r(["/2025/01/31/"], "/blog", "Archivo por fecha de WordPress"),
  ...r(["/category/diagnosticos/"], "/blog#diagnosticos", "Categoría del blog"),
  ...r(["/category/tip-mecanicos/"], "/blog#tips-mecanicos", "Categoría del blog"),
  ...r(["/category/novedades/"], "/blog#novedades", "Categoría del blog"),
  ...r(
    ["/category/entrevistas/", "/category/experiencias/"],
    "/blog",
    "Categoría sin artículos en el sitio nuevo",
  ),
  ...r(
    ["/asesora-pre-compra-online/", "/asesoria-pre-compra-online-boost/"],
    "/servicios/asesoria-precompra-online",
    "Landing de campaña (boost) del mismo servicio",
  ),
  ...r(
    ["/revision-pre-compra-boost/", "/landing-pre-compra/", "/landing-campana/", "/campana/"],
    "/servicios",
    "Landing de campaña: puede recibir tráfico de anuncios antiguos",
  ),
  ...r(["/otros-servicios/", "/tienda/"], "/servicios", "Listado de servicios antiguo"),
  ...r(
    ["/gracias-revision-antecedentes/"],
    "/servicios/antecedentes-completo",
    "Página de agradecimiento del formulario antiguo",
  ),
];

/** 410 Gone: páginas basura, duplicados, borradores y área de usuarios de WordPress. */
export const ELIMINADAS: Eliminada[] = [
  ...["/sample-page/", "/borrador/", "/home-2/"].map((origen) => ({
    origen,
    motivo: "Página basura de WordPress",
  })),
  ...[
    "/revision-antecedes-boost-duplicado-1505/",
    "/revision-pre-compra-boost-duplicado-1573/",
  ].map((origen) => ({
    origen,
    motivo: "Duplicado [#1505]/[#1573]",
  })),
  ...[
    "/blog-legacy/",
    "/contact-legacy/",
    "/guia-2-legacy/",
    "/nosotros-legacy/",
    "/servicios-1-legacy/",
  ].map((origen) => ({ origen, motivo: "Versión *-legacy" })),
  ...[
    "/preview-antecedentes-basico/",
    "/preview-antecedentes-completo/",
    "/preview-asesoria-precompra/",
    "/preview-blog/",
    "/preview-certifica-tu-auto/",
    "/preview-contacto/",
    "/preview-diagnosticar-plus/",
    "/preview-diagnostico-basico/",
    "/preview-guia/",
    "/preview-legales/",
    "/preview-mis-reportes/",
    "/preview-nosotros/",
    "/preview-servicio-diagnosticar/",
    "/preview-servicios/",
  ].map((origen) => ({ origen, motivo: "Borrador preview-*" })),
  ...[
    "/login/",
    "/register/",
    "/password-reset/",
    "/members/",
    "/mis-reportes/",
    "/panel-tecnico/",
  ].map((origen) => ({
    origen,
    motivo: "Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE]",
  })),
];

/** Rutas de 410 normalizadas sin barra final (para el middleware). */
export const RUTAS_ELIMINADAS = new Set(ELIMINADAS.map((e) => e.origen.replace(/\/$/, "")));
