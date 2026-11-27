/**
 * Armazenamento: quando o cartão aparece, o medidor acende do zero até a vida útil e os
 * números contam junto; depois fica parado. Repete ao voltar para a seção.
 */
import { decimal } from "@/lib/format";
import { onEachEntry, prefersReducedMotion, required, tween } from "@/scripts/motion";

const gauge = required(document, "[data-storage]");
const tile = gauge.closest("article") ?? gauge;
const life = required(gauge, "[data-life]");
const written = required(tile, '[data-stat="written"]');
const temp = required(tile, '[data-stat="temp"]');
const targets = { life: Number(life.textContent), written: 18.4, temp: Number(temp.textContent) };

// com JavaScript o cartão espera zerado até aparecer, para a contagem não piscar do valor final
if (!prefersReducedMotion()) {
  tile.classList.add("armed");
  life.textContent = "0";
  written.textContent = decimal(0);
  temp.textContent = "0";
}
onEachEntry(
  tile,
  () => {
    tile.classList.remove("armed", "play");
    void tile.getBoundingClientRect();
    tile.classList.add("play");
    void tween(1600, (k) => {
      life.textContent = String(Math.round(targets.life * k));
      written.textContent = decimal(targets.written * k);
      temp.textContent = String(Math.round(targets.temp * k));
    });
  },
  0.5,
);
