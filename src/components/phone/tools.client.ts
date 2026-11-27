/**
 * Ferramentas, no celular. O teste de carga roda o cooler bom, espera no resultado e roda o
 * cooler fraco, parando no limite; tocar num dos botões roda só aquele PC. A fila de apps
 * escreve qual app está instalando, no mesmo ritmo dos ícones.
 * Os drivers não precisam de script: tocam sozinhos pelo play.client.
 */
import { onEachEntry, prefersReducedMotion, required, wait } from "@/scripts/motion";
import { arm, play } from "./play.client";
import { APP_START_MS, APP_STEP_MS, STRESS_HOLD_MS } from "./tools-timing";

function setupStress(card: HTMLElement): void {
  const buttons = [...card.querySelectorAll<HTMLButtonElement>("[data-pick]")];
  let auto = false;
  let round = 0;

  const show = (index: number) => {
    card.dataset["scenario"] = String(index);
    for (const b of buttons)
      b.setAttribute("aria-pressed", String(b.dataset["pick"] === String(index)));
  };

  const run = async (index: number) => {
    const mine = ++round;
    show(index);
    if (prefersReducedMotion()) return;
    await play(card);
    if (!auto || mine !== round || index >= buttons.length - 1) return;
    await wait(STRESS_HOLD_MS);
    if (auto && mine === round) void run(index + 1);
  };

  for (const b of buttons) {
    b.addEventListener("click", () => {
      auto = false;
      void run(Number(b.dataset["pick"]));
    });
  }

  if (prefersReducedMotion()) return;
  arm(card);
  onEachEntry(
    card,
    () => {
      auto = true;
      void run(0);
    },
    0.5,
  );
}

function setupApps(card: HTMLElement): void {
  const status = required(card, "[data-status]");
  const names = [...card.querySelectorAll<HTMLElement>("[data-app]")].map(
    (li) => li.dataset["app"] ?? "",
  );
  let round = 0;

  const run = async () => {
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
  };

  if (prefersReducedMotion()) return;
  arm(card);
  status.textContent = "Preparando a fila";
  onEachEntry(card, () => void run(), 0.5);
}

const stress = document.querySelector<HTMLElement>("[data-m-stress]");
if (stress) setupStress(stress);
const apps = document.querySelector<HTMLElement>("[data-m-apps]");
if (apps) setupApps(apps);
