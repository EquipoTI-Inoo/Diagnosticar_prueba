import localFont from "next/font/local";

/**
 * Fuentes autohospedadas, generadas con scripts/build-fonts.py (ver app/fonts/README.md).
 * Subsets latín + español a medida: ~39 KB en total frente a ~79 KB con los subsets «latin»
 * de Google Fonts, para acortar la ruta crítica del LCP móvil.
 */

/** Titulares: Archivo, instancia estática wdth 87.5 / wght 800 (~12 KB). El H1 suele ser el LCP. */
export const archivo = localFont({
  src: "./fonts/archivo-800-87.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: "Arial",
});

/** Texto: Inter Tight variable recortada a 400–500 (~19 KB). En las fichas el LCP es un párrafo. */
export const interTight = localFont({
  src: "./fonts/intertight-400-500.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-inter-tight",
  adjustFontFallback: "Arial",
});

/** Datos, cifras, placas, códigos: JetBrains Mono 500 (~8 KB). */
export const jetbrains = localFont({
  src: "./fonts/jetbrains-500.woff2",
  weight: "500",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-jetbrains",
  adjustFontFallback: false,
});
