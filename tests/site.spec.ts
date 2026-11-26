import { expect, test, type Page } from "@playwright/test";

const sections = [
  "sobre",
  "recursos",
  "teste",
  "drivers",
  "apps",
  "instalar",
  "perguntas",
  "baixar",
];

/** Junta os erros do console e da página para checar no fim de cada teste. */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("página inicial", () => {
  test("carrega sem erros e com o título certo", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/CoreBi/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Monitore, teste");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("não rola para o lado", async ({ page }) => {
    await page.goto("/");
    for (const id of sections) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `seção #${id}`).toBeLessThanOrEqual(0);
    }
  });

  test("todas as seções aparecem", async ({ page }) => {
    await page.goto("/");
    for (const id of sections) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
  });

  test("o botão de download aponta para o instalador da release", async ({ page }) => {
    await page.goto("/");
    const href = await page.getByRole("link", { name: "Baixar para Windows" }).getAttribute("href");
    expect(href).toMatch(
      /^https:\/\/github\.com\/GabrielAngelimm\/CoreBi\/releases\/download\/v[\d.]+\/CoreBi-[\d.]+-win-x64-setup\.exe$/,
    );
  });

  test("as perguntas abrem uma de cada vez", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("#perguntas details");
    await items.first().scrollIntoViewIfNeeded();
    await expect(items.first()).toHaveAttribute("open", "");
    await items.nth(2).locator("summary").click();
    await expect(items.nth(2)).toHaveAttribute("open", "");
    await expect(items.first()).not.toHaveAttribute("open");
    await expect(page.locator("#perguntas details[open]")).toHaveCount(1);
  });

  test("o botão Copiar copia o hash", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "permissão de área de transferência só no Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const button = page.getByRole("button", { name: "Copiar o SHA256 esperado" });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(button).toHaveText("Copiado");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^[0-9a-f]{64}$/);
  });

  test("com movimento reduzido, o conteúdo aparece sem esperar animação", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // sem rolar: com movimento reduzido nada fica escondido esperando a entrada
    await expect(page.locator("#recursos .bento > *").first()).toHaveCSS("opacity", "1");
  });
});

test("página 404", async ({ page }) => {
  const response = await page.goto("/nao-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Essa página não existe.");
});

test("capturas de tela para revisão", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await info.attach("abertura", { body: await page.screenshot(), contentType: "image/png" });
  for (const id of sections) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(800);
    await info.attach(id, { body: await page.screenshot(), contentType: "image/png" });
  }
});
