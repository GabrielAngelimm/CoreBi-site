/** Leituras que passam na faixa do fim da página, como um resumo do que o app mostra. */
import type { Part } from "./parts";

export interface Reading {
  readonly part: Part;
  readonly label: string;
  readonly value: string;
  /** Leituras ao vivo variam entre `min` e `max`, como os sensores do app. */
  readonly live?: {
    readonly min: number;
    readonly max: number;
    readonly digits: 0 | 1;
    readonly unit: string;
  };
}

export const readings: readonly Reading[] = [
  {
    part: "cpu",
    label: "Processador",
    value: "61 °C",
    live: { min: 58, max: 64, digits: 0, unit: "°C" },
  },
  {
    part: "gpu",
    label: "Placa de vídeo",
    value: "97 %",
    live: { min: 95, max: 99, digits: 0, unit: "%" },
  },
  {
    part: "memory",
    label: "Memória",
    value: "19,6 GB",
    live: { min: 19.4, max: 19.8, digits: 1, unit: "GB" },
  },
  { part: "storage", label: "SSD", value: "97 % de vida" },
  {
    part: "net",
    label: "Rede",
    value: "486 Mbps",
    live: { min: 471, max: 494, digits: 0, unit: "Mbps" },
  },
  {
    part: "gpu",
    label: "OverlayBi",
    value: "144 FPS",
    live: { min: 139, max: 147, digits: 0, unit: "FPS" },
  },
  { part: "board", label: "Placa-mãe", value: "B550 · BIOS 3.40" },
  { part: "cpu", label: "Teste de carga", value: "aprovado" },
];
