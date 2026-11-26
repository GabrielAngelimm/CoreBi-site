import type { IconName } from "@/components/ui/icons";

/** As peças do PC e a cor de cada uma, iguais às do app. */
export const parts = {
  cpu: { label: "Processador", color: "var(--cpu)", icon: "cpu" },
  gpu: { label: "Placa de vídeo", color: "var(--gpu)", icon: "gpu" },
  memory: { label: "Memória", color: "var(--memory)", icon: "memory" },
  storage: { label: "Armazenamento", color: "var(--storage)", icon: "storage" },
  board: { label: "Placa-mãe", color: "var(--board)", icon: "board" },
  net: { label: "Rede", color: "var(--net)", icon: "net" },
} as const satisfies Record<string, { label: string; color: string; icon: IconName }>;

export type Part = keyof typeof parts;
