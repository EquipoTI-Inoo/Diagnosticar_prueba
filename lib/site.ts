/**
 * Configuración por entorno.
 * - `SITE_ENV=production` → el sitio se indexa. Cualquier otro valor (por defecto) → noindex.
 *   La versión definitiva con robots.ts por entorno llega en la Fase 5.
 * - IDs de terceros: vacíos hasta que el cliente los entregue ([PENDIENTE CLIENTE]).
 */
export const indexable = process.env.SITE_ENV === "production";

export const terceros = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
};
