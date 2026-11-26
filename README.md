# CoreBi · site

Site oficial do [CoreBi](https://github.com/GabrielAngelimm/CoreBi), o app para Windows que monitora, testa e cuida do PC num app só.

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
│   │   ├── hero/     abertura com o mostrador e as peças em órbita
│   │   ├── features/ os blocos de "Do sensor ao jogo", um componente por bloco
│   │   └── ...       about, stress-test, drivers, apps, install-steps, faq, final
│   └── ui/           peças pequenas reutilizadas (botão, ícone, bolha, logo...)
├── data/             textos e números das seções, tipados
├── config/site.ts    nome, links e menu: tudo que aparece em mais de um lugar
├── lib/              funções puras usadas no build (release, geometria, formatos)
├── scripts/          utilidades do navegador (entrada ao rolar, copiar, animação)
├── styles/           tokens de design, base global e keyframes
└── assets/           imagens otimizadas pelo Astro (ícones dos apps)
```

Regras que o projeto segue:

- **Conteúdo fora da marcação.** Textos, listas e números ficam em `src/data/` e `src/config/`. Para mudar uma pergunta do FAQ, mexa só em `data/faq.ts`.
- **Cores e medidas só por token.** `styles/tokens.css` define cores (uma por peça, como no app), fontes, raios, sombras e curvas de movimento. Componentes não usam valores soltos; a única exceção são o preto e o branco das máscaras, que valem como transparência e não como cor.
- **Geometria no build.** Arcos, marcas do mostrador e posições em órbita são calculados em `lib/geometry.ts` durante o build. O navegador recebe o SVG pronto.
- **Animação só quando aparece.** `scripts/motion.ts` pausa os laços fora da tela ou com a aba escondida, e tudo respeita `prefers-reduced-motion`.
- **Cada seção na sua pasta.** O componente (`Apps.astro`) e o script que roda no navegador (`apps.client.ts`) ficam juntos. O sufixo `.client.ts` separa o que vai para o navegador dos dados em `src/data/`, que só existem no build.
- **Estilo com escopo.** Cada componente tem o próprio `<style>`; `:global()` só para elementos de componentes filhos.

## A versão do app

O botão de download e o SHA256 da seção Instalar vêm da última release do CoreBi, lida da API do GitHub **no build** (`lib/release.ts`). Se o GitHub não responder, o site usa a versão de reserva escrita no arquivo, e o build não quebra.

Para o site acompanhar cada release nova sem ninguém mexer aqui, crie um Deploy Hook na Vercel e chame-o no fim do workflow de release do CoreBi (passo a passo abaixo).

## Publicar na Vercel

1. Entre em [vercel.com](https://vercel.com) com a conta do GitHub e importe este repositório. A Vercel reconhece o Astro sozinha; `vercel.json` já define build, saída, cabeçalhos de segurança e cache.
2. Em **Settings → Environment Variables**, crie:
   - `SITE_URL`: o endereço final, por exemplo `https://corebi.com.br`. Usado no link canônico e nas prévias de compartilhamento.
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
2. Playwright em três telas (1920×1080, 1366×768 e celular): página sem erros no console, sem rolagem lateral, todas as seções visíveis, link de download válido, FAQ abrindo uma pergunta por vez, botão Copiar e movimento reduzido. As capturas de cada seção ficam no relatório do job.
3. Lighthouse com nota mínima de 90 em desempenho e 100 em acessibilidade, boas práticas e SEO.

## Licença

[MIT](LICENSE), como o app.
