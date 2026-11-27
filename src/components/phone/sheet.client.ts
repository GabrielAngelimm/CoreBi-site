/**
 * Folhas do celular: o X fecha, e tocar no fundo escurecido acima da folha também. Quem abre
 * cada folha é o script de quem a usa (o menu, o aviso do Windows), com `openSheet`.
 */
import { required } from "@/scripts/motion";

/** Abre a folha, fechando antes a que estiver aberta: só uma de cada vez. */
export function openSheet(sheet: HTMLDialogElement): void {
  for (const other of document.querySelectorAll<HTMLDialogElement>("[data-m-sheet][open]")) {
    if (other !== sheet) other.close();
  }
  if (!sheet.open) sheet.showModal();
}

for (const sheet of document.querySelectorAll<HTMLDialogElement>("[data-m-sheet]")) {
  required(sheet, "[data-m-close]").addEventListener("click", () => sheet.close());
  // o clique no fundo chega no próprio <dialog>; acima da caixa dele é o fundo
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet && event.clientY < sheet.getBoundingClientRect().top) sheet.close();
  });
}
