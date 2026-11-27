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
const queueBox = required(demo, "[data-queue]");
const counter = required(queueBox, "[data-count]");
const status = required(queueBox, "[data-status]");
const segs = [...queueBox.querySelectorAll<HTMLElement>(".segs i")];

demo.style.setProperty("--fill-ms", `${FILL_MS}ms`);

let running = false;
let armed = true;

async function play(): Promise<void> {
  running = true;
  items.forEach((item) => (item.className = ""));
  segs.forEach((seg) => seg.classList.remove("on"));
  counter.textContent = "0";
  status.textContent = "Preparando a fila";
  queueBox.classList.add("busy");
  queueBox.style.setProperty("--p", "0");
  let installed = 0;
  // um quadro para o navegador aplicar o estado vazio antes de animar
  await wait(60);

  items.forEach((item, i) => {
    window.setTimeout(() => {
      item.className = "active";
      status.textContent = `Instalando ${item.querySelector("em")?.textContent ?? ""}`;
      window.setTimeout(() => {
        item.className = "done";
        segs[i]?.classList.add("on");
        counter.textContent = String(++installed);
        queueBox.style.setProperty("--p", String((installed / items.length) * 100));
      }, FILL_MS);
    }, i * STAGGER_MS);
  });

  await wait((items.length - 1) * STAGGER_MS + FILL_MS + 40);
  status.textContent = "Tudo instalado";
  queueBox.classList.remove("busy");
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
