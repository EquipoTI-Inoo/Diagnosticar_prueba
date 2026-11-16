import { test, expect, esProduccion } from "./utils";

/**
 * [PENDIENTE CLIENTE]: en preview, badge amarillo (warn #E0A100 + texto ink) en cada marca;
 * en producción, ninguna marca visible: texto neutro «por confirmar» sin resaltar.
 */
const RUTAS = [
  "/", "/servicios", "/servicios/asesoria-precompra-online", "/servicios/antecedentes-basico",
  "/contacto", "/nosotros", "/cobertura", "/vende-tu-auto", "/como-funciona", "/informe-de-ejemplo",
  "/preguntas-frecuentes", "/legal/privacidad", "/blog/cuidado-con-el-kilometraje-aprende-a-comprobarlo",
];
const MARCA = /\[(PENDIENTE|CONFIRMAR) CLIENTE/;
const AMARILLO = "rgb(224, 161, 0)";

test("badge de pendientes según el entorno del build", async ({ page }) => {
  test.setTimeout(120_000);
  const produccion = await esProduccion(page);
  for (const ruta of RUTAS) {
    await page.goto(ruta);
    const badges = page.locator("[data-pendiente]");
    if (produccion) {
      await expect(page.locator('[data-pendiente="preview"]'), ruta).toHaveCount(0);
      const texto = await page.locator("body").innerText();
      expect(texto, ruta).not.toMatch(MARCA);
      for (const b of await badges.all()) {
        const fondo = await b.evaluate((e) => getComputedStyle(e).backgroundColor);
        expect(fondo, ruta).not.toBe(AMARILLO);
      }
    } else {
      expect(await badges.count(), `${ruta}: sin pendientes`).toBeGreaterThan(0);
      for (const b of await badges.all()) {
        await expect(b, ruta).toHaveAttribute("data-pendiente", "preview");
        await expect(b, ruta).toHaveCSS("background-color", AMARILLO);
        await expect(b, ruta).toHaveText(MARCA);
      }
      // Ninguna marca suelta fuera de un badge.
      const sueltas = await page.evaluate((fuente) => {
        const re = new RegExp(fuente);
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const out: string[] = [];
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          const el = n.parentElement!;
          if (re.test(n.textContent ?? "") && !el.closest("[data-pendiente], script, template") && el.offsetParent !== null)
            out.push((n.textContent ?? "").trim().slice(0, 80));
        }
        return out;
      }, MARCA.source);
      expect(sueltas, ruta).toEqual([]);
    }
  }
});

test("robots según el entorno", async ({ page }) => {
  const produccion = await esProduccion(page);
  const robots = await (await page.request.get("/robots.txt")).text();
  if (produccion) {
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toMatch(/User-Agent: GPTBot/);
    expect(robots).toContain("Sitemap: https://diagnosticarperu.com/sitemap.xml");
  } else {
    expect(robots).toMatch(/Disallow: \//);
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});
