/**
 * Abertura do celular: depois que o anel acende, cada medidor varia entre `data-min` e
 * `data-max` gomos por alguns segundos, como as leituras ao vivo do app, e para. Toca de novo
 * quando a pessoa volta para a abertura.
 */
import { burst, onEachEntry, required } from "@/scripts/motion";

const LIVE_MS = 1000;
const LIVE_TIMES = 6;

const dial = required(document, "[data-m-dial]");
const meters = [...dial.querySelectorAll<SVGGElement>("[data-meter]")].map((g) => ({
  segments: [...g.querySelectorAll<SVGPathElement>(".seg")],
  min: Number(g.dataset["min"]),
  max: Number(g.dataset["max"]),
}));
const run = burst();

onEachEntry(dial, () =>
  run(
    () => {
      for (const m of meters) {
        if (m.min === m.max) continue;
        const level = m.min + Math.floor(Math.random() * (m.max - m.min + 1));
        m.segments.forEach((s, i) => s.classList.toggle("on", i < level));
      }
    },
    LIVE_MS,
    LIVE_TIMES,
  ),
);
