/** Abertura: as leituras das peças variam como no app. */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const dial = required(document, "[data-dial]");
const readouts = [...dial.querySelectorAll<HTMLElement>("[data-live]")];

function tick(): void {
  for (const el of readouts) {
    const { min, max, digits } = el.dataset;
    el.textContent = decimal(random(Number(min), Number(max)), Number(digits));
  }
}

loopWhileVisible(dial, tick, 1400);
