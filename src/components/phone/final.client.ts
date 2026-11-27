/**
 * Faixa do fim, no celular: as leituras variam a cada segundo enquanto a faixa está na tela,
 * como na versão do computador. Cada leitura aparece nas duas cópias da faixa, e as duas
 * recebem o mesmo valor, para a volta ao início ser contínua.
 */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const ticker = required(document, "[data-m-ticker]");
const copies = new Map<string, HTMLElement[]>();
for (const el of ticker.querySelectorAll<HTMLElement>("[data-tick]")) {
  const key = el.dataset["tick"] ?? "";
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
