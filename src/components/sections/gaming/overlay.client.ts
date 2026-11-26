/** OverlayBi: o FPS varia e os botões mudam o overlay de canto. */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const scene = required(document, "[data-overlay]");
const hud = required(scene, "[data-hud]");
const fps = required(scene, "[data-fps]");
const frametime = required(scene, "[data-frametime]");
const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-position]")];

for (const button of buttons) {
  button.addEventListener("click", () => {
    hud.dataset["pos"] = button.dataset["position"] ?? "tl";
    for (const b of buttons) b.setAttribute("aria-pressed", String(b === button));
  });
}

loopWhileVisible(
  scene,
  () => {
    const value = Math.round(random(139, 147));
    fps.textContent = String(value);
    frametime.textContent = `${decimal(1000 / value)} ms`;
  },
  1400,
);
