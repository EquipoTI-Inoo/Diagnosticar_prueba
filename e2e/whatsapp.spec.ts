import { fichas, paginaCobertura, paginaVende } from "@/content/conversion";
import { home } from "@/content/home";
import { negocio } from "@/content/negocio";
import { getServicio, servicios } from "@/content/servicios";
import type { ServicioSlug } from "@/content/schema";
import { articulos } from "@/lib/blog";
import { mensajeReserva } from "@/lib/whatsapp";
import { test, expect, enlacesWhatsApp, rutasSitemap, NUMERO_WA } from "./utils";

/** Todos los textos prellenados válidos (§3): reserva genérica, reserva por servicio y mensajes propios. */
const PERMITIDOS = new Set([
  mensajeReserva(),
  ...servicios.map((s) => mensajeReserva(s.nombreWhatsapp)),
  home.ctaFinal.mensajeConsejos,
  paginaVende.mensajeWhatsapp,
  paginaCobertura.mensajeWhatsapp,
  "Hola, tengo una consulta sobre el diagnóstico", // /preguntas-frecuentes («¿Otra duda?»)
]);

/** Mensaje que DEBE aparecer en cada página (CTA principal). */
const ESPERADO: Record<string, string> = {
  "/": mensajeReserva(),
  "/guia": mensajeReserva(getServicio("diagnosticar").nombreWhatsapp),
  "/guia/checklist": mensajeReserva("DiagnostiCAR"),
  "/guia/problemas-comunes": mensajeReserva("DiagnostiCAR"),
  "/vende-tu-auto": paginaVende.mensajeWhatsapp,
  "/cobertura": paginaCobertura.mensajeWhatsapp,
  ...Object.fromEntries(fichas.map((f) => [f.servicio.href, mensajeReserva(f.servicio.nombreWhatsapp)])),
  ...Object.fromEntries(
    articulos().map((a) => [`/blog/${a.slug}`, mensajeReserva(getServicio(a.servicio as ServicioSlug).nombreWhatsapp)]),
  ),
};

test("el número de WhatsApp del contenido es el de la §3", () => {
  expect(negocio.whatsapp.numero).toBe(NUMERO_WA);
});

test("CTAs de WhatsApp: número y texto correctos en todas las páginas", async ({ page }) => {
  test.setTimeout(240_000);
  for (const ruta of await rutasSitemap(page)) {
    await page.goto(ruta);
    const enlaces = await enlacesWhatsApp(page);
    expect(enlaces.length, `${ruta}: sin CTA de WhatsApp`).toBeGreaterThan(0);
    for (const e of enlaces) {
      expect(e.numero, `${ruta}: ${e.href}`).toBe(NUMERO_WA);
      expect(PERMITIDOS.has(e.texto), `${ruta}: texto no previsto «${e.texto}»`).toBe(true);
    }
    if (ESPERADO[ruta]) {
      expect(enlaces.map((e) => e.texto), `${ruta}: falta «${ESPERADO[ruta]}»`).toContain(ESPERADO[ruta]);
    }
  }
});

test("los CTAs de WhatsApp abren en pestaña nueva y registran el evento", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("dc-consent", JSON.stringify({ analitica: true, marketing: false }));
  });
  await page.goto("/servicios/diagnosticar");
  const cta = page.locator('main a[href^="https://wa.me/"]').first();
  await expect(cta).toHaveAttribute("target", "_blank");
  await expect(cta).toHaveAttribute("rel", /noopener/);
  // Evento whatsapp_click en dataLayer sin abrir WhatsApp (se bloquea la navegación externa).
  await page.context().route("https://wa.me/**", (r) => r.abort());
  const [popup] = await Promise.all([page.waitForEvent("popup").catch(() => null), cta.click()]);
  await popup?.close();
  const eventos = await page.evaluate(() =>
    ((window as unknown as { dataLayer?: { event?: string }[] }).dataLayer ?? []).map((e) => e.event),
  );
  expect(eventos).toContain("whatsapp_click");
});
