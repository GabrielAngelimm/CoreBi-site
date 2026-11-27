/**
 * No celular, "Baixar para Windows" não baixa: abre o aviso de que o CoreBi é para o PC.
 * O link continua sendo o do instalador, então sem JavaScript ele baixa como no computador.
 */
import { required } from "@/scripts/motion";
import { openSheet } from "./sheet.client";

const notice = required<HTMLDialogElement>(document, "#m-windows");

for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-m-download]")) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openSheet(notice);
  });
}
