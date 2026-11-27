/**
 * Fila de apps, no celular: quando o cartão aparece, põe todos "Na fila" e instala um por um,
 * no tempo de APP_STEP_MS, contando no topo. Toca de novo quando a pessoa sai e volta.
 * Com movimento reduzido não faz nada: a fila já vem toda instalada no HTML.
 */
import { onEachEntry, prefersReducedMotion, required, wait } from "@/scripts/motion";
import { APP_START_MS, APP_STEP_MS } from "./tools-timing";

const card = required(document, "[data-m-apps]");
const done = required(card, "[data-apps-done]");
const rows = [...card.querySelectorAll<HTMLElement>("[data-app]")];
let round = 0;

function reset(): void {
  for (const row of rows) row.dataset["state"] = "wait";
  done.textContent = "0";
}

async function run(): Promise<void> {
  const mine = ++round;
  reset();
  await wait(APP_START_MS);
  for (const [i, row] of rows.entries()) {
    if (mine !== round) return;
    row.dataset["state"] = "run";
    await wait(APP_STEP_MS);
    if (mine !== round) return;
    row.dataset["state"] = "done";
    done.textContent = String(i + 1);
  }
}

if (!prefersReducedMotion()) {
  reset();
  onEachEntry(card, () => void run(), 0.5);
}
