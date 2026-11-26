/** Os três passos da seção Instalar. A tela de cada um fica no componente. */
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
] as const;

/** Quanto tempo cada passo fica na tela antes de ir para o próximo, em ms. */
export const STEP_MS = 6000;

/** Componentes opcionais que o instalador oferece, marcados por padrão. */
export const installerExtras = [
  { name: "PawnIO", detail: "sensores do processador" },
  { name: "RTSS", detail: "overlay em tela cheia" },
] as const;
