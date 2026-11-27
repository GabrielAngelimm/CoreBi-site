/** Os três passos da seção Instalar e o fim, com o app aberto. A tela de cada um fica no componente. */
export const installSteps = [
  {
    id: "conferir",
    title: "Baixe e confira",
    text: "Rode o comando no PowerShell, na pasta do download, e veja se o código bate.",
  },
  {
    id: "aviso",
    title: "Passe pelo aviso",
    text: "O instalador não tem assinatura paga, então o Windows avisa. É normal.",
  },
  {
    id: "extras",
    title: "Escolha os extras",
    text: "Dois extras grátis, já marcados. Desmarque se não quiser.",
  },
  {
    id: "pronto",
    title: "Pronto para usar",
    text: "O CoreBi abre já lendo os sensores. Sem conta e sem configurar nada.",
  },
] as const;

/** O que a janela do app mostra no último passo, quando abre pela primeira vez. */
export const firstOpen = [
  { part: "cpu", label: "Processador", value: "52", unit: "°C" },
  { part: "gpu", label: "Placa de vídeo", value: "44", unit: "°C" },
  { part: "memory", label: "Memória", value: "7,9", unit: "GB" },
  { part: "storage", label: "SSD", value: "97", unit: "% de vida" },
] as const;

/** Quanto tempo cada passo fica na tela antes de ir para o próximo, em ms. */
export const STEP_MS = 6000;

/** Componentes opcionais que o instalador oferece, marcados por padrão. */
export const installerExtras = [
  { name: "PawnIO", detail: "sensores do processador" },
  { name: "RTSS", detail: "overlay em tela cheia" },
] as const;
