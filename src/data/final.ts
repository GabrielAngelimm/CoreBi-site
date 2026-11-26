/** Leituras que passam na faixa do fim da página, como um resumo do que o app mostra. */
import type { Part } from "./parts";

export interface Reading {
  readonly part: Part;
  readonly label: string;
  readonly value: string;
}

export const readings: readonly Reading[] = [
  { part: "cpu", label: "Processador", value: "61 °C" },
  { part: "gpu", label: "Placa de vídeo", value: "97 %" },
  { part: "memory", label: "Memória", value: "19,6 GB" },
  { part: "storage", label: "SSD", value: "97 % de vida" },
  { part: "net", label: "Rede", value: "486 Mbps" },
  { part: "gpu", label: "OverlayBi", value: "144 FPS" },
  { part: "board", label: "Placa-mãe", value: "B550 · BIOS 3.40" },
  { part: "cpu", label: "Teste de carga", value: "aprovado" },
];
