/**
 * Entrada ao rolar: blocos com [data-reveal] mostram os filhos em cascata quando aparecem.
 * O que já está na tela ao abrir aparece sem animação, para nada piscar.
 */
import { prefersReducedMotion } from "./motion";

const blocks = document.querySelectorAll<HTMLElement>("[data-reveal]");

blocks.forEach((block) => {
  [...block.children].forEach((child, i) =>
    (child as HTMLElement).style.setProperty("--i", String(i)),
  );
});

if (prefersReducedMotion()) {
  blocks.forEach((b) => b.classList.add("is-in"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  blocks.forEach((b) => {
    if (b.getBoundingClientRect().top < innerHeight) b.classList.add("is-in");
    else observer.observe(b);
  });
}
