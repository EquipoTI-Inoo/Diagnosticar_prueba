/**
 * Almacenamiento de leads del PROTOTIPO: una línea JSON por envío en `.data/leads.jsonl`
 * (fuera de /public y fuera de git) + registro en la consola del servidor.
 * En producción se reemplaza por el CRM / correo / hoja que defina el cliente ([PENDIENTE CLIENTE]).
 * Solo se usa desde Server Actions.
 */
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const DIR = join(process.cwd(), ".data");

export async function guardarLead(
  tipo: "consulta-placa" | "contacto",
  datos: Record<string, unknown>,
) {
  const registro = { tipo, fecha: new Date().toISOString(), ...datos };
  console.info("[lead]", JSON.stringify(registro));
  await mkdir(DIR, { recursive: true });
  await appendFile(join(DIR, "leads.jsonl"), JSON.stringify(registro) + "\n", "utf8");
}
