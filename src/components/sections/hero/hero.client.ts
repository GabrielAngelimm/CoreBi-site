/** Abertura: as leituras das peças variam como no app, e a moldura externa acompanha. */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const dial = required(document, "[data-dial]");
const readouts = [...dial.querySelectorAll<HTMLElement>("[data-live]")];

function tick(): void {
  for (const el of readouts) {
    const { min, max, digits, scale, live } = el.dataset;
    const value = random(Number(min), Number(max));
    el.textContent = decimal(value, Number(digits));
    const gauge = dial.querySelector(`[data-gauge="${live}"]`);
    gauge?.setAttribute("stroke-dasharray", `${((value / Number(scale)) * 100).toFixed(1)} 100`);
  }
}

loopWhileVisible(dial, tick, 1400);
