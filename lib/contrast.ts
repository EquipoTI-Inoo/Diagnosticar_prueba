/**
 * Combinaciones de color del sistema y su contraste WCAG 2.2.
 * Lo usan `scripts/check-contrast.ts` (CI) y la página /design-system (documentación).
 */
import { tokens } from "./tokens";

export type Par = {
  fg: keyof typeof tokens;
  bg: keyof typeof tokens;
  uso: string;
  minimo: 3 | 4.5;
  /**
   * Cómo se representa la muestra en /design-system. Solo `texto` se pinta como texto;
   * el resto son muestras gráficas (aria-hidden) para no presentar como texto un color
   * que solo se usa en gráficos o bordes.
   */
  muestra: Muestra;
};

export type Muestra = "texto" | "foco" | "borde" | "celda";

export const PARES: Par[] = [
  // Texto sobre claro
  { fg: "ink", bg: "paper", uso: "Texto principal sobre claro", minimo: 4.5, muestra: "texto" },
  { fg: "muted", bg: "paper", uso: "Texto secundario sobre claro", minimo: 4.5, muestra: "texto" },
  {
    fg: "brand-deep",
    bg: "paper",
    uso: "Enlaces y palabras clave sobre claro",
    minimo: 4.5,
    muestra: "texto",
  },
  {
    fg: "alert-deep",
    bg: "paper",
    uso: "Mensajes de error sobre claro",
    minimo: 4.5,
    muestra: "texto",
  },
  { fg: "ink", bg: "white", uso: "Texto en tarjetas blancas", minimo: 4.5, muestra: "texto" },
  {
    fg: "muted",
    bg: "white",
    uso: "Texto secundario en tarjetas blancas",
    minimo: 4.5,
    muestra: "texto",
  },
  // Texto sobre oscuro
  { fg: "paper", bg: "ink", uso: "Texto principal sobre oscuro", minimo: 4.5, muestra: "texto" },
  {
    fg: "paper",
    bg: "ink-2",
    uso: "Texto sobre superficie oscura secundaria",
    minimo: 4.5,
    muestra: "texto",
  },
  {
    fg: "ink-muted",
    bg: "ink",
    uso: "Texto secundario sobre oscuro",
    minimo: 4.5,
    muestra: "texto",
  },
  {
    fg: "ink-muted",
    bg: "ink-2",
    uso: "Texto secundario sobre ink-2",
    minimo: 4.5,
    muestra: "texto",
  },
  {
    fg: "brand",
    bg: "ink",
    uso: "Acento / palabra clave sobre oscuro",
    minimo: 4.5,
    muestra: "texto",
  },
  { fg: "brand", bg: "ink-2", uso: "Acento sobre ink-2", minimo: 4.5, muestra: "texto" },
  {
    fg: "alert-soft",
    bg: "ink",
    uso: "Mensajes de error sobre oscuro",
    minimo: 4.5,
    muestra: "texto",
  },
  // Botones
  {
    fg: "ink",
    bg: "brand",
    uso: "Botón primario (texto ink sobre brand)",
    minimo: 4.5,
    muestra: "texto",
  },
  { fg: "ink", bg: "whatsapp", uso: "Botón WhatsApp (texto ink)", minimo: 4.5, muestra: "texto" },
  {
    fg: "paper",
    bg: "brand-deep",
    uso: "Badge «Más elegido» sobre claro",
    minimo: 4.5,
    muestra: "texto",
  },
  { fg: "ink", bg: "warn", uso: "Etiqueta de semáforo ámbar", minimo: 4.5, muestra: "texto" },
  // No texto (WCAG 1.4.11: 3:1)
  { fg: "brand-deep", bg: "paper", uso: "Anillo de foco sobre claro", minimo: 3, muestra: "foco" },
  { fg: "brand", bg: "ink", uso: "Anillo de foco sobre oscuro", minimo: 3, muestra: "foco" },
  { fg: "muted", bg: "paper", uso: "Borde de inputs sobre claro", minimo: 3, muestra: "borde" },
  { fg: "ink-muted", bg: "ink", uso: "Borde de inputs sobre oscuro", minimo: 3, muestra: "borde" },
  { fg: "ok", bg: "paper", uso: "Celda de medidor verde sobre claro", minimo: 3, muestra: "celda" },
  {
    fg: "warn",
    bg: "ink",
    uso: "Celda de medidor ámbar sobre oscuro",
    minimo: 3,
    muestra: "celda",
  },
  {
    fg: "alert",
    bg: "paper",
    uso: "Celda de medidor rojo sobre claro",
    minimo: 3,
    muestra: "celda",
  },
  {
    fg: "alert",
    bg: "ink",
    uso: "Celda de medidor rojo sobre oscuro",
    minimo: 3,
    muestra: "celda",
  },
  { fg: "ok", bg: "ink", uso: "Celda de medidor verde sobre oscuro", minimo: 3, muestra: "celda" },
];

/** Pares que NO se usan para texto (se documentan como prohibidos). */
export const PROHIBIDOS: Omit<Par, "minimo" | "muestra">[] = [
  { fg: "brand", bg: "paper", uso: "Brand como texto sobre claro → usar brand-deep" },
  { fg: "white", bg: "whatsapp", uso: "Texto blanco sobre verde WhatsApp → usar ink" },
  { fg: "white", bg: "brand", uso: "Texto blanco sobre brand → usar ink" },
  { fg: "line", bg: "paper", uso: "line solo como divisor decorativo, no como borde de input" },
  {
    fg: "warn",
    bg: "paper",
    uso: "Ámbar como texto o celda sobre claro → acompañar siempre de cifra en ink",
  },
];

function lum(hex: string): number {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export function ratio(a: string, b: string): number {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}
