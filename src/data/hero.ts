import type { IconName } from "@/components/ui/icons";
import type { Part } from "./parts";

/** Os três anéis da abertura, de dentro para fora: o primeiro colorido, o do meio mais claro, o último cinza. */
export type RingId = 1 | 2 | 3;

/**
 * Cada anel gira inteiro, com as peças presas nele, e o vizinho gira ao contrário: o de dentro
 * no sentido anti-horário, o do meio no horário, o de fora no anti-horário. As voltas são mais
 * longas por fora para que tudo ande na mesma velocidade na tela (uns 12 px/s em 1920).
 * `bubble` é o diâmetro das peças daquele anel, também em px de uma tela de 1920.
 */
export interface Ring {
  readonly radius: number;
  readonly mobile: number;
  readonly turn: "left" | "right";
  readonly seconds: number;
  readonly bubble: number;
  readonly bubbleMobile: number;
}

export const rings: Readonly<Record<RingId, Ring>> = {
  1: {
    radius: 500,
    mobile: 100,
    turn: "left",
    seconds: 260,
    bubble: 62,
    bubbleMobile: 40,
  },
  2: {
    radius: 700,
    mobile: 134,
    turn: "right",
    seconds: 360,
    bubble: 54,
    bubbleMobile: 36,
  },
  3: {
    radius: 900,
    mobile: 166,
    turn: "left",
    seconds: 470,
    bubble: 46,
    bubbleMobile: 32,
  },
};

/**
 * Uma bolha presa num anel: uma peça do PC (com a cor dela) ou uma ferramenta do app (na cor
 * do CoreBi). Ângulo em graus (0° às 3 horas, sentido horário) no começo da volta.
 */
export interface OrbitItem {
  readonly part?: Part;
  readonly icon?: IconName;
  readonly ring: RingId;
  readonly angle: number;
  /** No celular a órbita fica em volta do ícone do app, então cada peça ganha outro ângulo. */
  readonly mobileAngle: number;
}

/**
 * Três bolhas por anel, a uns 120° uma da outra, para sempre haver algumas na tela enquanto
 * os anéis giram: dentro as peças principais, no meio o resto do PC, fora as ferramentas.
 * As posições de partida põem duas de cada anel à vista, entrando na tela, e uma escondida.
 */
export const orbit: readonly OrbitItem[] = [
  { part: "cpu", ring: 1, angle: -150, mobileAngle: -150 },
  { part: "gpu", ring: 1, angle: 25, mobileAngle: -30 },
  { part: "memory", ring: 1, angle: 100, mobileAngle: 90 },
  { part: "storage", ring: 2, angle: -25, mobileAngle: -64 },
  { part: "board", ring: 2, angle: 150, mobileAngle: -116 },
  { part: "net", ring: 2, angle: -105, mobileAngle: 150 },
  { icon: "gauge", ring: 3, angle: 2, mobileAngle: -10 },
  { icon: "overlay", ring: 3, angle: 186, mobileAngle: 190 },
  { icon: "bag", ring: 3, angle: 95, mobileAngle: -90 },
];
