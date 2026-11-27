/**
 * Drivers: os quatro passos correm em uns dois segundos. A linha que liga os passos
 * enche junto, o download conta os megabytes e, no fim, a versão antiga é riscada.
 */
import { onceVisible, prefersReducedMotion, required, tween, wait } from "@/scripts/motion";

const demo = required(document, "[data-drivers]");
const rail = required(demo, "[data-rail]");
const steps = [...demo.querySelectorAll<HTMLLIElement>("li")];
const button = required<HTMLButtonElement>(demo, "[data-run]");
const last = steps.length - 1;

function setRail(progress: number, ms: number): void {
  rail.style.setProperty("--step-ms", `${ms}ms`);
  rail.style.setProperty("--progress", String(progress));
}

async function runStep(step: HTMLLIElement, index: number): Promise<void> {
  const ms = prefersReducedMotion() ? 0 : Number(step.dataset["ms"]);
  const detail = required(step, "[data-detail]");
  const total = Number(step.dataset["count"] ?? 0);
  const label = detail.textContent;

  step.className = "busy";
  // a linha cresce até este passo enquanto ele roda
  if (index > 0) setRail(index / last, ms);
  if (total > 0) {
    await tween(ms, (t) => (detail.textContent = `${Math.round(t * total)} de ${label}`));
    detail.textContent = label;
  } else {
    await wait(ms);
  }
  step.className = "done";
}

async function update(): Promise<void> {
  button.disabled = true;
  button.textContent = "Atualizando…";
  demo.classList.remove("done");
  steps.forEach((s) => (s.className = ""));
  setRail(0, 0);
  await wait(120);

  for (const [i, step] of steps.entries()) await runStep(step, i);

  demo.classList.add("done");
  button.textContent = "Atualizado";
  await wait(1600);
  button.disabled = false;
  button.textContent = "Atualizar de novo";
}

button.addEventListener("click", () => void update());
if (!prefersReducedMotion()) onceVisible(demo, () => void update(), 0.5);
