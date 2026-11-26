/**
 * Cabeçalho: fica mais denso depois da abertura, escurece sobre seções escuras
 * e acende o item do menu da seção que está no meio da tela.
 */
import { required } from "@/scripts/motion";

const header = required(document, "[data-header]");
const indicator = required(header, "[data-indicator]");
const links = [...header.querySelectorAll<HTMLAnchorElement>("[data-nav]")];
const hero = document.querySelector("[data-hero]");
const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];

function highlight(link: HTMLAnchorElement | undefined): void {
  links.forEach((l) => l.classList.toggle("active", l === link));
  if (!link) {
    indicator.classList.remove("shown");
    return;
  }
  indicator.style.setProperty("--x", `${link.offsetLeft}px`);
  indicator.style.setProperty("--w", `${link.offsetWidth}px`);
  indicator.classList.add("shown");
}

function enter(section: HTMLElement): void {
  header.classList.toggle("on-dark", section.dataset["tone"] === "dark");
  highlight(links.find((l) => l.dataset["nav"]?.split(" ").includes(section.id)));
}

if (hero) {
  new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-stuck", entry ? !entry.isIntersecting : false),
    { rootMargin: "-120px 0px 0px 0px" },
  ).observe(hero);
}

// a seção "atual" é a que cruza a linha do meio da janela
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) if (entry.isIntersecting) enter(entry.target as HTMLElement);
  },
  { rootMargin: "-50% 0px -50% 0px" },
);
sections.forEach((s) => observer.observe(s));
