import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** 349 → "S/ 349" (formato peruano; los precios del sitio son enteros). */
export function formatPEN(monto: number): string {
  return `S/ ${monto.toLocaleString("en-US")}`;
}

/** Marcadores de datos faltantes (ver content/schema.ts). */
export function esPendiente(valor: string | null | undefined): boolean {
  return !valor || /\[(PENDIENTE|CONFIRMAR) CLIENTE/.test(valor);
}

/** «Tips mecánicos» → «tips-mecanicos». */
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
