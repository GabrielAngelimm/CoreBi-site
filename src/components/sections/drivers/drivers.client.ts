/** Drivers: os quatro passos se completam em sequência; no fim, a versão antiga é riscada. */
import { onceVisible, prefersReducedMotion, required, wait } from "@/scripts/motion";

const demo = required(document, "[data-drivers]");
const steps = [...demo.querySelectorAll<HTMLLIElement>("li")];
const button = required<HTMLButtonElement>(demo, "[data-run]");

async function update(): Promise<void> {
  button.disabled = true;
  button.textContent = "Atualizando…";
  demo.classList.remove("done");
  for (const s of steps) s.className = "";

  for (const s of steps) {
    s.className = "busy";
    await wait(prefersReducedMotion() ? 0 : Number(s.dataset["ms"]));
    s.className = "done";
  }

  demo.classList.add("done");
  button.textContent = "Atualizado";
  await wait(3500);
  button.disabled = false;
  button.textContent = "Atualizar driver";
}

button.addEventListener("click", () => void update());
if (!prefersReducedMotion()) onceVisible(demo, () => void update(), 0.5);
