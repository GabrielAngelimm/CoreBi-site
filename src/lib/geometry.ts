/** Geometria dos mostradores (anéis, arcos e marcas). Ângulos em graus, 0° às 3 horas, sentido horário. */

export interface Point {
  readonly x: number;
  readonly y: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function polar(angle: number, radius: number): Point {
  const t = (angle * Math.PI) / 180;
  return { x: round(Math.cos(t) * radius), y: round(Math.sin(t) * radius) };
}

/** Arco de `from` até `to` (graus), sempre no sentido horário. */
export function arcPath(from: number, to: number, radius: number): string {
  const a = polar(from, radius);
  const b = polar(to, radius);
  const large = (((to - from) % 360) + 360) % 360 > 180 ? 1 : 0;
  return `M${a.x} ${a.y}A${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`;
}

export function linePath(angle: number, r0: number, r1: number): string {
  const a = polar(angle, r0);
  const b = polar(angle, r1);
  return `M${a.x} ${a.y}L${b.x} ${b.y}`;
}

/** Marcas de um mostrador: `count` riscos entre `from` e `to`; a cada `majorEvery`, um risco maior. */
export function ticks(options: {
  from: number;
  to: number;
  count: number;
  radius: number;
  length: number;
  majorLength?: number;
  majorEvery?: number;
}): string[] {
  const { from, to, count, radius, length, majorLength = length, majorEvery = 0 } = options;
  const step = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const size = majorEvery && i % majorEvery === 0 ? majorLength : length;
    return linePath(from + step * i, radius, radius - size);
  });
}

/** Mostrador de 270°, aberto em baixo (de 135° a 405°): o formato dos medidores do app. */
export const GAUGE_START = 135;
export const GAUGE_END = 405;

export function gaugeAngle(fraction: number): number {
  return GAUGE_START + (GAUGE_END - GAUGE_START) * Math.min(1, Math.max(0, fraction));
}
