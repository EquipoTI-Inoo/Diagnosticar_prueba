import { home } from "@/content/home";
import { imagenOg, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "DiagnostiCAR: diagnóstico vehicular pre-compra a domicilio en Lima";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  // El lema ya aparece arriba a la derecha; aquí va la primera línea del H1 de la Home.
  return imagenOg({ eyebrow: home.hero.eyebrow, titulo: home.hero.h1Linea1 });
}
