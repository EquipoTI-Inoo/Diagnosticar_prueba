/**
 * Distritos de cobertura sin recargo.
 *
 * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json
 * (generado el 2026-11-15). No lo edites a mano: cambia la fuente o el script
 * y ejecuta `npm run import:content`.
 */
import { z } from "zod";

export const coberturaSchema = z.object({
  sinRecargo: z.array(z.string().min(1)).min(1),
  nota: z.string(),
  vigenciaConfirmada: z.boolean(),
});

export const cobertura = coberturaSchema.parse({
  sinRecargo: [
    "Magdalena",
    "San Miguel",
    "Jesús María",
    "Pueblo Libre",
    "Lince",
    "San Isidro",
    "Miraflores",
    "Barranco",
    "Surco",
    "San Borja",
  ],
  nota: "¿Otro distrito? Escríbenos y te decimos el costo de traslado.",
  vigenciaConfirmada: false,
});
