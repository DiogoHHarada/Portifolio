# Evidências de qualidade

> Atualização: após o redesenho visual (docs/design.md), Lighthouse mobile local de `/`, `/projetos`, `/sobre` e `/contato` ficou em 98–100 (Performance) e 100 nas demais categorias, CLS 0. A tabela abaixo é da versão anterior do visual e deve ser remedida.

Medições **locais** no build de produção (`npm run build` + `astro preview`), em 14/11/2026, branch `feat/reestruturacao-astro` (alterações ainda não commitadas). **Produção na Vercel ainda não foi medida** (ver `PENDENCIAS.md`, P-12).

Ambiente: Windows 11, Node.js 24.22.3, Chrome 157, Lighthouse 12.8.2 (configuração padrão **mobile**: emulação Moto G Power, throttling simulado de 4G lento).

## Lighthouse mobile (execução individual por rota)

| Rota                   | Performance | Acessibilidade | Boas práticas | SEO | LCP   | CLS   | TBT  | Peso transferido |
| ---------------------- | ----------- | -------------- | ------------- | --- | ----- | ----- | ---- | ---------------- |
| `/`                    | 100         | 100            | 100           | 100 | 1,4 s | 0     | 0 ms | 114 KiB          |
| `/projetos`            | 100         | 100            | 100           | 100 | 1,7 s | 0     | 0 ms | 105 KiB          |
| `/projetos/devcoffee`  | 100         | 100            | 100           | 100 | 1,7 s | 0     | 0 ms | 253 KiB          |
| `/projetos/wrist-wear` | 100         | 100            | 100           | 100 | 1,4 s | 0,008 | 0 ms | 134 KiB          |
| `/projetos/atmovision` | 100         | 100            | 100           | 100 | 1,2 s | 0     | 0 ms | 57 KiB           |
| `/servicos`            | 100         | 100            | 100           | 100 | 1,1 s | 0     | 0 ms | 44 KiB           |
| `/sobre`               | 100         | 100            | 100           | 100 | 1,4 s | 0     | 0 ms | 58 KiB           |
| `/contato`             | 100         | 100            | 100           | 100 | 1,2 s | 0     | 0 ms | 51 KiB           |

Repetibilidade: `/` e `/projetos` medidos 3 vezes seguidas → 100/100/100/100 nas três, CLS 0.

### Lighthouse CI (`npx @lhci/cli@0.16.1 autorun`, mesma configuração do GitHub Actions)

`lighthouserc.json`: 6 URLs × 3 execuções = 18 relatórios, servidos a partir de `dist/`. **Todas as asserções passaram** (≥ 0,95 nas quatro categorias, CLS ≤ 0,1, peso ≤ 500 KB). Execução representativa de cada URL:

| URL                         | Performance | Acessibilidade | Boas práticas | SEO |
| --------------------------- | ----------- | -------------- | ------------- | --- |
| `/index.html`               | 100         | 100            | 100           | 100 |
| `/projetos.html`            | 100         | 100            | 100           | 100 |
| `/projetos/atmovision.html` | 100         | 100            | 100           | 100 |
| `/servicos.html`            | 100         | 100            | 100           | 100 |
| `/sobre.html`               | 100         | 100            | 100           | 100 |
| `/contato.html`             | 100         | 100            | 100           | 100 |

Os relatórios HTML/JSON ficam em `.lighthouseci/` (ignorado pelo Git; no CI são anexados como artefato).

Histórico da correção de CLS: primeira medição tinha `/` com Performance 96 (CLS 0,124) e `/projetos` com 93 (CLS 0,16), causados pela troca da fonte e pelo filtro surgindo após o JS. Corrigido com preload dos woff2, fallback com métricas ajustadas e `@media (scripting: none)`.

## Peso da home (RNF-08, orçamento < 500 KB)

- Lighthouse (transferido): **114 KiB**.
- `npm run verify:dist` (cenário pessimista, sem compressão e com o maior candidato de cada `srcset`): **~155 KB**.

## Testes de interface (Chrome headless via puppeteer-core)

57 de 58 verificações passaram; a única “falha” é o próprio log do Chrome para o **status 404 intencional** das rotas inexistentes testadas (comportamento esperado).

- Sem rolagem horizontal em `/`, `/projetos`, `/projetos/atmovision`, `/servicos`, `/sobre`, `/contato` e 404, em **360, 768, 1024 e 1440 px**.
- CTAs “Pedir orçamento” e “Ver projetos” visíveis nas quatro larguras.
- Menu mobile: alcançável por Tab, foco visível, Enter abre (`aria-expanded=true`), Tab seguinte entra no primeiro link, Esc fecha e devolve o foco ao botão.
- Sem JavaScript: link “Menu” leva à navegação do rodapé; CTA de orçamento é link real; WhatsApp em `/contato` é `wa.me` direto; todos os projetos listados e filtro oculto.
- Filtro: Laravel → só AtmoVision; PHP → 2 projetos; “Todas” → 3; `aria-pressed` coerente; mensagem de status anunciada.
- Case: seções “O problema”, “A solução”, “O que aprendi”; links de demo/GitHub reais; case sem demo não exibe botão de demo.
- 404 com status HTTP 404 e links para `/` e `/projetos`.
- Poppins carregada a partir de arquivos locais; todas as imagens carregam após rolagem.

## Cabeçalhos de segurança e CSP

`dist/` servido com os headers do `vercel.json` aplicados (servidor Node local) e aberto no Chrome em 9 rotas: **0 violações de CSP**; `Content-Security-Policy`, `X-Frame-Options: DENY` e `X-Content-Type-Options: nosniff` presentes; menu (JS), fontes e imagens funcionando. A aplicação real dos headers pela Vercel só pode ser confirmada após o deploy.

## Validação de conteúdo (T-04)

Um `.md` de teste sem `papel` e com `demo: ''` fez o build falhar com `InvalidContentEntryDataError` (`papel: Required`, `links.demo: Invalid URL`). Arquivo removido em seguida.

## Checks estáticos

- `npm run lint` — 0 problemas (33 regras jsx-a11y ativas em `.astro`).
- `npm run format:check` — sem pendências.
- `npm run check` — 0 erros, 0 avisos.
- `npm run build` — 9 páginas.
- `npm run verify:dist` — todas as verificações passaram.
- `npm audit` — 0 vulnerabilidades (produção e desenvolvimento).
- Busca por padrões de segredo em `src/`, `public/`, `dist/`, configs e workflows — nada encontrado.

## Contraste (tokens em `src/styles/global.css`)

| Par                           | Razão   |
| ----------------------------- | ------- |
| Texto `#f5f5f5` / `#000`      | 19,26:1 |
| Secundário `#a3a3a3` / `#000` | 8,33:1  |
| Secundário / card `#121212`   | 7,43:1  |
| Secundário / chip `#1a1a1a`   | 6,90:1  |
| Acento `#00ff08` / `#000`     | 15,31:1 |
| Preto sobre acento (botão)    | 15,31:1 |

## Não executado

- Lighthouse, headers e compartilhamento social **na URL publicada** (não houve deploy).
- Teste com leitor de tela (NVDA/VoiceOver).
- GitHub Actions (o workflow existe, mas nada foi enviado ao GitHub).
