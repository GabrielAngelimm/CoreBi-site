/** Sensores: a temperatura do último minuto anda um ponto por segundo, como no app. */
import { decimal, integer } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

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
const x = (i: number) => (i * 600) / (POINTS - 1);
const y = (v: number) => 170 - ((v - 46) / (72 - 46)) * 160;
const clamp = (v: number) => Math.max(LOW, Math.min(HIGH, v));

const history: number[] = [];
for (let i = 0, t = 61; i < POINTS; i++) history.push((t = clamp(t + random(-1.1, 1.1))));

function draw(): void {
  const d = history.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
  line.setAttribute("d", d);
  area.setAttribute("d", `${d}L600 170L0 170Z`);
  const now = history[POINTS - 1] ?? 61;
  tip.setAttribute("cy", y(now).toFixed(1));
  temp.textContent = decimal(now);
}

function tick(): void {
  history.shift();
  history.push(clamp((history[POINTS - 2] ?? 61) + random(-1.2, 1.2)));
  draw();
  clock.textContent = integer(4600 + Math.round(random(0, 8)) * 10);
}

draw();
loopWhileVisible(root, tick, 1000);
