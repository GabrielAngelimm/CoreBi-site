/** Abertura: os anéis só giram enquanto ela está na tela; ao voltar, seguem de onde pararam. */
import { required } from "@/scripts/motion";

const hero = required(document, "[data-hero]");
const dial = required(hero, "[data-dial]");

new IntersectionObserver((entries) => {
  dial.toggleAttribute("data-paused", !entries.some((e) => e.isIntersecting));
}).observe(hero);
