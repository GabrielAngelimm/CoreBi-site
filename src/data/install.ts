/** Os três passos da seção Instalar. O passo 1 recebe o arquivo da release no componente. */
export const installSteps = [
  {
    title: "Baixe e confira",
    text: "Rode no PowerShell, na pasta do download, e veja se o código bate.",
  },
  {
    title: "Passe pelo aviso",
    text: "O instalador não tem assinatura paga, então o Windows avisa. É normal.",
  },
  {
    title: "Escolha os extras",
    text: "Dois extras grátis, já marcados. Desmarque se não quiser.",
  },
] as const;

/** Componentes opcionais que o instalador oferece, marcados por padrão. */
export const installerExtras = [
  { name: "PawnIO", detail: "sensores do processador" },
  { name: "RTSS", detail: "overlay em tela cheia" },
] as const;
