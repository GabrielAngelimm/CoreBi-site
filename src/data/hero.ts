import type { Part } from "./parts";

/** Uma leitura ao vivo dentro da bolha: varia entre `min` e `max`; o arco externo mostra `value / scale`. */
export interface Readout {
  readonly min: number;
  readonly max: number;
  readonly digits: 0 | 1;
  readonly unit: string;
  readonly scale: number;
}

/** Uma peça orbitando o ícone do app. Ângulo em graus (0° às 3 horas); anel 1 é o de dentro. */
export interface OrbitItem {
  readonly part: Part;
  readonly size: "xl" | "md" | "sm" | "xs";
  readonly ring: 1 | 2;
  readonly angle: number;
  /** No celular a órbita fica em volta do ícone, então cada peça ganha outra posição. */
  readonly mobile: { readonly ring: 1 | 2; readonly angle: number };
  readonly readout?: Readout;
  /** Quanto o arco externo enche quando a peça não tem leitura (0 a 1). */
  readonly level?: number;
  readonly float: { readonly duration: number; readonly delay: number; readonly amplitude: number };
}

export const orbit: readonly OrbitItem[] = [
  {
    part: "cpu",
    size: "xl",
    ring: 1,
    angle: -155,
    mobile: { ring: 1, angle: -150 },
    readout: { min: 58, max: 64, digits: 0, unit: "°C", scale: 100 },
    float: { duration: 7.5, delay: 0, amplitude: 8 },
  },
  {
    part: "net",
    size: "md",
    ring: 1,
    angle: -24,
    mobile: { ring: 1, angle: -30 },
    readout: { min: 478, max: 492, digits: 0, unit: "Mbps", scale: 1000 },
    float: { duration: 6.2, delay: -2.2, amplitude: 6 },
  },
  {
    part: "gpu",
    size: "xl",
    ring: 2,
    angle: 14,
    mobile: { ring: 2, angle: 10 },
    readout: { min: 95, max: 98, digits: 0, unit: "%", scale: 100 },
    float: { duration: 8.4, delay: -1.1, amplitude: 9 },
  },
  {
    part: "memory",
    size: "md",
    ring: 2,
    angle: 156,
    mobile: { ring: 2, angle: 170 },
    readout: { min: 19.4, max: 19.8, digits: 1, unit: "GB", scale: 32 },
    float: { duration: 6.8, delay: -3.4, amplitude: 7 },
  },
  {
    part: "storage",
    size: "sm",
    ring: 1,
    angle: 42,
    mobile: { ring: 2, angle: -62 },
    level: 0.97,
    float: { duration: 5.6, delay: -4.1, amplitude: 5 },
  },
  {
    part: "board",
    size: "xs",
    ring: 2,
    angle: -170,
    mobile: { ring: 2, angle: -118 },
    level: 0.46,
    float: { duration: 9.2, delay: -0.6, amplitude: 6 },
  },
];

/** Geometria da órbita no desktop, em pixels de uma tela de 1920 × 900 (o CSS escala o resto). */
export const dial = {
  rings: { 1: 560, 2: 760 },
  bubble: { xl: 104, md: 84, sm: 60, xs: 48 },
  bezel: { radius: 960, span: 14 },
} as const;
