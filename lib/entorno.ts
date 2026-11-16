/**
 * Entorno de build, disponible también en componentes de cliente: next.config.ts expone
 * `NEXT_PUBLIC_SITE_ENV` a partir de `SITE_ENV` (solo «production» o «preview»).
 * - preview (por defecto): `[PENDIENTE CLIENTE]` resaltado en amarillo y sitio `noindex`.
 * - production: los pendientes se muestran neutros («por confirmar») y el sitio se indexa.
 */
export const esProduccion = process.env.NEXT_PUBLIC_SITE_ENV === "production";

/** Marca de dato faltante en el contenido: `[PENDIENTE CLIENTE]`, `[CONFIRMAR CLIENTE: …]`. */
export const MARCA_PENDIENTE = /\[(?:PENDIENTE|CONFIRMAR) CLIENTE[^\]]*\]/;

/** Texto neutro: cada marca pasa a «por confirmar» (sin repetir si ya lo dice el texto). */
export function neutralizar(texto: string): string {
  return texto.replace(
    new RegExp(`(?:por confirmar\\s*)?${MARCA_PENDIENTE.source}`, "gi"),
    "por confirmar",
  );
}
