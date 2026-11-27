/**
 * Cartões que passam com o dedo: o botão do cartão que está na tela fica marcado, e tocar
 * num botão desliza até o cartão dele.
 */
import { prefersReducedMotion, required } from "@/scripts/motion";

function setup(pager: HTMLElement): void {
  const track = required(pager, "[data-track]");
  const slides = [...track.children] as HTMLElement[];
  const buttons = [...pager.querySelectorAll<HTMLButtonElement>("[data-go]")];

  const mark = (index: number) =>
    buttons.forEach((b, i) => b.setAttribute("aria-current", String(i === index)));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) mark(slides.indexOf(entry.target as HTMLElement));
      }
    },
    { root: track, threshold: 0.6 },
  );
  slides.forEach((slide) => observer.observe(slide));

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      const slide = slides[i];
      if (!slide) return;
      const pad = Number.parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      track.scrollTo({
        left: slide.offsetLeft - pad,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      mark(i);
    });
  });
}

document.querySelectorAll<HTMLElement>("[data-pager]").forEach(setup);
