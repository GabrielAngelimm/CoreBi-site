/**
 * Cabeçalho do celular: mostra o nome da seção que está no meio da tela, escurece sobre as
 * seções escuras e abre a folha com as seções. Também leva os links da versão do computador
 * (#drivers, #instalar...) até a seção certa do celular.
 */
import { phoneFinal, phoneSections } from "@/data/phone";
import { prefersReducedMotion, required } from "@/scripts/motion";

const site = required(document, "[data-phone]");
const header = required(site, "[data-m-header]");
const where = required(header, "[data-m-where]");
const sheet = required<HTMLDialogElement>(document, "[data-m-sheet]");
const links = [...sheet.querySelectorAll<HTMLAnchorElement>("[data-m-link]")];
const hero = required(site, "[data-m-hero]");
const sections = [...site.querySelectorAll<HTMLElement>("[data-m-section]")];

const isPhone = () => getComputedStyle(site).display !== "none";
const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

function say(text: string): void {
  if (where.textContent === text) return;
  where.textContent = text;
  where.classList.remove("swap");
  void where.offsetWidth;
  where.classList.add("swap");
}

function enter(section: HTMLElement): void {
  header.classList.toggle("on-dark", section.dataset["tone"] === "dark");
  const name = section.dataset["mSection"] ?? "";
  say(name || "Seções");
  links.forEach((l) => l.setAttribute("aria-current", String(l.dataset["mLink"] === section.id)));
}

new IntersectionObserver(
  ([entry]) => {
    const atTop = entry?.isIntersecting ?? true;
    header.classList.toggle("is-stuck", !atTop);
    if (atTop) {
      header.classList.remove("on-dark");
      say("Seções");
      links.forEach((l) => l.setAttribute("aria-current", "false"));
    }
  },
  { rootMargin: "-50% 0px -50% 0px" },
).observe(hero);

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) if (entry.isIntersecting) enter(entry.target as HTMLElement);
  },
  { rootMargin: "-50% 0px -50% 0px" },
);
sections.forEach((s) => observer.observe(s));

// ---- folha com as seções ----
required(header, "[data-m-open]").addEventListener("click", () => sheet.showModal());
required(sheet, "[data-m-close]").addEventListener("click", () => sheet.close());

// tocar fora da folha (no fundo escurecido) fecha
sheet.addEventListener("click", (event) => {
  if (event.target === sheet) {
    const box = sheet.getBoundingClientRect();
    if (event.clientY < box.top) sheet.close();
  }
});

for (const link of links) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.getElementById(link.dataset["mLink"] ?? "");
    sheet.close();
    if (!target) return;
    history.replaceState(null, "", `#${target.id}`);
    target.scrollIntoView({ behavior: scrollBehavior() });
  });
}

// ---- links da versão do computador abertos no celular ----
const aliases = new Map<string, string>();
for (const s of [...phoneSections, phoneFinal]) for (const a of s.aliases) aliases.set(a, s.id);
aliases.set("inicio", "m-abertura");
aliases.set("abertura", "m-abertura");

function follow(): void {
  if (!isPhone()) return;
  const id = aliases.get(location.hash.slice(1));
  document.getElementById(id ?? "")?.scrollIntoView();
}

follow();
window.addEventListener("hashchange", follow);
