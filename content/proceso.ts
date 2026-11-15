/**
 * Proceso de reserva y diagnóstico en 4 pasos.
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";
import { pasoSchema, type Paso } from "./schema";

export const proceso: Paso[] = z.array(pasoSchema).parse([
  {
    numero: "01",
    titulo: "Chatea con nosotros",
    texto: "Escríbenos por WhatsApp y elige el servicio que necesitas.",
  },
  {
    numero: "02",
    titulo: "Programa tu cita",
    texto: "Reserva tu cita con el 50 % del servicio y completa un formulario corto.",
  },
  {
    numero: "03",
    titulo: "Diagnóstico",
    texto: "Vamos a donde está el auto. La revisión toma entre 40 y 70 minutos.",
  },
  {
    numero: "04",
    titulo: "Recibes el reporte",
    texto: "Te entregamos el reporte apenas terminamos la inspección.",
  },
]);
