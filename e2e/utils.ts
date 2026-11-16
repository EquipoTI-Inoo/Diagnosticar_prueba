import { test as base, expect, type Page } from "@playwright/test";

/** Consentimiento de cookies ya dado: el banner no tapa la página en las pruebas. */
export const test = base.extend({
  page: async ({ page }, usar) => {
    await page.addInitScript(() => {
      localStorage.setItem("dc-consent", JSON.stringify({ analitica: false, marketing: false }));
    });
    await usar(page);
  },
});
export { expect };

export const NUMERO_WA = "51923374470";
export const SITIO = "https://diagnosticarperu.com";

/** Rutas del sitemap (relativas). */
export async function rutasSitemap(page: Page): Promise<string[]> {
  const xml = await (await page.request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(SITIO, "") || "/");
}

/** ¿El build en ejecución es de producción? (meta robots index). */
export async function esProduccion(page: Page): Promise<boolean> {
  const html = await (await page.request.get("/")).text();
  return /<meta name="robots" content="index, follow"/.test(html);
}

/** Enlaces wa.me de la página: número y texto decodificado. */
export async function enlacesWhatsApp(page: Page): Promise<{ numero: string; texto: string; href: string }[]> {
  const hrefs = await page.locator('a[href^="https://wa.me/"]').evaluateAll((as) =>
    as.map((a) => (a as HTMLAnchorElement).href),
  );
  return hrefs.map((href) => {
    const u = new URL(href);
    return { numero: u.pathname.slice(1), texto: u.searchParams.get("text") ?? "", href };
  });
}
