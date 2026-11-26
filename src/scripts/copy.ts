/**
 * Botões "Copiar". Usa a área de transferência quando o navegador deixa
 * e, se não deixar, seleciona o texto para a pessoa copiar com Ctrl+C.
 */
const RESET_MS = 1600;

function selectText(button: HTMLElement): void {
  const target = button.parentElement?.querySelector("code");
  const selection = getSelection();
  if (!target || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(target);
  selection.removeAllRanges();
  selection.addRange(range);
}

function confirm(button: HTMLElement): void {
  const label = button.textContent;
  button.textContent = "Copiado";
  button.classList.add("done");
  window.setTimeout(() => {
    button.textContent = label;
    button.classList.remove("done");
  }, RESET_MS);
}

document.addEventListener("click", (event) => {
  const button = (event.target as Element | null)?.closest<HTMLElement>("[data-copy]");
  if (!button || button.classList.contains("done")) return;
  const text = button.dataset["copy"] ?? "";
  navigator.clipboard
    .writeText(text)
    .then(() => confirm(button))
    .catch(() => selectText(button));
});
