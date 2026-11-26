/**
 * Teste de carga: a temperatura sobe até estabilizar. Com "cooler fraco", ela passa do corte
 * e o teste para sozinho. Um passo equivale a 5 s; o teste completo tem 120 passos (10 min).
 */
import { clock, decimal } from "@/lib/format";
import { onceVisible, prefersReducedMotion, random, required } from "@/scripts/motion";

const card = required(document, "[data-stress]");
const weakSwitch = required<HTMLButtonElement>(card, "[data-weak]");
const run = required<HTMLButtonElement>(card, "[data-run]");
const valueArc = required<SVGPathElement>(card, "[data-value-arc]");
const timeArc = required<SVGPathElement>(card, "[data-time-arc]");
const temp = required(card, "[data-temp]");
const time = required(card, "[data-clock]");
const message = required(card, "[data-message]");

const MIN = Number(card.dataset["min"]);
const MAX = Number(card.dataset["max"]);
const CUT = Number(card.dataset["cut"]);
const STEPS = 120;
const WARM = 78;

let timer: number | undefined;

/** Curva de aquecimento: sobe rápido e estabiliza (77 °C com cooler bom, passaria de 90 °C com fraco). */
const curve = (step: number, weak: boolean) => {
  const top = weak ? 92 : 77;
  return top - (top - 45) * Math.exp(-(weak ? 0.045 : 0.06) * step) + random(-0.6, 0.6);
};

function say(kind: "" | "ok" | "stop", text: string): void {
  message.className = `message ${kind}`.trim();
  required(message, "span").textContent = text;
}

function draw(value: number, step: number): void {
  const fill = Math.max(0, Math.min(1, (value - MIN) / (MAX - MIN))) * 100;
  valueArc.setAttribute("stroke-dasharray", `${fill.toFixed(2)} 100`);
  timeArc.setAttribute("stroke-dasharray", `${((step / STEPS) * 100).toFixed(2)} 100`);
  temp.textContent = decimal(value);
  time.textContent = clock(step * 5);
}

function start(): void {
  window.clearInterval(timer);
  const weak = weakSwitch.getAttribute("aria-checked") === "true";
  valueArc.classList.remove("warm", "hot");
  temp.classList.remove("hot");
  run.disabled = true;
  say("", "Rodando: processador em 100 %");

  let step = 0;
  let peak = 0;
  timer = window.setInterval(
    () => {
      const value = Math.min(curve(step, weak), weak ? CUT + 0.4 : 99);
      peak = Math.max(peak, value);
      draw(value, step);
      // as classes só são adicionadas, nunca tiradas no meio do teste: a cor não pisca
      if (value >= WARM) valueArc.classList.add("warm");
      if (weak && value >= CUT - 1) temp.classList.add("hot");

      if (weak && value >= CUT) {
        window.clearInterval(timer);
        valueArc.classList.add("hot");
        say("stop", `Parado aos ${clock(step * 5)}: chegou a ${CUT} °C. Confira o cooler.`);
        run.disabled = false;
        return;
      }
      if (++step > STEPS) {
        window.clearInterval(timer);
        say("ok", `Estável por 10 min, sem erros. Máxima de ${decimal(peak)} °C.`);
        run.disabled = false;
      }
    },
    prefersReducedMotion() ? 1 : 60,
  );
}

run.addEventListener("click", start);
weakSwitch.addEventListener("click", () => {
  const on = weakSwitch.getAttribute("aria-checked") !== "true";
  weakSwitch.setAttribute("aria-checked", String(on));
  start();
});
if (!prefersReducedMotion()) onceVisible(card, start, 0.5);
