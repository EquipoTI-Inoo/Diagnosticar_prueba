/**
 * Validación ligera en el navegador (sin Zod, para no sumar ~26 kB al JS de cliente).
 * Mismas reglas y mensajes que los esquemas Zod de lib/formularios.ts, que son la validación
 * autoritativa en la Server Action.
 */
import { MSG, type CampoError } from "./formularios-tipos";
import { CELULAR_RE, mascaraPlaca, PLACA_RE } from "./validacion";

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const val = (fd: FormData, k: string) => String(fd.get(k) ?? "");

function celular(fd: FormData, e: CampoError) {
  const c = val(fd, "celular").replace(/\D/g, "");
  if (!c) e.celular = MSG.celularVacio;
  else if (!CELULAR_RE.test(c)) e.celular = MSG.celularFormato;
}
function acepta(fd: FormData, e: CampoError) {
  const a = fd.get("acepta");
  if (a !== "on" && a !== "true") e.acepta = MSG.acepta;
}

export function validarConsultaPlaca(fd: FormData): CampoError | null {
  const e: CampoError = {};
  const placa = mascaraPlaca(val(fd, "placa"));
  if (!placa) e.placa = MSG.placaVacia;
  else if (!PLACA_RE.test(placa)) e.placa = MSG.placaFormato;
  celular(fd, e);
  acepta(fd, e);
  return Object.keys(e).length ? e : null;
}

export function validarContacto(fd: FormData): CampoError | null {
  const e: CampoError = {};
  const nombre = val(fd, "nombre").trim();
  if (nombre.length < 2) e.nombre = MSG.nombre;
  else if (nombre.length > 80) e.nombre = MSG.nombreLargo;
  celular(fd, e);
  const correo = val(fd, "correo").trim();
  if (!correo) e.correo = MSG.correoVacio;
  else if (!CORREO_RE.test(correo)) e.correo = MSG.correoFormato;
  const mensaje = val(fd, "mensaje").trim();
  if (mensaje.length < 10) e.mensaje = MSG.mensajeCorto;
  else if (mensaje.length > 1000) e.mensaje = MSG.mensajeLargo;
  acepta(fd, e);
  return Object.keys(e).length ? e : null;
}
