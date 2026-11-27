/**
 * Teste de carga: o gráfico se desenha da esquerda para a direita, um passo a cada 50 ms.
 * Quando acaba (ou bate no limite), espera um pouco e passa para o outro PC.
 */
import { scenarios, stress } from "@/data/stress";
import { clock, decimal } from "@/lib/format";
import { loopWhileVisible, prefersReducedMotion, random, required } from "@/scripts/motion";

const card = required(document, "[data-stress]");
const cpuLine = required<SVGPathElement>(card, "[data-cpu-line]");
const gpuLine = required<SVGPathElement>(card, "[data-gpu-line]");
const area = required<SVGPathElement>(card, "[data-area]");
const cpuTip = required(card, "[data-cpu-tip]");
const gpuTip = required(card, "[data-gpu-tip]");
const cpuText = required(card, "[data-cpu]");
const gpuText = required(card, "[data-gpu]");
const time = required(card, "[data-clock]");
const message = required(card, "[data-message]");
const buttons = [...card.querySelectorAll<HTMLButtonElement>("[data-scenario]")];

const { min, max, cut, steps, start } = stress;
const W = 600;
const H = 220;
const HOLD = 60; // passos parado no resultado antes de trocar de PC (3 s)

const x = (step: number) => (step / steps) * W;
const y = (t: number) => H - ((t - min) / (max - min)) * H;
const path = (values: number[]) =>
  values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");

let current = 0;
let step = 0;
let hold = 0;
let cpu: number[] = [];
let gpu: number[] = [];

function say(kind: "" | "ok" | "stop", text: string): void {
  message.className = `message ${kind}`.trim();
  required(message, "span").textContent = text;
  card.dataset["state"] = kind;
}

function pick(index: number): void {
  current = index;
  step = 0;
  hold = 0;
  cpu = [];
  gpu = [];
  for (const b of buttons)
    b.setAttribute("aria-pressed", String(b.dataset["scenario"] === String(index)));
  say("", "Rodando: CPU, GPU e RAM em 100 %");
}

function draw(): void {
  const c = path(cpu);
  cpuLine.setAttribute("d", c);
  gpuLine.setAttribute("d", path(gpu));
  area.setAttribute("d", cpu.length ? `${c}L${x(cpu.length - 1)} ${H}L0 ${H}Z` : "");
  const last = cpu.length - 1;
  const lastCpu = cpu[last] ?? start;
  const lastGpu = gpu[last] ?? start;
  for (const [tip, value] of [
    [cpuTip, lastCpu],
    [gpuTip, lastGpu],
  ] as const) {
    tip.style.left = `${(x(Math.max(0, last)) / W) * 100}%`;
    tip.style.top = `${(y(value) / H) * 100}%`;
  }
  cpuText.textContent = decimal(lastCpu);
  gpuText.textContent = decimal(lastGpu);
  time.textContent = clock(Math.max(0, last) * 5);
}

function tick(): void {
  if (hold > 0) {
    if (--hold === 0) pick((current + 1) % scenarios.length);
    return;
  }
  const s = scenarios[current] ?? scenarios[0];
  const curve = (top: number, k: number) =>
    top - (top - start) * Math.exp(-k * step) + random(-0.25, 0.25);
  const nextCpu = Math.min(curve(s.cpu, s.k), cut);
  cpu.push(nextCpu);
  gpu.push(curve(s.gpu, s.k * 0.8));
  draw();

  if (nextCpu >= cut) {
    say(
      "stop",
      `Parado aos ${clock(step * 5)}: o processador chegou a ${cut} °C. Confira o cooler.`,
    );
    hold = HOLD;
    return;
  }
  if (++step > steps) {
    say(
      "ok",
      `Aprovado: estável por 10 min, sem erros. Máxima de ${decimal(Math.max(...cpu))} °C.`,
    );
    hold = HOLD;
  }
}

// com movimento reduzido o clique mostra o resultado do teste inteiro de uma vez
for (const b of buttons) {
  b.addEventListener("click", () => {
    pick(Number(b.dataset["scenario"]));
    if (prefersReducedMotion()) while (hold === 0) tick();
  });
}

// sem movimento reduzido, a demonstração começa do zero quando o cartão aparece
let started = false;
loopWhileVisible(
  card,
  () => {
    if (!started) {
      started = true;
      pick(0);
    }
    tick();
  },
  50,
);
