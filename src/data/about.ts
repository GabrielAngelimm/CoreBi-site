import type { IconName } from "@/components/ui/icons";
import type { Part } from "./parts";

/** Os programas que o CoreBi substitui, em volta do ícone do app. */
export const replacedTools: readonly { label: string; part: Part; icon?: IconName }[] = [
  { label: "Sensores", part: "cpu" },
  { label: "Overlay de FPS", part: "gpu" },
  { label: "Saúde do disco", part: "storage" },
  { label: "Benchmark", part: "memory", icon: "gauge" },
  { label: "Rede", part: "net" },
  { label: "Drivers", part: "board" },
];

export const facts: readonly { value: string; text: string }[] = [
  { value: "14", text: "páginas, do monitoramento às ferramentas" },
  { value: "6", text: "benchmarks de processador, jogo, memória e disco" },
  { value: "73", text: "apps prontos para instalar pelo winget" },
  { value: "0", text: "servidores, e nada sai do PC sem você pedir" },
];
