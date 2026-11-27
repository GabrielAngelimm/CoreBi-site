/**
 * As seções da versão para celular, na ordem da página. O menu do celular é feito daqui.
 * `aliases` são os ids da versão do computador que caem nesta seção: um link como
 * corebi.vercel.app/#drivers, aberto no celular, rola até Ferramentas.
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
    id: "m-ferramentas",
    label: "Ferramentas",
    hint: "Teste de carga, drivers e apps",
    aliases: ["teste", "drivers", "apps"],
  },
  { id: "m-instalar", label: "Instalar", hint: "Do download ao app aberto", aliases: ["instalar"] },
  { id: "m-perguntas", label: "Perguntas", hint: "As dúvidas mais comuns", aliases: ["perguntas"] },
];

/** A tela final, com os botões de baixar. Fica fora do menu, que já traz os mesmos botões. */
export const phoneFinal = { id: "m-baixar", aliases: ["baixar"] } as const;

/** O que o botão "Enviar para o PC" compartilha. O endereço vem do `site` do Astro. */
export const shareText = "CoreBi: monitore, teste e cuide do PC num app só. Para Windows, grátis.";
