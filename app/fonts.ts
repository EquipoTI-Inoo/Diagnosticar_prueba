import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Titulares: Archivo como instancia estática wdth 87.5 / wght 800, subset latín (~12 KB).
 * Se genera con scripts/build-fonts.py (ver app/fonts/README.md). Antes se usaba el variable
 * completo de Google Fonts (~90 KB), que retrasaba el LCP del H1.
 */
export const archivo = localFont({
  src: "./fonts/archivo-800-87.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: "Arial",
});

/** Texto: Inter Tight 400/500 (variable). */
export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  // Sin preload: el H1 (elemento LCP) solo usa Archivo; precargar el texto retrasaba el LCP.
  preload: false,
  variable: "--font-inter-tight",
});

/** Datos, cifras, placas, códigos: JetBrains Mono 500. */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  preload: false,
  variable: "--font-jetbrains",
});
