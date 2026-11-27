/**
 * Faixa do fim: as leituras numéricas variam a cada segundo, como no painel do app.
 * Cada leitura aparece nas duas cópias da faixa; as duas recebem o mesmo valor, para a faixa
 * ter sempre a mesma largura e a volta ao início ser contínua.
 */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const ticker = required(document, "[data-ticker]");
const copies = new Map<string, HTMLElement[]>();
for (const el of ticker.querySelectorAll<HTMLElement>("[data-live]")) {
  const key = el.dataset["live"] ?? "";
  copies.set(key, [...(copies.get(key) ?? []), el]);
}

loopWhileVisible(
  ticker,
  () => {
    for (const [first, ...rest] of copies.values()) {
      if (!first) continue;
      const { min, max, digits } = first.dataset;
      const text = decimal(random(Number(min), Number(max)), Number(digits));
      for (const el of [first, ...rest]) el.textContent = text;
    }
  },
  1200,
);
