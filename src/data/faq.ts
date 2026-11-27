/**
 * Perguntas frequentes. Cada resposta é uma lista de parágrafos;
 * trechos entre **asteriscos** aparecem em destaque.
 */
export interface FaqItem {
  readonly question: string;
  readonly answer: readonly string[];
}

export const faq: readonly FaqItem[] = [
  {
    question: "O Windows disse que protegeu o computador. É vírus?",
    answer: [
      "Não. O aviso aparece para qualquer programa sem assinatura digital paga, e o CoreBi não tem uma. Para ter certeza de que o arquivo é o publicado, compare o SHA256 dele com o código mostrado na seção Instalar. Se bater, use **Mais informações** e **Executar assim mesmo**.",
      "O código inteiro está no GitHub, e o instalador é gerado pelo GitHub Actions a partir dele.",
    ],
  },
  {
    question: "Por que ele pede permissão de administrador?",
    answer: [
      "Os sensores do hardware, os eventos que contam o FPS e as ferramentas de sistema (drivers, inicialização, plano de energia) só funcionam com essa permissão. Sem ela, essas leituras aparecem como indisponíveis, com o motivo.",
    ],
  },
  {
    question: "O que é o PawnIO e eu preciso dele?",
    answer: [
      "É o driver que lê a temperatura, o consumo e o clock internos do processador. Ele é opcional. Sem ele, só esses sensores ficam de fora. O instalador baixa o PawnIO pelo winget, da fonte oficial. Na versão portátil, ele é instalado pelo próprio app, em **Corrigir**, no pé do menu.",
    ],
  },
  {
    question: "O CoreBi envia os meus dados para algum lugar?",
    answer: [
      "Não. Não há conta, telemetria nem servidor do CoreBi. A internet só é usada quando você pede: testar a conexão, buscar drivers na NVIDIA ou no Windows Update e instalar apps pelo winget. O relatório exportado sai sem números de série e sem o nome do usuário.",
    ],
  },
  {
    question: "Os resultados do Benchmark se comparam com outros programas?",
    answer: [
      "Não um a um. Os testes fazem trabalho real, mas com métodos próprios, então servem para comparar o seu PC com ele mesmo (antes e depois de trocar uma peça ou um driver) e com outros PCs rodando o CoreBi.",
    ],
  },
  {
    question: "Como desinstalar?",
    answer: [
      "Pelo Windows, em Aplicativos instalados. O desinstalador pergunta se também apaga configurações, histórico e backups da inicialização; o padrão é manter. PawnIO e RTSS continuam instalados, porque outros programas podem usá-los.",
    ],
  },
];
