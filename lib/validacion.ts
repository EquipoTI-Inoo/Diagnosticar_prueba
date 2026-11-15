/**
 * Validaciones compartidas (cliente y Server Actions).
 * Placa peruana: 1 letra + 2 alfanuméricos + 3 dígitos (ABC-123, A1B-234).
 * Celular peruano: 9 dígitos que empiezan por 9.
 */
export const PLACA_RE = /^[A-Z][A-Z0-9]{2}-\d{3}$/;
export const CELULAR_RE = /^9\d{8}$/;

/** Normaliza lo que escribe el usuario a la máscara AAA-000. */
export function mascaraPlaca(entrada: string): string {
  const limpio = entrada
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  return limpio.length > 3 ? `${limpio.slice(0, 3)}-${limpio.slice(3)}` : limpio;
}

export function validarPlaca(placa: string): string | null {
  if (!placa) return "Ingresa la placa del auto.";
  if (!PLACA_RE.test(placa)) return "Revisa la placa: debe tener el formato ABC-123.";
  return null;
}

export function validarCelular(celular: string): string | null {
  const limpio = celular.replace(/\D/g, "");
  if (!limpio) return "Ingresa tu celular.";
  if (!CELULAR_RE.test(limpio)) return "El celular debe tener 9 dígitos y empezar con 9.";
  return null;
}
