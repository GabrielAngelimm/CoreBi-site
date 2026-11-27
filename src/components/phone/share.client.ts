/**
 * Botões "Enviar para o PC". Com o compartilhar do sistema, abre a lista de apps; sem ele
 * (ou se falhar), copia o link e avisa no próprio botão.
 */
const CONFIRM_MS = 1800;

function showCopied(button: HTMLElement): void {
  const label = button.querySelector("[data-share-label]");
  if (!label) return;
  const original = label.textContent;
  label.textContent = "Link copiado";
  window.setTimeout(() => (label.textContent = original), CONFIRM_MS);
}

async function share(button: HTMLElement): Promise<void> {
  const url = button.dataset["url"] ?? location.href;
  const text = button.dataset["text"] ?? "";
  if (navigator.share) {
    try {
      await navigator.share({ title: "CoreBi", text, url });
      return;
    } catch (error) {
      // a pessoa fechou a lista: nada a fazer
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showCopied(button);
  } catch {
    window.prompt("Copie o link do CoreBi:", url);
  }
}

document.querySelectorAll<HTMLElement>("[data-share]").forEach((button) => {
  button.addEventListener("click", () => void share(button));
});
