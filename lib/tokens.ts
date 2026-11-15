/**
 * Tokens de color (fuente única para scripts y documentación).
 * Deben coincidir con las variables `--color-*` de `app/globals.css`;
 * `npm run check:contrast` falla si se desincronizan.
 */
export const tokens = {
  ink: "#0B1214",
  "ink-2": "#16211F",
  /** Añadido: texto secundario sobre oscuro (el documento solo define `muted` para claro). */
  "ink-muted": "#8E9C9A",
  paper: "#F5F6F3",
  white: "#FFFFFF",
  line: "#DDE2DE",
  muted: "#5C6B6A",
  brand: "#04ADBF",
  "brand-deep": "#00727E",
  ok: "#2E9E5B",
  warn: "#E0A100",
  alert: "#D6452F",
  /** Añadido: `alert` como texto no llega a 4.5:1 sobre paper. */
  "alert-deep": "#B8392A",
  /** Añadido: texto de error sobre oscuro. */
  "alert-soft": "#F08A78",
  whatsapp: "#25D366",
} as const;

export type Token = keyof typeof tokens;
