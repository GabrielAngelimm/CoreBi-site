/**
 * Instalar apps: os dez apps instalam em cascata, cada um enchendo o próprio anel, e tudo
 * termina em uns dois segundos. Roda uma vez quando a seção aparece e de novo só quando a
 * pessoa sai e volta; parado, mostra tudo instalado.
 */
import { prefersReducedMotion, required, wait } from "@/scripts/motion";

const FILL_MS = 480;
const STAGGER_MS = 150;

const demo = required(document, "[data-apps]");
const items = [...demo.querySelectorAll<HTMLLIElement>("li")];
const counter = required(demo, "[data-count]");

demo.style.setProperty("--fill-ms", `${FILL_MS}ms`);

let running = false;
let armed = true;

async function play(): Promise<void> {
  running = true;
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

  await wait((items.length - 1) * STAGGER_MS + FILL_MS);
  running = false;
}

if (!prefersReducedMotion()) {
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // volta a armar só quando a seção sai quase toda da tela
        if (!entry.isIntersecting) armed = true;
        else if (entry.intersectionRatio >= 0.4 && armed && !running) {
          armed = false;
          void play();
        }
      }
    },
    { threshold: [0, 0.4] },
  ).observe(demo);
}
