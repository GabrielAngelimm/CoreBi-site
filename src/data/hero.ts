import type { Part } from "./parts";

/** Uma leitura ao vivo dentro da bolha, que varia entre `min` e `max`. */
export interface Readout {
  readonly min: number;
  readonly max: number;
  readonly digits: 0 | 1;
  readonly unit: string;
}

/** Os três anéis da abertura, de dentro para fora: o primeiro colorido, o último em cinza. */
export type RingId = 1 | 2 | 3;
export type RingTone = "vivid" | "medium" | "mono";

export const rings: Readonly<Record<RingId, { radius: number; mobile: number; tone: RingTone }>> = {
  1: { radius: 500, mobile: 104, tone: "vivid" },
  2: { radius: 700, mobile: 140, tone: "medium" },
  3: { radius: 900, mobile: 178, tone: "mono" },
};

/** Uma peça num anel. Ângulo em graus (0° às 3 horas, sentido horário). */
export interface OrbitItem {
  readonly part: Part;
  readonly size: "xl" | "md" | "sm";
  readonly ring: RingId;
  readonly angle: number;
  /** No celular a órbita fica em volta do ícone do app, então cada peça ganha outro ângulo. */
  readonly mobileAngle: number;
  readonly readout?: Readout;
  readonly float: { readonly duration: number; readonly delay: number; readonly amplitude: number };
}

/** Posições escolhidas à mão para parecerem soltas, sem simetria. */
export const orbit: readonly OrbitItem[] = [
  {
    part: "cpu",
    size: "xl",
    ring: 1,
    angle: -150,
    mobileAngle: -150,
    readout: { min: 58, max: 64, digits: 0, unit: "°C" },
    float: { duration: 7.5, delay: 0, amplitude: 8 },
  },
  {
    part: "gpu",
    size: "xl",
    ring: 1,
    angle: 22,
    mobileAngle: -30,
    readout: { min: 95, max: 98, digits: 0, unit: "%" },
    float: { duration: 8.4, delay: -1.1, amplitude: 9 },
  },
  {
    part: "net",
    size: "md",
    ring: 2,
    angle: -31,
    mobileAngle: -64,
    readout: { min: 478, max: 492, digits: 0, unit: "Mbps" },
    float: { duration: 6.2, delay: -2.2, amplitude: 6 },
  },
  {
    part: "memory",
    size: "md",
    ring: 2,
    angle: 161,
    mobileAngle: -116,
    readout: { min: 19.4, max: 19.8, digits: 1, unit: "GB" },
    float: { duration: 6.8, delay: -3.4, amplitude: 7 },
  },
  {
    part: "storage",
    size: "sm",
    ring: 3,
    angle: -8,
    mobileAngle: -10,
    float: { duration: 5.6, delay: -4.1, amplitude: 5 },
  },
  {
    part: "board",
    size: "sm",
    ring: 3,
    angle: 199,
    mobileAngle: 190,
    float: { duration: 9.2, delay: -0.6, amplitude: 6 },
  },
];
