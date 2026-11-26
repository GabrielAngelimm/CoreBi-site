/** Rede: as barras de latência variam e as velocidades contam até o valor ao aparecer. */
import { loopWhileVisible, onceVisible, random, required, tween } from "@/scripts/motion";

const bars = required(document, "[data-network]");
const tile = bars.closest("article") ?? bars;

loopWhileVisible(
  bars,
  () => {
    for (const bar of bars.children as HTMLCollectionOf<HTMLElement>) {
      const up = bar.classList.contains("up");
      bar.style.height = `${up ? random(20, 65) : random(30, 100)}%`;
    }
  },
  1100,
);

for (const el of tile.querySelectorAll<HTMLElement>("[data-count]")) {
  const target = Number(el.dataset["count"]);
  onceVisible(
    el,
    () => void tween(1400, (k) => (el.textContent = String(Math.round(target * k)))),
    0.6,
  );
}
