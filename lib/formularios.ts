/**
 * Esquemas Zod de los formularios, compartidos por cliente (validación inmediata) y
 * servidor (Server Actions). Mensajes en español; placa peruana y celular de 9 dígitos que
 * empieza por 9 (lib/validacion.ts).
 */
import { z } from "zod";
import { CELULAR_RE, mascaraPlaca, PLACA_RE } from "./validacion";

const celular = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(
    z
      .string()
      .min(1, "Ingresa tu celular.")
      .regex(CELULAR_RE, "El celular debe tener 9 dígitos y empezar con 9."),
  );

const acepta = z
  .string()
  .optional()
  .refine((v) => v === "on" || v === "true", "Acepta la política de privacidad para continuar.");

/** Honeypot: debe llegar vacío (los bots lo rellenan). */
const honeypot = z.string().optional();

export const consultaPlacaSchema = z.object({
  placa: z
    .string()
    .transform((v) => mascaraPlaca(v))
    .pipe(
      z
        .string()
        .min(1, "Ingresa la placa del auto.")
        .regex(PLACA_RE, "Revisa la placa: debe tener el formato ABC-123."),
    ),
  celular,
  acepta,
  empresa: honeypot,
});
export type ConsultaPlaca = z.infer<typeof consultaPlacaSchema>;

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre.").max(80, "El nombre es muy largo."),
  celular,
  correo: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo.")
    .pipe(z.email("Revisa el correo: debe tener el formato nombre@dominio.com.")),
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(1000, "El mensaje es muy largo (máximo 1000 caracteres)."),
  acepta,
  empresa: honeypot,
});
export type Contacto = z.infer<typeof contactoSchema>;

export type CampoError = Record<string, string>;

export type EstadoFormulario = {
  estado: "inicial" | "ok" | "error";
  /** Errores por campo (solo en «error» de validación). */
  errores?: CampoError;
  /** Error general (fallo al guardar). */
  mensaje?: string;
  /** Enlace a WhatsApp prellenado (éxito o fallback). */
  whatsapp?: string;
  /** Valores enviados, para repoblar el formulario sin JS. */
  valores?: Record<string, string>;
};

export const estadoInicial: EstadoFormulario = { estado: "inicial" };

/** Convierte un ZodError en { campo: primer mensaje }. */
export function erroresDe(error: z.ZodError): CampoError {
  const out: CampoError = {};
  for (const i of error.issues) {
    const campo = String(i.path[0] ?? "formulario");
    if (!out[campo]) out[campo] = i.message;
  }
  return out;
}

export function datosDe(fd: FormData, campos: string[]): Record<string, string> {
  return Object.fromEntries(campos.map((c) => [c, String(fd.get(c) ?? "")]));
}
