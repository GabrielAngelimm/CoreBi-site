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
  1: { radius: 500, mobile: 100, tone: "vivid" },
  2: { radius: 700, mobile: 134, tone: "medium" },
  3: { radius: 900, mobile: 166, tone: "mono" },
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
  /**
   * A peça anda pela linha do próprio anel, indo e voltando `swing` px (medidos na tela de 1920).
   * Em volta do mostrador, uma peça sobe enquanto a vizinha desce (`start`), todas no mesmo
   * ritmo, para o movimento parecer um só.
   */
  readonly drift: { readonly start: "up" | "down"; readonly swing: number };
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
    drift: { start: "down", swing: 48 },
  },
  {
    part: "gpu",
    size: "xl",
    ring: 1,
    angle: 10,
    mobileAngle: -30,
    readout: { min: 95, max: 98, digits: 0, unit: "%" },
    drift: { start: "up", swing: 48 },
  },
  {
    part: "net",
    size: "md",
    ring: 2,
    angle: -18,
    mobileAngle: -64,
    readout: { min: 478, max: 492, digits: 0, unit: "Mbps" },
    drift: { start: "up", swing: 52 },
  },
  {
    part: "memory",
    size: "md",
    ring: 2,
    angle: 161,
    mobileAngle: -116,
    readout: { min: 19.4, max: 19.8, digits: 1, unit: "GB" },
    drift: { start: "down", swing: 52 },
  },
  {
    part: "storage",
    size: "sm",
    ring: 3,
    angle: -8,
    mobileAngle: -10,
    drift: { start: "down", swing: 56 },
  },
  {
    part: "board",
    size: "sm",
    ring: 3,
    angle: 199,
    mobileAngle: 190,
    drift: { start: "up", swing: 56 },
  },
];
