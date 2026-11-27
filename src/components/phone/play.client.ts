/**
 * Animações da versão para celular. Cada demonstração marcada com [data-play] toca quando
 * aparece na tela e de novo quando volta depois de ter saído; o movimento é CSS, a partir da
 * classe "playing". Junto, os números com [data-count] sobem do zero e os [data-live] variam
 * por alguns segundos, como os sensores do app, e param.
 * Antes de tocar, a demonstração fica "armed" (no ponto de partida). Sem JavaScript ou com
 * movimento reduzido ela nunca é armada, então tudo aparece direto no estado final.
 * [data-play="manual"] não toca sozinha: quem decide é o script da própria demonstração.
 */
import { clock, decimal, integer } from "@/lib/format";
import { burst, onEachEntry, prefersReducedMotion, random, tween, wait } from "@/scripts/motion";

const LIVE_MS = 1100;
const LIVE_TIMES = 5;

const numberOf = (el: HTMLElement, key: string, fallback = 0) => {
  const value = Number(el.dataset[key]);
  return Number.isFinite(value) ? value : fallback;
};

/** Como cada número é escrito: casas decimais em `data-digits`, ou `data-format="clock"` (mm:ss). */
function write(el: HTMLElement, value: number): void {
  const digits = numberOf(el, "digits");
  el.textContent =
    el.dataset["format"] === "clock"
      ? clock(value)
      : digits
        ? decimal(value, digits)
        : integer(value);
}

/** Cada demonstração guarda a rodada atual; uma rodada nova faz a anterior parar de escrever. */
const rounds = new WeakMap<Element, number>();
const lives = new WeakMap<Element, ReturnType<typeof burst>>();

function counters(root: Element): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-count]")];
}

function countUp(root: Element, round: number): number {
  let longest = 0;
  for (const el of counters(root)) {
    const to = numberOf(el, "count");
    const ms = numberOf(el, "ms", 1400);
    const delay = numberOf(el, "delay");
    const linear = el.dataset["ease"] === "linear";
    longest = Math.max(longest, delay + ms);
    write(el, 0);
    void wait(delay).then(() =>
      tween(
        ms,
        (k) => {
          if (rounds.get(root) === round) write(el, to * k);
        },
        linear ? (t) => t : undefined,
      ),
    );
  }
  return longest;
}

function live(root: Element): void {
  const items = [...root.querySelectorAll<HTMLElement>("[data-live]")];
  if (!items.length) return;
  let run = lives.get(root);
  if (!run) {
    run = burst();
    lives.set(root, run);
  }
  run(
    () => {
      for (const el of items) {
        const value = random(numberOf(el, "min"), numberOf(el, "max"));
        write(el, value);
        // o OverlayBi mostra o tempo de cada quadro junto com o FPS
        const frame = el.dataset["live"] === "fps" && root.querySelector("[data-frametime]");
        if (frame) frame.textContent = `${decimal(1000 / value, 1)} ms`;
      }
    },
    LIVE_MS,
    LIVE_TIMES,
  );
}

/** Põe a demonstração no ponto de partida, com os números zerados. */
export function arm(root: HTMLElement): void {
  root.classList.remove("playing");
  root.classList.add("armed");
  for (const el of counters(root)) write(el, 0);
}

/** Toca a demonstração do começo. Devolve quando os números terminam de subir. */
export async function play(root: HTMLElement): Promise<void> {
  const round = (rounds.get(root) ?? 0) + 1;
  rounds.set(root, round);
  root.classList.remove("armed", "playing");
  void root.offsetWidth; // recomeça as animações CSS
  root.classList.add("playing");
  await wait(countUp(root, round));
  if (rounds.get(root) === round) live(root);
}

if (!prefersReducedMotion()) {
  document.querySelectorAll<HTMLElement>("[data-play]").forEach((root) => {
    if (root.dataset["play"] === "manual") return;
    arm(root);
    onEachEntry(root, () => void play(root), numberOf(root, "threshold", 0.4));
  });
}
