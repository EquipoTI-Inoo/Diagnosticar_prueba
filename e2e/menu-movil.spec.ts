import { test, expect } from "./utils";

test.describe("menú móvil", () => {
  test.skip(({ isMobile }) => !isMobile, "solo en móvil");

  test("abre como diálogo, atrapa el foco, cierra con Escape y navega", async ({ page }) => {
    await page.goto("/");
    const abrir = page.getByRole("button", { name: "Abrir menú" });
    await expect(abrir).toHaveAttribute("aria-expanded", "false");
    await abrir.click();
    const menu = page.getByRole("dialog", { name: "Menú" });
    await expect(menu).toBeVisible();
    await expect(abrir).toHaveAttribute("aria-expanded", "true");
    // Foco dentro del diálogo, también tras varios Tab.
    for (let i = 0; i < 40; i++) await page.keyboard.press("Tab");
    expect(await menu.evaluate((m) => m.contains(document.activeElement))).toBe(true);
    // Escape cierra y devuelve el foco al botón.
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(abrir).toBeFocused();
    // Navegación: servicio y página del menú.
    await abrir.click();
    await menu.getByRole("link", { name: /^DiagnostiCAR\b/ }).first().click();
    await expect(page).toHaveURL(/\/servicios\/diagnosticar$/);
    await expect(page.getByRole("dialog", { name: "Menú" })).toBeHidden();
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.getByRole("dialog", { name: "Menú" }).getByRole("link", { name: "Guía" }).click();
    await expect(page).toHaveURL(/\/guia$/);
  });

  test("CTA de WhatsApp del menú y barra inferior visibles", async ({ page }) => {
    await page.goto("/servicios");
    // Barra inferior fija: WhatsApp + Ver precios.
    await expect(page.locator('a[href^="https://wa.me/"]:visible').filter({ hasText: /^WhatsApp$/ })).toHaveCount(1);
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await expect(
      page.getByRole("dialog", { name: "Menú" }).getByRole("link", { name: "Agendar diagnóstico" }),
    ).toBeVisible();
  });
});

test.describe("mega-menú de escritorio", () => {
  test.skip(({ isMobile }) => !!isMobile, "solo en escritorio");
  test("se abre con el botón Servicios y cierra con Escape", async ({ page }) => {
    await page.goto("/");
    const boton = page.getByRole("navigation", { name: "Principal" }).getByRole("button", { name: /Servicios/ });
    await boton.click();
    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: /DiagnostiCAR Plus/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(boton).toHaveAttribute("aria-expanded", "false");
  });
});
