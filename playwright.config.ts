import { defineConfig } from "@playwright/test";

/**
 * Suite E2E (Fase 6). Corre contra `next start` (build previo):
 *   npm run build && npm run test:e2e                       → preview (badge amarillo, noindex)
 *   SITE_ENV=production npm run build && npm run test:e2e   → producción (pendientes neutros)
 * Usa el Chrome del sistema (channel "chrome"); con `npx playwright install chromium` y
 * PW_CHANNEL="" usa el Chromium de Playwright.
 */
const PORT = Number(process.env.PORT ?? 3921);
const channel = process.env.PW_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "es-PE",
    timezoneId: "America/Lima",
    ...(channel ? { channel } : {}),
    trace: "retain-on-failure",
  },
  projects: [
    { name: "movil", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "escritorio", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/robots.txt`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
