/**
 * Teste de carga, no celular: quando o cartão aparece, roda o PC com cooler bom, espera no
 * resultado e roda o com cooler fraco, que para no limite e fica na tela. Toca de novo quando
 * a pessoa volta para a seção. Não há botão: a legenda só diz qual PC está passando.
 */
import { onEachEntry, prefersReducedMotion, required, wait } from "@/scripts/motion";
import { arm, play } from "./play.client";
import { STRESS_HOLD_MS } from "./tools-timing";

const card = required(document, "[data-m-stress]");
const scenes = card.querySelectorAll("[data-scene-label]").length;
let round = 0;

async function run(): Promise<void> {
  const mine = ++round;
  for (let i = 0; i < scenes; i++) {
    card.dataset["scenario"] = String(i);
    await play(card);
    if (mine !== round) return;
    if (i < scenes - 1) await wait(STRESS_HOLD_MS);
    if (mine !== round) return;
  }
}

if (!prefersReducedMotion()) {
  card.dataset["scenario"] = "0";
  arm(card);
  onEachEntry(card, () => void run(), 0.5);
}
