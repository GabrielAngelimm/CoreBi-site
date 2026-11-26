/** Instalar apps: a fila instala um app de cada vez e recomeça depois de uma pausa. */
import { onceVisible, prefersReducedMotion, random, required, wait } from "@/scripts/motion";

const demo = required(document, "[data-apps]");
const items = [...demo.querySelectorAll<HTMLLIElement>("li")];
const counter = required(demo, "[data-count]");

const setProgress = (item: HTMLLIElement, p: number) => item.style.setProperty("--p", p.toFixed(0));

async function install(): Promise<void> {
  for (const item of items) {
    item.className = "";
    setProgress(item, 0);
  }
  counter.textContent = "0";

  for (const [i, item] of items.entries()) {
    item.className = "active";
    for (let p = 0; p < 100;) {
      p = Math.min(100, p + random(10, 24));
      setProgress(item, p);
      await wait(150);
    }
    item.className = "done";
    counter.textContent = String(i + 1);
  }

  await wait(3000);
  void install();
}

if (!prefersReducedMotion()) onceVisible(demo, () => void install(), 0.4);
