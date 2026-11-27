/** OverlayBi: o FPS e o tempo de quadro variam como numa partida. */
import { decimal } from "@/lib/format";
import { loopWhileVisible, random, required } from "@/scripts/motion";

const scene = required(document, "[data-overlay]");
const fps = required(scene, "[data-fps]");
const frametime = required(scene, "[data-frametime]");

loopWhileVisible(
  scene,
  () => {
    const value = Math.round(random(139, 147));
    fps.textContent = String(value);
    frametime.textContent = `${decimal(1000 / value)} ms`;
  },
  1400,
);
