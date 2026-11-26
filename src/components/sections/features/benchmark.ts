/** Benchmark: roda sozinho ao aparecer; o anel do "depois" enche e o ganho sobe junto. */
import { decimal, integer } from "@/lib/format";
import { onceVisible, prefersReducedMotion, required, tween } from "@/scripts/motion";

const gauge = required(document, "[data-bench]");
const tile = gauge.closest("article") ?? gauge;
const arc = required<SVGPathElement>(gauge, "[data-arc]");
const gain = required(gauge, "[data-gain]");
const state = required(gauge, "[data-state]");
const score = required(tile, "[data-score]");
const run = required<HTMLButtonElement>(tile, "[data-run]");

const before = Number(gauge.dataset["before"]);
const after = Number(gauge.dataset["after"]);
const top = Number(gauge.dataset["top"]);

async function bench(): Promise<void> {
  run.disabled = true;
  state.textContent = "medindo…";
  await tween(3000, (k) => {
    const value = after * k;
    score.textContent = integer(value);
    arc.setAttribute("stroke-dasharray", `${((value / top) * 100).toFixed(2)} 100`);
    gain.textContent = `+${decimal(Math.max(0, (value / before - 1) * 100))}`;
  });
  state.textContent = "mais rápido";
  run.disabled = false;
}

run.addEventListener("click", () => void bench());
if (!prefersReducedMotion()) onceVisible(tile, () => void bench(), 0.6);
