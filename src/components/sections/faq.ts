/**
 * Perguntas frequentes: abre e fecha com animação de altura, uma de cada vez.
 * Sem JavaScript, o <details> nativo continua funcionando.
 */
import { prefersReducedMotion } from "@/scripts/motion";

const OPEN_MS = 380;
const CLOSE_MS = 280;

function setup(list: HTMLElement): void {
  const items = [...list.querySelectorAll<HTMLDetailsElement>("details")];
  const busy = new WeakSet<HTMLDetailsElement>();

  const close = (item: HTMLDetailsElement) => {
    const answer = item.querySelector<HTMLElement>("[data-answer]");
    if (!answer || busy.has(item)) return;
    busy.add(item);
    const animation = answer.animate(
      [
        { height: `${answer.scrollHeight}px`, opacity: 1 },
        { height: "0px", opacity: 0 },
      ],
      { duration: prefersReducedMotion() ? 0 : CLOSE_MS, easing: "cubic-bezier(.4,0,.2,1)" },
    );
    animation.onfinish = () => {
      item.open = false;
      busy.delete(item);
    };
  };

  const open = (item: HTMLDetailsElement) => {
    const answer = item.querySelector<HTMLElement>("[data-answer]");
    if (!answer || busy.has(item)) return;
    busy.add(item);
    item.open = true;
    const animation = answer.animate(
      [
        { height: "0px", opacity: 0, transform: "translateY(-6px)" },
        { height: `${answer.scrollHeight}px`, opacity: 1, transform: "none" },
      ],
      { duration: prefersReducedMotion() ? 0 : OPEN_MS, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
    animation.onfinish = () => busy.delete(item);
    items.filter((other) => other !== item && other.open).forEach(close);
  };

  for (const item of items) {
    item.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      if (item.open) close(item);
      else open(item);
    });
  }
}

document.querySelectorAll<HTMLElement>("[data-faq]").forEach(setup);
