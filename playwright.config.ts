import { defineConfig, devices } from "@playwright/test";

const port = 4321;
const isCI = Boolean(process.env["CI"]);
/** Para usar um Chromium já instalado na máquina em vez do baixado pelo Playwright. */
const chromiumPath = process.env["PLAYWRIGHT_CHROMIUM_PATH"];

/**
 * Testes de ponta a ponta contra o build de produção (`astro preview`).
 * Rode `npm run build` antes de `npm test`.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "off",
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1920, height: 1080 } } },
    { name: "notebook", use: { viewport: { width: 1366, height: 768 } } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${port}`,
    port,
    reuseExistingServer: !isCI,
  },
});
