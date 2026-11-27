/** Ferramentas de animação usadas pelos scripts das seções. */

export const prefersReducedMotion = (): boolean =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Chama `callback` uma vez, quando `el` aparece na tela. */
export function onceVisible(el: Element, callback: () => void, threshold = 0.4): void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        callback();
      }
    },
    { threshold },
  );
  observer.observe(el);
}

/**
 * Repete `tick` a cada `ms` só enquanto `el` está na tela e a aba está aberta.
 * Assim nenhuma animação gasta CPU fora da vista.
 */
export function loopWhileVisible(el: Element, tick: () => void, ms: number): void {
  if (prefersReducedMotion()) return;
  let timer: number | undefined;
  let visible = false;
  const sync = () => {
    const run = visible && document.visibilityState === "visible";
    if (run && timer === undefined) timer = window.setInterval(tick, ms);
    if (!run && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(el);
  document.addEventListener("visibilitychange", sync);
}

/**
 * Chama `play` quando `el` aparece na tela (pelo menos `threshold` dele à vista) e de novo
 * cada vez que volta depois de ter saído por completo. Com movimento reduzido, nunca chama.
 */
export function onEachEntry(el: Element, play: () => void, threshold = 0.4): void {
  if (prefersReducedMotion()) return;
  let away = true;
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) away = true;
        else if (away && entry.intersectionRatio >= threshold) {
          away = false;
          play();
        }
      }
    },
    { threshold: [0, threshold] },
  ).observe(el);
}

/**
 * Repete `tick` a cada `ms`, `times` vezes, e para. Chamar de novo cancela a rodada anterior.
 * Serve para uma animação ficar viva por alguns segundos e depois descansar.
 */
export function burst(): (tick: () => void, ms: number, times: number) => void {
  let timer: number | undefined;
  return (tick, ms, times) => {
    window.clearInterval(timer);
    let left = times;
    timer = window.setInterval(() => {
      tick();
      if (--left <= 0) window.clearInterval(timer);
    }, ms);
  };
}

/** Anima um número de 0 até o valor, com desaceleração. */
export function tween(duration: number, frame: (progress: number) => void): Promise<void> {
  return new Promise((resolve) => {
    if (prefersReducedMotion()) {
      frame(1);
      resolve();
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      frame(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

export const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Busca um elemento obrigatório dentro de `root`; falha cedo se a marcação mudar. */
export function required<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Elemento não encontrado: ${selector}`);
  return el;
}

export const random = (min: number, max: number) => min + Math.random() * (max - min);

/** Resolve quando `el` está na tela e a aba está aberta; serve para pausar laços longos. */
export function whenVisible(el: Element): Promise<void> {
  return new Promise((resolve) => {
    const check = (visible: boolean) => {
      if (!visible || document.visibilityState !== "visible") return false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onTab);
      resolve();
      return true;
    };
    let inView = false;
    const observer = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
      check(inView);
    });
    const onTab = () => check(inView);
    document.addEventListener("visibilitychange", onTab);
    observer.observe(el);
  });
}
