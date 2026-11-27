import { expect, test, type Page } from "@playwright/test";

/** Seções da versão do computador, na ordem da página. */
const deskSections = [
  "sobre",
  "monitoramento",
  "jogos",
  "teste",
  "drivers",
  "apps",
  "instalar",
  "perguntas",
  "baixar",
];

/** Seções da versão do celular, na ordem da página. */
const phoneSections = [
  "m-sobre",
  "m-monitoramento",
  "m-jogos",
  "m-teste",
  "m-drivers",
  "m-instalar",
  "m-perguntas",
  "m-baixar",
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

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test.describe("página inicial", () => {
  test("carrega sem erros e com o título certo", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/CoreBi/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Monitore, teste");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("os botões de download apontam para o instalador da release", async ({ page }) => {
    await page.goto("/");
    const links = page.getByRole("link", { name: /^Baixar para Windows/ });
    await expect(links).toHaveCount(2);
    for (const href of await links.evaluateAll((els) => els.map((a) => a.getAttribute("href")))) {
      expect(href).toMatch(
        /^https:\/\/github\.com\/GabrielAngelimm\/CoreBi\/releases\/download\/v[\d.]+\/CoreBi-[\d.]+-win-x64-setup\.exe$/,
      );
    }
  });

  test("o botão Copiar copia o hash", async ({ page, context, browserName, isMobile }) => {
    test.skip(browserName !== "chromium", "permissão de área de transferência só no Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    // no celular o código fica guardado em "Conferir o arquivo"
    if (isMobile) await page.locator("#m-instalar summary").click();
    const button = page.getByRole("button", { name: /SHA256 esperado$/ });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(button).toHaveText("Copiado");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^[0-9a-f]{64}$/);
  });
});

test.describe("versão do computador", () => {
  test.skip(({ isMobile }) => isMobile, "no celular a página é outra");

  test("mostra só a versão do computador", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".desk-site")).toBeVisible();
    await expect(page.locator("[data-phone]")).toBeHidden();
  });

  test("não rola para o lado", async ({ page }) => {
    await page.goto("/");
    for (const id of deskSections) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await horizontalOverflow(page), `seção #${id}`).toBeLessThanOrEqual(0);
    }
  });

  test("todas as seções aparecem", async ({ page }) => {
    await page.goto("/");
    for (const id of deskSections) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
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

  test("com movimento reduzido, o conteúdo aparece sem esperar animação", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // sem rolar: com movimento reduzido nada fica escondido esperando a entrada
    await expect(page.locator("#monitoramento .grid > *").first()).toHaveCSS("opacity", "1");
  });

  test("a seta da abertura leva ao Sobre alinhado no topo da tela", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Ir para as seções" }).click();
    await expect
      .poll(() => page.locator("#sobre").evaluate((el) => Math.abs(el.getBoundingClientRect().top)))
      .toBeLessThan(1);
  });

  test("o cabeçalho ganha vidro depois da abertura e acende a seção atual", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("[data-header]");
    await expect(header).not.toHaveClass(/is-stuck/);
    await page.locator("#perguntas").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    await expect(header).toHaveClass(/is-stuck/);
    await expect(page.locator('[data-nav="perguntas"]')).toHaveClass(/active/);
  });

  test("os passos da instalação trocam ao clicar", async ({ page }) => {
    await page.goto("/");
    await page.locator("#instalar").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    const tab = page.getByRole("tab", { name: /Passe pelo aviso/ });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#panel-aviso")).toBeVisible();
    await expect(page.locator("#panel-conferir")).toBeHidden();
  });
});

