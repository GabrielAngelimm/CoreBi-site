/** Dados fixos do site. Tudo que aparece em mais de um lugar mora aqui. */
const repo = "https://github.com/GabrielAngelimm/CoreBi";

export const site = {
  name: "CoreBi",
  title: "CoreBi · Monitore, teste e cuide do PC",
  description:
    "Sensores ao vivo, saúde dos discos, ficha técnica, overlay de FPS, teste de carga e instalação de apps e drivers. Para Windows, grátis e de código aberto.",
  locale: "pt-BR",
  themeColor: "#F5F7F8",
  repo: { owner: "GabrielAngelimm", name: "CoreBi", url: repo },
  links: {
    code: repo,
    releases: `${repo}/releases`,
    issues: `${repo}/issues`,
    privacy: `${repo}/blob/main/docs/PRIVACY.md`,
    license: `${repo}/blob/main/LICENSE`,
    site: "https://github.com/GabrielAngelimm/CoreBi-site",
  },
} as const;

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export const nav: readonly NavItem[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Recursos", href: "#recursos" },
  { label: "Instalar", href: "#instalar" },
  { label: "Perguntas", href: "#perguntas" },
  { label: "GitHub", href: site.links.code, external: true },
];

export const footerLinks: readonly NavItem[] = [
  { label: "Código", href: site.links.code, external: true },
  { label: "Versões", href: site.links.releases, external: true },
  { label: "Privacidade", href: site.links.privacy, external: true },
  { label: "Reportar um problema", href: site.links.issues, external: true },
  { label: "Licença MIT", href: site.links.license, external: true },
];
