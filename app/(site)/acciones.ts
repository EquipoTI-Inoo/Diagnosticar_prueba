"use server";

import {
  contactoSchema,
  consultaPlacaSchema,
  datosDe,
  erroresDe,
  type EstadoFormulario,
} from "@/lib/formularios";
import { guardarLead } from "@/lib/leads";
import { CAMPOS_LIBRO } from "@/lib/libro";
import { libroSchema } from "@/lib/libro-servidor";
import { mensajeConsultaPlaca } from "@/lib/wa";
import { waHref } from "@/lib/whatsapp";

/** «Consulta gratis por placa»: valida en servidor, guarda el lead y devuelve el fallback de WhatsApp. */
export async function enviarConsultaPlaca(
  _prev: EstadoFormulario,
  fd: FormData,
): Promise<EstadoFormulario> {
  const valores = datosDe(fd, ["placa", "celular"]);
  const r = consultaPlacaSchema.safeParse({
    ...datosDe(fd, ["placa", "celular", "empresa"]),
    acepta: fd.get("acepta") ?? undefined,
  });
  if (!r.success) return { estado: "error", errores: erroresDe(r.error), valores };
  const whatsapp = waHref(mensajeConsultaPlaca(r.data.placa, r.data.celular));
  // Honeypot relleno: respondemos «ok» sin guardar (no damos pistas al bot).
  if (r.data.empresa) return { estado: "ok", whatsapp };
  try {
    await guardarLead("consulta-placa", { placa: r.data.placa, celular: r.data.celular });
    return { estado: "ok", whatsapp };
  } catch {
    return { estado: "error", mensaje: "guardar", whatsapp, valores };
  }
}

/** Formulario de contacto. */
export async function enviarContacto(
  _prev: EstadoFormulario,
  fd: FormData,
): Promise<EstadoFormulario> {
  const valores = datosDe(fd, ["nombre", "celular", "correo", "mensaje"]);
  const r = contactoSchema.safeParse({
    ...datosDe(fd, ["nombre", "celular", "correo", "mensaje", "empresa"]),
    acepta: fd.get("acepta") ?? undefined,
  });
  if (!r.success) return { estado: "error", errores: erroresDe(r.error), valores };
  const whatsapp = waHref(`Hola, soy ${r.data.nombre}. ${r.data.mensaje}`);
  if (r.data.empresa) return { estado: "ok", whatsapp };
  try {
    const { nombre, celular, correo, mensaje } = r.data;
    await guardarLead("contacto", { nombre, celular, correo, mensaje });
    return { estado: "ok", whatsapp };
  } catch {
    return { estado: "error", mensaje: "guardar", whatsapp, valores };
  }
}

/**
 * Libro de Reclamaciones: valida con Zod y SIMULA el envío (prototipo). No guarda ni envía datos
 * a terceros; solo registra en el log del servidor que hubo un envío simulado, sin datos personales.
 */
export async function enviarReclamo(_prev: EstadoFormulario, fd: FormData): Promise<EstadoFormulario> {
  const entrada = Object.fromEntries(
    [...CAMPOS_LIBRO, "declaro", "acepto", "empresa"].map((k) => [k, fd.get(k) === null ? undefined : String(fd.get(k))]),
  );
  const valores = Object.fromEntries(CAMPOS_LIBRO.map((k) => [k, String(fd.get(k) ?? "")]));
  const r = libroSchema.safeParse(entrada);
  if (!r.success) return { estado: "error", errores: erroresDe(r.error), valores };
  if (!r.data.empresa) console.info("[libro-de-reclamaciones] envío simulado:", r.data.tipo_reclamo, r.data.tipo_consumo);
  return { estado: "ok", valores: { tipo_reclamo: r.data.tipo_reclamo, fecha: new Date().toISOString().slice(0, 10) } };
}
