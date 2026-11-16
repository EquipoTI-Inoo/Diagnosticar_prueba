/**
 * Esquemas Zod de los formularios, compartidos por cliente (validación inmediata) y
 * servidor (Server Actions). Mensajes en español; placa peruana y celular de 9 dígitos que
 * empieza por 9 (lib/validacion.ts).
 */
import { z } from "zod";
import { MSG, type CampoError } from "./formularios-tipos";
import { CELULAR_RE, mascaraPlaca, PLACA_RE } from "./validacion";

export type { CampoError, EstadoFormulario } from "./formularios-tipos";
export { estadoInicial } from "./formularios-tipos";

const celular = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().min(1, MSG.celularVacio).regex(CELULAR_RE, MSG.celularFormato));

const acepta = z
  .string()
  .optional()
  .refine((v) => v === "on" || v === "true", MSG.acepta);

/** Honeypot: debe llegar vacío (los bots lo rellenan). */
const honeypot = z.string().optional();

export const consultaPlacaSchema = z.object({
  placa: z
    .string()
    .transform((v) => mascaraPlaca(v))
    .pipe(z.string().min(1, MSG.placaVacia).regex(PLACA_RE, MSG.placaFormato)),
  celular,
  acepta,
  empresa: honeypot,
});
export type ConsultaPlaca = z.infer<typeof consultaPlacaSchema>;

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2, MSG.nombre).max(80, MSG.nombreLargo),
  celular,
  correo: z.string().trim().min(1, MSG.correoVacio).pipe(z.email(MSG.correoFormato)),
  mensaje: z.string().trim().min(10, MSG.mensajeCorto).max(1000, MSG.mensajeLargo),
  acepta,
  empresa: honeypot,
});
export type Contacto = z.infer<typeof contactoSchema>;

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
