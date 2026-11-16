import { test, expect, rutasSitemap } from "./utils";

/** Todas las rutas del sitemap cargan con 200, un H1, title del patrón, canonical y sin errores de consola. */
test("todas las rutas del sitemap navegan sin errores", async ({ page }) => {
  test.setTimeout(240_000);
  const rutas = await rutasSitemap(page);
  expect(rutas.length).toBeGreaterThanOrEqual(46);
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(`${page.url()}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(`${page.url()}: ${m.text()}`);
  });
  for (const ruta of rutas) {
    const r = await page.goto(ruta, { waitUntil: "load" });
    expect(r?.status(), ruta).toBe(200);
    await expect(page.locator("h1"), ruta).toHaveCount(1);
    await expect(page, ruta).toHaveTitle(/ \| DiagnostiCAR Lima$/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, ruta).toMatch(/^https:\/\/diagnosticarperu\.com/);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho, `${ruta}: desborde horizontal`).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
  expect(errores).toEqual([]);
});

test("menú principal y footer llevan a páginas existentes", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('header a[href^="/"], footer a[href^="/"]')
    .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0]!))]);
  expect(hrefs.length).toBeGreaterThan(15);
  for (const h of hrefs) {
    const r = await page.request.get(h, { maxRedirects: 0 });
    expect(r.status(), h).toBe(200);
  }
});

test("migas visibles en páginas internas", async ({ page }) => {
  for (const ruta of ["/servicios/diagnosticar", "/guia/checklist", "/blog/cuidado-con-el-kilometraje-aprende-a-comprobarlo"]) {
    await page.goto(ruta);
    const migas = page.getByRole("navigation", { name: /migas|ruta|breadcrumb/i });
    await expect(migas, ruta).toBeVisible();
    await expect(migas.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    await expect(migas.locator('[aria-current="page"]')).toHaveCount(1);
  }
});
