/**
 * Rede: quando o cartão aparece, as barras sobem do chão uma depois da outra, variam por
 * alguns segundos e param; as velocidades contam até o valor. Repete ao voltar para a seção.
 */
import {
  burst,
  onEachEntry,
  prefersReducedMotion,
  random,
  required,
  tween,
} from "@/scripts/motion";

const root = required(document, "[data-network]");
const tile = root.closest("article") ?? root;
const bars = [...root.children] as HTMLElement[];
const stats = [...tile.querySelectorAll<HTMLElement>("[data-stat]")].map((el) => ({
  el,
  target: Number(el.textContent),
}));
const LIVE_TICKS = 4;

function vary(): void {
  for (const bar of bars) {
    bar.style.height = `${bar.classList.contains("up") ? random(20, 65) : random(30, 100)}%`;
  }
}

function floor(): void {
  for (const bar of bars) bar.style.height = "0%";
}

const live = burst();
// com JavaScript o cartão espera zerado até aparecer, para a contagem não piscar do valor final
if (!prefersReducedMotion()) {
  floor();
  for (const { el } of stats) el.textContent = "0";
}
onEachEntry(
  tile,
  () => {
    floor();
    void root.getBoundingClientRect();
    bars.forEach((bar, i) => (bar.style.transitionDelay = `${i * 18}ms`));
    vary();
    window.setTimeout(() => {
      for (const bar of bars) bar.style.transitionDelay = "";
      live(vary, 1100, LIVE_TICKS);
    }, 1100);
    for (const { el, target } of stats) {
      void tween(1400, (k) => (el.textContent = String(Math.round(target * k))));
    }
  },
  0.5,
);
