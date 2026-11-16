import { formTextos } from "@/content/conversion";
import { test, expect, NUMERO_WA } from "./utils";

/**
 * Formularios: validación accesible (aria-invalid + foco en el primer error) y envío.
 * La consulta por placa y el contacto guardan el lead en .data/leads.jsonl (local, fuera de git);
 * el Libro de Reclamaciones solo simula el envío.
 */

test.describe("consulta gratis por placa", () => {
  for (const ruta of ["/", "/guia/consulta-placa-gratis"]) {
    test(`valida y envía en ${ruta}`, async ({ page }) => {
      await page.goto(ruta);
      const form = page.locator("form").filter({ has: page.locator('[name="placa"]') }).first();
      await form.getByRole("button", { name: formTextos.placa.boton }).click();
      await expect(form.locator('[name="placa"]')).toHaveAttribute("aria-invalid", "true");
      await expect(form.locator('[name="celular"]')).toHaveAttribute("aria-invalid", "true");
      await expect(form.locator('[name="placa"]')).toBeFocused();

      await form.locator('[name="placa"]').fill("abc123");
      await expect(form.locator('[name="placa"]')).toHaveValue("ABC-123");
      await form.locator('[name="celular"]').fill("912345678");
      await form.locator('[name="acepta"]').check();
      await form.getByRole("button", { name: formTextos.placa.boton }).click();

      await expect(page.getByText(formTextos.placa.exitoTitulo)).toBeVisible();
      const wa = page.locator(`a[href^="https://wa.me/${NUMERO_WA}"]`).filter({ hasText: /WhatsApp/ });
      const hrefs = await wa.evaluateAll((as) => as.map((a) => decodeURIComponent((a as HTMLAnchorElement).href)));
      expect(hrefs.some((h) => h.includes("placa ABC-123") && h.includes("912345678"))).toBe(true);
    });
  }
});

test("contacto: valida y envía", async ({ page }) => {
  await page.goto("/contacto");
  const enviar = page.getByRole("button", { name: formTextos.contacto.boton });
  await enviar.click();
  for (const n of ["nombre", "celular", "correo", "mensaje"]) {
    await expect(page.locator(`[name="${n}"]`)).toHaveAttribute("aria-invalid", "true");
  }
  await expect(page.locator('[name="nombre"]')).toBeFocused();
  await page.locator('[name="nombre"]').fill("Prueba QA");
  await page.locator('[name="celular"]').fill("912 345 678");
  await page.locator('[name="correo"]').fill("correo-invalido");
  await page.locator('[name="mensaje"]').fill("Quiero revisar un Toyota Yaris 2018 en Miraflores.");
  await page.locator('[name="acepta"]').check();
  await enviar.click();
  await expect(page.locator('[name="correo"]')).toHaveAttribute("aria-invalid", "true");
  await page.locator('[name="correo"]').fill("qa@example.com");
  await enviar.click();
  await expect(page.getByText(formTextos.contacto.exitoTitulo)).toBeVisible();
});

test.describe("Libro de Reclamaciones", () => {
  test("valida todos los campos obligatorios y simula el envío", async ({ page }) => {
    await page.goto("/libro-de-reclamaciones");
    const enviar = page.getByRole("button", { name: "Enviar reclamo" });
    await enviar.click();
    await expect.poll(() => page.locator('[aria-invalid="true"]').count()).toBeGreaterThanOrEqual(15);
    await expect(page.locator('[name="nombres"]')).toBeFocused();

    const datos: Record<string, string> = {
      nombres: "Prueba", paterno: "Uno", materno: "Dos", nro_doc: "12345678", cel: "912345678",
      prov: "Lima", dist: "Miraflores", direccion: "Av. Prueba 123", correo: "qa@example.com",
      nro_pedido: "001", descripcion: "Servicio de prueba",
      detalle_reclamo: "Detalle de prueba del reclamo, con más de veinte caracteres.",
      pedido_cliente: "Pedido de prueba",
    };
    for (const [n, v] of Object.entries(datos)) await page.locator(`[name="${n}"]`).fill(v);
    for (const sel of await page.locator("select").all()) {
      if (!(await sel.inputValue())) await sel.selectOption({ index: 1 });
    }
    await page.locator('[name="declaro"]').check();
    await page.locator('[name="acepto"]').check();
    await enviar.click();
    await expect(page.getByText("Envío simulado correctamente")).toBeVisible();
    await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  });

  test.describe("sin JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("el servidor valida y devuelve los errores", async ({ page }) => {
      await page.goto("/libro-de-reclamaciones");
      await page.getByRole("button", { name: "Enviar reclamo" }).click();
      await page.waitForLoadState("load");
      await expect.poll(() => page.locator('[aria-invalid="true"]').count()).toBeGreaterThanOrEqual(15);
    });
  });
});