test.describe("versão do celular", () => {
  test.skip(({ isMobile }) => !isMobile, "só no celular");

  test("mostra só a versão do celular", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-phone]")).toBeVisible();
    await expect(page.locator(".desk-site")).toBeHidden();
  });

  test("todas as seções aparecem e nenhuma rola para o lado", async ({ page }) => {
    await page.goto("/");
    for (const id of phoneSections) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      expect(await horizontalOverflow(page), `seção #${id}`).toBeLessThanOrEqual(0);
    }
  });

  test("o cabeçalho abre as seções e leva até a escolhida", async ({ page }) => {
    await page.goto("/");
    const sheet = page.getByRole("dialog", { name: "Seções" });
    await expect(sheet).toBeHidden();
    await page.getByRole("button", { name: "Abrir as seções" }).click();
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("link", { name: /^Baixar para Windows/ })).toHaveAttribute(
      "href",
      /-win-x64-setup\.exe$/,
    );
    await sheet.getByRole("link", { name: /^Instalar/ }).click();
    await expect(sheet).toBeHidden();
    await expect
      .poll(() => page.locator("#m-instalar").evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThan(40);
    await expect(page.locator("[data-m-where]")).toHaveText("Instalar");
  });

  test("um link da versão do computador cai na seção certa", async ({ page }) => {
    await page.goto("/#drivers");
    await expect
      .poll(() =>
        page.locator("#m-drivers").evaluate((el) => Math.abs(el.getBoundingClientRect().top)),
      )
      .toBeLessThan(40);
  });

  test("cada seção cabe numa tela, do iPhone SE ao Android grande", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [width, height] of [
      [412, 839],
      [390, 664],
      [360, 640],
      [375, 548],
      [320, 568],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      // a medida vale com as fontes do site, não com a de reserva
      await page.evaluate(() => document.fonts.ready);
      const tall = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>(".phone-site section")]
          .filter((s) => s.getBoundingClientRect().height > window.innerHeight + 1)
          .map((s) => s.id),
      );
      expect(tall, `${width}x${height}`).toEqual([]);
      expect(await horizontalOverflow(page), `${width}x${height}`).toBeLessThanOrEqual(0);
    }
  });

  test("as perguntas abrem uma de cada vez", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("#m-perguntas details");
    await items.first().scrollIntoViewIfNeeded();
    await expect(page.locator("#m-perguntas details[open]")).toHaveCount(0);
    await items.first().locator("summary").click();
    await expect(items.first()).toHaveAttribute("open", "");
    await items.nth(2).locator("summary").click();
    await expect(items.nth(2)).toHaveAttribute("open", "");
    await expect(page.locator("#m-perguntas details[open]")).toHaveCount(1);
  });

  test("Baixar para Windows avisa que o CoreBi é para o PC", async ({ page }) => {
    await page.goto("/");
    const notice = page.getByRole("dialog", { name: "O CoreBi é para o PC" });
    await expect(notice).toBeHidden();
    await page.locator("#m-abertura [data-m-download]").click();
    await expect(notice).toBeVisible();
    await expect(
      notice.getByRole("link", { name: /^Baixar o instalador mesmo assim/ }),
    ).toHaveAttribute("href", /-win-x64-setup\.exe$/);
    await notice.getByRole("button", { name: "Fechar" }).click();
    await expect(notice).toBeHidden();
  });

  test("Enviar o link para o PC copia o link quando não há compartilhar", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "permissão de área de transferência só no Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    // o compartilhar do sistema abriria uma janela fora da página; aqui testamos a cópia
    await page.addInitScript(() => Object.defineProperty(navigator, "share", { value: undefined }));
    await page.goto("/");
    await page.locator("#m-baixar [data-m-download]").click();
    // o nome do botão muda depois do toque, então o localizador não pode depender dele
    const button = page.locator("#m-windows [data-share]");
    await expect(button).toHaveText("Enviar o link para o PC");
    await button.click();
    await expect(button).toHaveText("Link copiado");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/^https:\/\//);
  });

  test("com movimento reduzido, nada espera animação", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator("#m-baixar").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-phone] .armed")).toHaveCount(0);
    // os números já vêm escritos com o valor final
    await expect(page.locator("#m-sobre [data-count]").first()).not.toHaveText("0");
  });
});

test("página 404", async ({ page }) => {
  const response = await page.goto("/nao-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Essa página não existe.");
});

test("capturas de tela para revisão", async ({ page, isMobile }, info) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await info.attach("abertura", { body: await page.screenshot(), contentType: "image/png" });
  for (const id of isMobile ? phoneSections : deskSections) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(800);
    await info.attach(id, { body: await page.screenshot(), contentType: "image/png" });
  }
});
