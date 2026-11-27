/**
 * Perguntas frequentes: abre e fecha com animação de altura, uma de cada vez.
 * A que fecha e a que abre andam juntas, com a mesma duração e a mesma curva, então a
 * lista troca de resposta num movimento só. A caixa da lista reserva a altura da maior
 * resposta aberta, para a tela não se recentralizar a cada clique.
 * Sem JavaScript, o <details> nativo continua funcionando.
 */
import { prefersReducedMotion } from "@/scripts/motion";

const MS = 360;
const EASING = "cubic-bezier(.45,0,.2,1)";

function setup(box: HTMLElement): void {
  const items = [...box.querySelectorAll<HTMLDetailsElement>("details")];
  const running = new WeakMap<HTMLDetailsElement, Animation>();
  const answerOf = (item: HTMLDetailsElement) => item.querySelector<HTMLElement>("[data-answer]");

  /** Mede a lista com cada resposta aberta e guarda a maior altura como mínimo da caixa. */
  const reserve = () => {
    const opened = items.map((item) => item.open);
    box.style.minHeight = "";
    let tallest = 0;
    for (const item of items) {
      items.forEach((other) => (other.open = other === item));
      tallest = Math.max(tallest, box.offsetHeight);
    }
    items.forEach((item, i) => (item.open = opened[i] ?? false));
    box.style.minHeight = `${tallest}px`;
  };

  const animate = (item: HTMLDetailsElement, opening: boolean) => {
    const answer = answerOf(item);
    if (!answer) return;
    // começa de onde a animação anterior parou; fechado, o navegador ainda mede a resposta
    // escondida, então o ponto de partida é zero
    const from = item.open ? answer.getBoundingClientRect().height : 0;
    running.get(item)?.cancel();
    if (opening) item.open = true;
    const to = opening ? answer.scrollHeight : 0;
    const animation = answer.animate(
      [
        { height: `${from}px`, opacity: opening ? 0 : 1 },
        { height: `${to}px`, opacity: opening ? 1 : 0 },
      ],
      { duration: prefersReducedMotion() ? 0 : MS, easing: EASING },
    );
    running.set(item, animation);
    animation.onfinish = () => {
      running.delete(item);
      if (!opening) item.open = false;
    };
  };

  for (const item of items) {
    item.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      // um <details> fechando ainda está "open"; o que vale é para onde ele vai (data-target)
      const willOpen = item.dataset["target"] !== "open";
      item.dataset["target"] = willOpen ? "open" : "";
      for (const other of items) {
        if (other !== item && other.dataset["target"] === "open") {
          other.dataset["target"] = "";
          animate(other, false);
        }
      }
      animate(item, willOpen);
    });
    item.dataset["target"] = item.open ? "open" : "";
  }

  reserve();
  let resizeTimer: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(reserve, 150);
  });
}

document.querySelectorAll<HTMLElement>("[data-faq-box]").forEach(setup);
