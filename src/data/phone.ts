/**
 * As seções da versão para celular, na ordem da página. O menu do celular é feito daqui.
 * `aliases` são os ids da versão do computador que caem nesta seção: um link como
 * corebi.vercel.app/#drivers, aberto no celular, rola até Drivers e apps.
 */
export interface PhoneSection {
  readonly id: `m-${string}`;
  readonly label: string;
  readonly hint: string;
  readonly aliases: readonly string[];
}

export const phoneSections: readonly PhoneSection[] = [
  { id: "m-sobre", label: "Sobre", hint: "Um app no lugar de seis", aliases: ["sobre"] },
  {
    id: "m-monitoramento",
    label: "Monitoramento",
    hint: "Sensores, SSD e rede",
    aliases: ["monitoramento"],
  },
  { id: "m-jogos", label: "Jogos", hint: "Overlay de FPS e benchmark", aliases: ["jogos"] },
  {
    id: "m-teste",
    label: "Teste de carga",
    hint: "O PC aguenta horas de jogo?",
    aliases: ["teste"],
  },
  {
    id: "m-drivers",
    label: "Drivers e apps",
    hint: "Para depois de formatar",
    aliases: ["drivers", "apps"],
  },
  { id: "m-instalar", label: "Instalar", hint: "Do download ao app aberto", aliases: ["instalar"] },
  { id: "m-perguntas", label: "Perguntas", hint: "As dúvidas mais comuns", aliases: ["perguntas"] },
];

/** A tela final, com os botões de baixar. Fica fora do menu, que já traz os mesmos botões. */
export const phoneFinal = { id: "m-baixar", aliases: ["baixar"] } as const;

/** O que o aviso do Windows compartilha quando a pessoa manda o link para o PC. */
export const shareText = "CoreBi: monitore, teste e cuide do PC num app só. Para Windows, grátis.";

/**
 * Os três passos da seção Instalar no celular, mais curtos que os do computador: quem lê está
 * no celular e vai instalar depois, no PC. `{size}` vira o tamanho do instalador; **trecho**
 * fica em negrito.
 */
export const phoneInstallSteps = [
  {
    title: "Baixe no PC",
    text: "Um instalador de {size}, para Windows 10 e 11.",
  },
  {
    title: "Passe pelo aviso",
    text: "Sem assinatura paga, o Windows avisa. Clique em **Mais informações** e em **Executar assim mesmo**.",
  },
  {
    title: "Abra e use",
    text: "Os extras grátis já vêm marcados. O CoreBi abre lendo os sensores, sem conta.",
  },
] as const;
