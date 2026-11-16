import { imagenOg, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Guía 2026 para comprar un auto usado en Perú sin sorpresas";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return imagenOg({
    eyebrow: "Guía de compra 2026",
    titulo: "Cómo comprar un auto usado en Perú sin sorpresas",
  });
}
