import AxeBuilder from "@axe-core/playwright";
import { test, expect, rutasSitemap } from "./utils";

/**
 * axe-core (WCAG 2.0/2.1/2.2 A y AA + best-practice) en todas las rutas del sitemap, la 404,
 * la 410 y el menú móvil abierto. Falla con cualquier violación «serious» o «critical»;
 * las «moderate»/«minor» se listan en el reporte (hoy: 0).
 */
const ETIQUETAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

test("axe: sin violaciones serias en ninguna página", async ({ page }, info) => {
  test.setTimeout(300_000);
  const rutas = [...(await rutasSitemap(page)), "/esta-pagina-no-existe", "/login"];
  const serias: string[] = [];
  const menores: string[] = [];
  for (const ruta of rutas) {
    await page.goto(ruta);
    const r = await new AxeBuilder({ page }).withTags(ETIQUETAS).analyze();
    for (const v of r.violations) {
      const linea = `${ruta} · ${v.id} (${v.impact}) × ${v.nodes.length}`;
      (v.impact === "serious" || v.impact === "critical" ? serias : menores).push(linea);
    }
  }
  await info.attach("axe-resumen", {
    body: `${rutas.length} rutas · serias: ${serias.length} · moderadas/menores: ${menores.length}\n${[...serias, ...menores].join("\n")}`,
    contentType: "text/plain",
  });
  expect(serias).toEqual([]);
  expect(menores).toEqual([]);
});

test("axe: menú móvil abierto", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo en móvil");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const r = await new AxeBuilder({ page }).withTags(ETIQUETAS).analyze();
  expect(r.violations.map((v) => `${v.id} (${v.impact})`)).toEqual([]);
});
