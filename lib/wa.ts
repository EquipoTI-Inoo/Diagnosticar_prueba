/** Construcción pura de enlaces wa.me (sin dependencias de contenido: apta para cliente). */
export function waUrl(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function mensajeConsultaPlaca(placa: string, celular?: string): string {
  const base = `Hola, quiero consultar gratis el SOAT y la Revisión Técnica de la placa ${placa}`;
  return celular ? `${base}. Mi celular: ${celular}` : base;
}
