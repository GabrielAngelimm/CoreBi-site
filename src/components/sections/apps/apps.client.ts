/**
 * Instalar apps: os dez apps instalam em cascata, cada um enchendo o próprio anel,
 * e tudo termina em uns dois segundos. Depois de uma pausa, a fila recomeça.
 */
import { onceVisible, prefersReducedMotion, required, wait, whenVisible } from "@/scripts/motion";

const FILL_MS = 480;
const STAGGER_MS = 150;
const HOLD_MS = 2800;

const demo = required(document, "[data-apps]");
const items = [...demo.querySelectorAll<HTMLLIElement>("li")];
const counter = required(demo, "[data-count]");

demo.style.setProperty("--fill-ms", `${FILL_MS}ms`);

async function cycle(): Promise<void> {
  await whenVisible(demo);
  items.forEach((item) => (item.className = ""));
  counter.textContent = "0";
  let installed = 0;
  // um quadro para o navegador aplicar o estado vazio antes de animar
  await wait(60);

  items.forEach((item, i) => {
    window.setTimeout(() => {
      item.className = "active";
      window.setTimeout(() => {
        item.className = "done";
        counter.textContent = String(++installed);
      }, FILL_MS);
    }, i * STAGGER_MS);
  });

  await wait((items.length - 1) * STAGGER_MS + FILL_MS + HOLD_MS);
  void cycle();
}

if (!prefersReducedMotion()) onceVisible(demo, () => void cycle(), 0.4);
