# CoreBi · site

Site oficial do [CoreBi](https://github.com/GabrielAngelimm/CoreBi), o app para Windows que monitora, testa e cuida do PC num app só.

**No ar em [corebi.vercel.app](https://corebi.vercel.app).**

Página estática feita com [Astro](https://astro.build) e TypeScript estrito. Não usa framework de interface: as animações são CSS e Web Animations API, com um pouco de TypeScript que só liga classes e troca textos. O HTML sai pronto do build, então a página abre rápido e funciona até com o JavaScript desligado.

## Rodar no computador

Requer Node 22 ou mais novo.

```sh
npm install
npm run dev        # http://localhost:4321, recarrega ao salvar
```

| Comando              | O que faz                                               |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                             |
| `npm run build`      | Gera o site em `dist/`                                  |
| `npm run preview`    | Serve o `dist/` como em produção                        |
| `npm run verify`     | Formato, lint, tipos e build: o mesmo que o CI roda     |
| `npm test`           | Testes no navegador com Playwright (rode o build antes) |
| `npm run lighthouse` | Lighthouse no `dist/` com as notas mínimas do projeto   |
| `npm run format`     | Formata tudo com Prettier                               |

## Como o código está organizado

```
src/
├── pages/            index e 404
├── layouts/          BaseLayout: <head>, fontes, metadados
├── components/
│   ├── layout/       cabeçalho, rodapé e Section (a casca de cada seção)
│   ├── sections/     uma pasta por seção da página, na ordem em que aparecem
│   │   ├── hero/       abertura com os três anéis girando e as peças presas neles
│   │   ├── monitoring/ sensores, armazenamento e rede, um componente por bloco
│   │   ├── gaming/     OverlayBi e Benchmark, a seção escura
│   │   └── ...         about, stress-test, drivers, apps, install-steps, faq, final
│   └── ui/           peças reutilizadas (botão, ícone, bolha, logo, FeatureTile, WindowFrame...)
├── data/             textos e números das seções, tipados
├── config/site.ts    nome, links e menu: tudo que aparece em mais de um lugar
├── lib/              funções puras usadas no build (release, geometria, formatos)
├── scripts/          utilidades do navegador (copiar, laços de animação)
├── styles/           tokens de design, base global e keyframes
└── assets/           imagens otimizadas pelo Astro (ícones dos apps)
```

Regras que o projeto segue:

- **Conteúdo fora da marcação.** Textos, listas e números ficam em `src/data/` e `src/config/`. Para mudar uma pergunta do FAQ, mexa só em `data/faq.ts`.
- **Cores e medidas só por token.** `styles/tokens.css` define cores (uma por peça, como no app), fontes, raios, sombras e curvas de movimento. Componentes não usam valores soltos; a única exceção são o preto e o branco das máscaras, que valem como transparência e não como cor.
- **Tipo numa escala curta.** Tamanhos só pelos tokens `--text-*` (11 a 28 px), `--num-*` (números grandes) e `--display-*` (títulos de tela). Peso 400 no texto, 500 em títulos, rótulos e botões, 600 só nos números. Sem itálico e sem caixa alta.
- **Sem enfeite.** Nada de selos acima dos títulos, brilhos, efeito de entrada ao rolar ou mola nos botões. Cor e movimento aparecem onde mostram um dado do app.
- **Espaço em múltiplos de 4.** Margens e espaçamentos usam 4, 8, 12, 16, 24, 32, 48, 64 e 96 px.
- **Geometria no build.** Arcos, marcas do mostrador e posições em órbita são calculados em `lib/geometry.ts` durante o build. O navegador recebe o SVG pronto.
- **Animação só quando aparece, e por pouco tempo.** As demonstrações tocam quando a seção entra na tela, ficam vivas alguns segundos e param; só tocam de novo quando a pessoa sai e volta (`onEachEntry` e `burst` em `scripts/motion.ts`). Os anéis da abertura param fora dela. Tudo respeita `prefers-reduced-motion`: quem desliga as animações vê cada demonstração já no estado final.
- **Cada seção na sua pasta.** O componente (`Apps.astro`) e o script que roda no navegador (`apps.client.ts`) ficam juntos. O sufixo `.client.ts` separa o que vai para o navegador dos dados em `src/data/`, que só existem no build.
- **Uma seção, uma tela.** `Section.astro` dá a cada seção a altura da janela e o encaixe da rolagem (`scroll-snap`, só no computador). O conteúdo fica num `.frame` que encolhe por `--fit` em telas baixas (a abertura e o rodapé também), então nada é cortado num notebook de 720 px. No celular as seções têm a altura do conteúdo.
- **Seção escura é um tom, não uma cópia.** `<Section tone="dark">` troca as cores e marca `data-tone="dark"`, que o cabeçalho lê para escurecer junto.
- **Estilo com escopo.** Cada componente tem o próprio `<style>`; `:global()` só para elementos de componentes filhos.

## A versão do app

O botão de download e o SHA256 da seção Instalar vêm da última release do CoreBi, lida da API do GitHub **no build** (`lib/release.ts`). Se o GitHub não responder, o site usa a versão de reserva escrita no arquivo, e o build não quebra.

Para o site acompanhar cada release nova sem ninguém mexer aqui, crie um Deploy Hook na Vercel e chame-o no fim do workflow de release do CoreBi (passo a passo abaixo).

## Publicar na Vercel

1. O projeto `corebi-site` da Vercel já está ligado a este repositório (para montar de novo: entre em [vercel.com](https://vercel.com) com a conta do GitHub e importe o repositório). A Vercel reconhece o Astro sozinha; `vercel.json` já define build, saída, cabeçalhos de segurança e cache.
2. Em **Settings → Environment Variables**, crie:
   - `SITE_URL` (opcional): o endereço final. Sem ela vale `https://corebi.vercel.app`. Usado no link canônico e nas prévias de compartilhamento.
   - `GITHUB_TOKEN` (opcional): um token sem permissões extras, só para não esbarrar no limite da API do GitHub em builds seguidos.
3. Cada branch e cada PR ganham um link de prévia próprio. O `main` vai para produção.
4. **Domínio próprio:** em **Settings → Domains**, adicione o domínio e copie os registros DNS que a Vercel mostrar para o painel de onde o domínio foi comprado.
5. **Deploy a cada release do app:** em **Settings → Git → Deploy Hooks**, crie um hook para `main`. Guarde a URL como segredo `VERCEL_DEPLOY_HOOK` no repositório do CoreBi e adicione ao fim do workflow de release:

   ```yaml
   - name: Atualizar o site
     run: curl -fsS -X POST "${{ secrets.VERCEL_DEPLOY_HOOK }}"
   ```

## Qualidade

O CI (`.github/workflows/ci.yml`) roda em todo PR:

1. Prettier, ESLint, `astro check` e build.
2. Playwright em três telas (1920×1080, 1366×768 e celular), depois do build: página sem erros no console, sem rolagem lateral, todas as seções visíveis, links de download válidos, FAQ abrindo uma pergunta por vez, botão Copiar, movimento reduzido, a seta da abertura, o cabeçalho com vidro e as abas da instalação. As capturas de cada seção ficam no relatório do job.
3. Lighthouse com nota mínima de 90 em desempenho, 95 em boas práticas e 100 em acessibilidade e SEO (hoje tudo dá 100).

## Licença

[MIT](LICENSE), como o app.
