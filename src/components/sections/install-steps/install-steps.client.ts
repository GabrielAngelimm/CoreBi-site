/**
 * Instalar: os três passos e o fim, como pontos numa linha. Cada passo fica alguns segundos
 * na tela e passa para o próximo; os anteriores ficam marcados como feitos. Ao clicar num
 * passo, a troca automática para e a pessoa assume.
 * As animações de cada tela são CSS e recomeçam quando a tela volta (classe "playing").
 */
import { prefersReducedMotion, required, whenVisible } from "@/scripts/motion";

const root = required(document, "[data-install]");
const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-tab]")];
const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
const stepMs = Number.parseInt(getComputedStyle(root).getPropertyValue("--step-ms"), 10) || 6000;

let current = 0;
let timer: number | undefined;

function show(index: number): void {
  current = index;
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.classList.toggle("done", i < index);
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel, i) => {
    panel.hidden = i !== index;
    panel.classList.remove("playing");
  });
  const panel = panels[index];
  if (!panel) return;
  void panel.offsetWidth; // reinicia as animações CSS da tela
  panel.classList.add("playing");
}

async function advance(): Promise<void> {
  await whenVisible(root);
  if (!root.classList.contains("auto")) return;
  // a barra do passo ativo recomeça junto com o passo
  root.classList.remove("auto");
  void root.offsetWidth;
  root.classList.add("auto");
  timer = window.setTimeout(() => {
    show((current + 1) % tabs.length);
    void advance();
  }, stepMs);
}

function stopAuto(): void {
  root.classList.remove("auto");
  window.clearTimeout(timer);
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    stopAuto();
    show(i);
  });
  // setas trocam de passo, como em qualquer grupo de abas
  tab.addEventListener("keydown", (event) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    stopAuto();
    const next = (i + step + tabs.length) % tabs.length;
    show(next);
    tabs[next]?.focus();
  });
});

show(0);
if (!prefersReducedMotion()) {
  root.classList.add("auto");
  void advance();
}
