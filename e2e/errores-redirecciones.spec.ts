import { REDIRECCIONES, ELIMINADAS } from "@/lib/redirecciones";
import { redireccionesBlog } from "@/lib/redirecciones-blog";
import { test, expect } from "./utils";

test("404 útil: título, noindex, buscador y CTA", async ({ page }) => {
  const r = await page.goto("/esta-pagina-no-existe");
  expect(r?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No encontramos esta página.");
  const robots = await page.locator('meta[name="robots"]').evaluateAll((m) => m.map((e) => e.getAttribute("content")));
  expect(robots.every((c) => /noindex/.test(c ?? ""))).toBe(true);
  const buscador = page.getByRole("searchbox").or(page.getByLabel("¿Qué buscabas?"));
  await buscador.first().fill("antecedentes");
  await expect(page.getByText(/\d+ resultados?/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Antecedentes Completo/ }).first()).toBeVisible();
  await expect(page.locator('a[href^="https://wa.me/"]').first()).toBeAttached();
});

test("410 para páginas eliminadas", async ({ page }) => {
  for (const { origen } of ELIMINADAS) {
    const r = await page.request.get(encodeURI(origen), { maxRedirects: 0 });
    expect(r.status(), origen).toBe(410);
    expect(r.headers()["x-robots-tag"], origen).toContain("noindex");
  }
  await page.goto("/login");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página ya no existe");
});

test("redirecciones 301 de la §4 y del blog: un solo salto al destino correcto", async ({ page }) => {
  const tabla = [...REDIRECCIONES, ...redireccionesBlog()];
  expect(tabla.length).toBeGreaterThanOrEqual(80);
  for (const { origen, destino } of tabla) {
    if (origen.replace(/\/$/, "") === destino) continue; // «/blog/» → «/blog» lo cubre la normalización
    const r = await page.request.get(encodeURI(origen), { maxRedirects: 0 });
    expect(r.status(), origen).toBe(301);
    expect(decodeURI(r.headers()["location"] ?? ""), origen).toBe(destino);
  }
});

test("redirecciones clave llegan a una página 200", async ({ page }) => {
  for (const [origen, destino] of [
    ["/precios/", "/servicios"],
    ["/videoscopo/", "/tecnologia"],
    ["/blog/", "/blog"],
    ["/servicios/", "/servicios"],
    ["/category/diagnosticos/", "/blog"],
  ] as const) {
    const r = await page.goto(origen);
    expect(r?.status(), origen).toBe(200);
    expect(new URL(page.url()).pathname, origen).toBe(destino);
  }
});

test("barra final: 301 a la versión sin barra", async ({ page }) => {
  const r = await page.request.get("/servicios/diagnosticar/", { maxRedirects: 0 });
  expect(r.status()).toBe(301);
  expect(r.headers()["location"]).toBe("/servicios/diagnosticar");
});
