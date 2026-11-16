/**
 * Capa de analítica: `track(evento, props)` → `window.dataLayer.push`.
 *
 * Consentimiento (real, no decorativo):
 * - Sin consentimiento de analítica guardado, `track()` NO envía nada (en desarrollo lo
 *   registra en consola como «no enviado»).
 * - Los scripts de GTM / Meta Pixel / TikTok Pixel solo se cargan tras el consentimiento
 *   correspondiente (components/layout/third-party-scripts.tsx).
 * - El banner guarda la elección en localStorage `dc-consent` y emite el evento `dc:consent`.
 */
export type Evento =
  | "whatsapp_click"
  | "phone_click"
  | "lead_placa"
  | "lead_contacto"
  | "informe_descarga"
  | "comparativa_view"
  | "faq_open"
  | "guia_read"
  | "video_play"
  | "consent_update";

export type Consentimiento = { analitica: boolean; marketing: boolean; fecha?: string };

const CLAVE = "dc-consent";
export const EVENTO_CONSENTIMIENTO = "dc:consent";
export const EVENTO_ABRIR_COOKIES = "dc:cookies-open";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function leerConsentimiento(): Consentimiento | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consentimiento;
    return typeof c.analitica === "boolean" && typeof c.marketing === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(c: Consentimiento): void {
  const valor = { ...c, fecha: new Date().toISOString() };
  window.localStorage.setItem(CLAVE, JSON.stringify(valor));
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: valor }));
  // Registro del cambio de consentimiento (solo si ahora hay analítica permitida).
  track("consent_update", { analitica: c.analitica, marketing: c.marketing });
}

export function abrirPreferenciasCookies(): void {
  window.dispatchEvent(new Event(EVENTO_ABRIR_COOKIES));
}

export function track(
  evento: Evento,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  if (typeof window === "undefined") return;
  const permitido = leerConsentimiento()?.analitica === true;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[track]${permitido ? "" : " (sin consentimiento: no enviado)"}`, evento, props);
  }
  if (!permitido) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: evento, ...props });
}
