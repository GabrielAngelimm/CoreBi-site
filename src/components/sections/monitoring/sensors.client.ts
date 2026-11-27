/**
 * Sensores: quando o cartão aparece, a curva do último minuto se desenha da esquerda para a
 * direita, ponto a ponto, com a leitura acompanhando a ponta. Depois anda um ponto por segundo
 * durante alguns segundos, como no app, e descansa. Volta a tocar quando a pessoa sai e volta.
 */
import { decimal, integer } from "@/lib/format";
import {
  burst,
  onEachEntry,
  prefersReducedMotion,
  random,
  required,
  tween,
} from "@/scripts/motion";

const root = required(document, "[data-sensors]");
const tile = root.closest("article") ?? root;
const line = required<SVGPathElement>(root, "[data-line]");
const area = required<SVGPathElement>(root, "[data-area]");
const tip = required<SVGCircleElement>(root, "[data-tip]");
const temp = required(tile, '[data-stat="temp"]');
const clock = required(tile, '[data-stat="clock"]');

const POINTS = 60;
const LOW = 54;
const HIGH = 68;
const LIVE_TICKS = 6; // segundos andando antes de parar
const DRAW_MS = 1600; // tempo para a curva atravessar o gráfico
const x = (i: number) => (i * 600) / (POINTS - 1);
const y = (v: number) => 170 - ((v - 46) / (72 - 46)) * 160;
const clamp = (v: number) => Math.max(LOW, Math.min(HIGH, v));

const history: number[] = [];

function seed(): void {
  history.length = 0;
  for (let i = 0, t = 61; i < POINTS; i++) history.push((t = clamp(t + random(-1.1, 1.1))));
}

/** Desenha os primeiros `count` pontos; a ponta e a leitura ficam no último deles. */
function draw(count = POINTS): void {
  const shown = history.slice(0, Math.max(1, count));
  const d = shown.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  const end = x(shown.length - 1).toFixed(1);
  line.setAttribute("d", d);
  area.setAttribute("d", `${d}L${end} 170L0 170Z`);
  const now = shown.at(-1) ?? 61;
  tip.setAttribute("cx", end);
  tip.setAttribute("cy", y(now).toFixed(1));
  temp.textContent = decimal(now);
}

function tick(): void {
  history.shift();
  history.push(clamp((history[POINTS - 2] ?? 61) + random(-1.2, 1.2)));
  draw();
  clock.textContent = integer(4600 + Math.round(random(0, 8)) * 10);
}

seed();
draw();

// com JavaScript o gráfico espera vazio até aparecer, para a curva nascer na frente da pessoa
const live = burst();
if (!prefersReducedMotion()) {
  draw(1);
  clock.textContent = "0";
  tile.classList.add("armed");
}
onEachEntry(
  tile,
  () => {
    seed();
    tile.classList.remove("armed");
    const clockTarget = 4650;
    void tween(DRAW_MS, (k) => {
      draw(Math.round(1 + k * (POINTS - 1)));
      clock.textContent = integer(Math.round((clockTarget * k) / 10) * 10);
    }).then(() => live(tick, 1000, LIVE_TICKS));
  },
  0.5,
);
