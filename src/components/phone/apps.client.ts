/**
 * Pacote de apps, no celular: quando o cartão aparece, mostra os dez marcados e instala o pacote
 * de uma vez, um ícone atrás do outro no tempo de APP_STEP_MS, contando no topo e escrevendo o
 * app da vez. Toca de novo quando a pessoa sai e volta.
 * Com movimento reduzido não faz nada: o pacote já vem todo instalado no HTML.
 */
import { onEachEntry, prefersReducedMotion, required, wait } from "@/scripts/motion";
import { APP_START_MS, APP_STEP_MS } from "./tools-timing";

const card = required(document, "[data-m-apps]");
const done = required(card, "[data-apps-done]");
const now = required(card, "[data-apps-now]");
const rows = [...card.querySelectorAll<HTMLElement>("[data-app]")];
let round = 0;

function reset(): void {
  card.dataset["phase"] = "wait";
  for (const row of rows) row.dataset["state"] = "wait";
  done.textContent = "0";
}

async function run(): Promise<void> {
  const mine = ++round;
  reset();
  await wait(APP_START_MS);
  if (mine !== round) return;
  card.dataset["phase"] = "run";
  for (const [i, row] of rows.entries()) {
    now.textContent = row.dataset["name"] ?? "";
    row.dataset["state"] = "run";
    await wait(APP_STEP_MS);
    if (mine !== round) return;
    row.dataset["state"] = "done";
    done.textContent = String(i + 1);
  }
  card.dataset["phase"] = "done";
}

if (!prefersReducedMotion()) {
  reset();
  onEachEntry(card, () => void run(), 0.5);
}
