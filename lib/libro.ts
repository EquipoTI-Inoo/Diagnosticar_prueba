/**
 * Libro de Reclamaciones (Indecopi): reglas compartidas cliente/servidor.
 * Campos, opciones y textos legales salen del formulario original (content/educativo-fuente.ts).
 * Validación ligera sin dependencias (cliente) + esquema Zod (servidor, lib/libro-servidor.ts).
 */
import { educativoFuente } from "@/content/educativo-fuente";
import { MSG, type CampoError } from "./formularios-tipos";
import { CELULAR_RE } from "./validacion";

const L = educativoFuente.libro;

export const LIBRO_MSG = {
  requerido: "Este dato es obligatorio.",
  documento: "Revisa el número: DNI 8 dígitos, RUC 11 dígitos, CE o pasaporte de 6 a 12 caracteres.",
  correo: MSG.correoFormato,
  celular: MSG.celularFormato,
  monto: "Escribe el monto en soles, por ejemplo 239 o 239.50.",
  detalleCorto: "Describe el reclamo con al menos 20 caracteres.",
  declaro: "Debes aceptar la declaración jurada.",
  acepto: MSG.acepta,
} as const;

export const DOC_RE: Record<string, RegExp> = {
  DNI: /^\d{8}$/,
  RUC: /^\d{11}$/,
  CE: /^[A-Za-z0-9]{6,12}$/,
  Pasaporte: /^[A-Za-z0-9]{6,12}$/,
};
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTO_RE = /^\d{1,7}(\.\d{1,2})?$/;

export const CAMPOS_LIBRO = [
  "nombres", "paterno", "materno", "tipo_doc", "nro_doc", "cel", "dep", "prov", "dist", "direccion", "referencia", "correo",
  "flag_menor", "nombre_tutor", "correo_tutor", "tipo_doc_tutor", "nro_doc_tutor",
  "tipo_reclamo", "tipo_consumo", "nro_pedido", "proveedor", "monto_reclamado", "descripcion",
  "fch_compra", "fch_consumo", "fch_vencimiento", "detalle_reclamo", "pedido_cliente",
] as const;

/** Valida un FormData del libro. Devuelve errores por campo o null. */
export function validarLibro(fd: FormData): CampoError | null {
  const v = (k: string) => String(fd.get(k) ?? "").trim();
  const e: CampoError = {};
  const req = (k: string) => {
    if (!v(k)) e[k] = LIBRO_MSG.requerido;
  };
  ["nombres", "paterno", "materno", "direccion", "prov", "dist", "nro_pedido", "descripcion", "pedido_cliente"].forEach(req);
  if (!(L.tiposDocumento as readonly string[]).includes(v("tipo_doc"))) {
    e.tipo_doc = LIBRO_MSG.requerido;
    req("nro_doc");
  } else if (!DOC_RE[v("tipo_doc")]!.test(v("nro_doc"))) e.nro_doc = v("nro_doc") ? LIBRO_MSG.documento : LIBRO_MSG.requerido;
  if (!CELULAR_RE.test(v("cel").replace(/\D/g, ""))) e.cel = v("cel") ? LIBRO_MSG.celular : LIBRO_MSG.requerido;
  if (!(L.departamentos as readonly string[]).includes(v("dep"))) e.dep = LIBRO_MSG.requerido;
  if (!CORREO_RE.test(v("correo"))) e.correo = v("correo") ? LIBRO_MSG.correo : LIBRO_MSG.requerido;
  if (v("flag_menor") === "si") {
    req("nombre_tutor");
    if (!CORREO_RE.test(v("correo_tutor"))) e.correo_tutor = v("correo_tutor") ? LIBRO_MSG.correo : LIBRO_MSG.requerido;
    if (!(L.tiposDocumento as readonly string[]).includes(v("tipo_doc_tutor"))) {
      e.tipo_doc_tutor = LIBRO_MSG.requerido;
      req("nro_doc_tutor");
    } else if (!DOC_RE[v("tipo_doc_tutor")]!.test(v("nro_doc_tutor")))
      e.nro_doc_tutor = v("nro_doc_tutor") ? LIBRO_MSG.documento : LIBRO_MSG.requerido;
  }
  if (!(L.tiposReclamo as readonly string[]).includes(v("tipo_reclamo"))) e.tipo_reclamo = LIBRO_MSG.requerido;
  if (!(L.tiposConsumo as readonly string[]).includes(v("tipo_consumo"))) e.tipo_consumo = LIBRO_MSG.requerido;
  if (v("monto_reclamado") && !MONTO_RE.test(v("monto_reclamado"))) e.monto_reclamado = LIBRO_MSG.monto;
  if (v("detalle_reclamo").length < 20) e.detalle_reclamo = v("detalle_reclamo") ? LIBRO_MSG.detalleCorto : LIBRO_MSG.requerido;
  if (fd.get("declaro") !== "on") e.declaro = LIBRO_MSG.declaro;
  if (fd.get("acepto") !== "on") e.acepto = LIBRO_MSG.acepto;
  return Object.keys(e).length ? e : null;
}
