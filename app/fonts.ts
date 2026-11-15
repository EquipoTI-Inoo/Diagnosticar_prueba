import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";

/** Titulares: Archivo variable con eje de anchura (wdth 87–100). */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** Texto: Inter Tight 400/500 (variable). */
export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

/** Datos, cifras, placas, códigos: JetBrains Mono 500. */
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-jetbrains",
});
