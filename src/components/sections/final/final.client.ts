/** Faixa do fim: as leituras numéricas variam a cada segundo, como no painel do app. */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const ticker = required(document, "[data-ticker]");
const live = [...ticker.querySelectorAll<HTMLElement>("[data-min]")];

loopWhileVisible(
  ticker,
  () => {
    for (const el of live) {
      const min = Number(el.dataset["min"]);
      const max = Number(el.dataset["max"]);
      el.textContent = decimal(random(min, max), Number(el.dataset["digits"]));
    }
  },
  1200,
);
