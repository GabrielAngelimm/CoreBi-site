/**
 * Fila de apps, no celular: escreve qual app está instalando, no mesmo ritmo dos ícones, e
 * "Tudo instalado" no fim. O driver não precisa de script: toca sozinho pelo play.client.
 */
import { onEachEntry, prefersReducedMotion, required, wait } from "@/scripts/motion";
import { arm, play } from "./play.client";
import { APP_START_MS, APP_STEP_MS } from "./tools-timing";

const card = required(document, "[data-m-apps]");
const status = required(card, "[data-status]");
const names = [...card.querySelectorAll<HTMLElement>("[data-app]")].map(
  (li) => li.dataset["app"] ?? "",
);
let round = 0;

async function run(): Promise<void> {
  const mine = ++round;
  void play(card);
  status.textContent = "Preparando a fila";
  await wait(APP_START_MS);
  for (const name of names) {
    if (mine !== round) return;
    status.textContent = `Instalando ${name}`;
    await wait(APP_STEP_MS);
  }
  if (mine === round) status.textContent = "Tudo instalado";
}

if (!prefersReducedMotion()) {
  arm(card);
  status.textContent = "Preparando a fila";
  onEachEntry(card, () => void run(), 0.5);
}
