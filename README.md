# Harada DevSystems — portfólio de Diogo Harada

Site institucional e portfólio com dois caminhos: **clientes** (serviços → orçamento pelo WhatsApp) e **recrutadores** (projetos → estudos de caso → trajetória e currículo).

- **Stack:** Astro 7 · TypeScript strict · Tailwind CSS 4 · Content Collections (Markdown + Zod) · `astro:assets` · fontes locais via Fontsource (Instrument Serif, Geist Sans, JetBrains Mono) · Vercel
- **Sem backend e sem banco** no MVP. Todas as páginas são HTML estático.
- Especificações: [`PRD_Harada_DevSystems.md`](PRD_Harada_DevSystems.md), [`PDD_Harada_DevSystems.md`](PDD_Harada_DevSystems.md). Decisões: [`DECISOES.md`](DECISOES.md). Pendências: [`PENDENCIAS.md`](PENDENCIAS.md). Evidências de testes: [`docs/qualidade.md`](docs/qualidade.md).

## Requisitos

- **Node.js ≥ 22.23.4** (recomendado **24 LTS**, ver `.nvmrc`). Versões anteriores são recusadas pelo Astro 7.
- npm 10+.

## Comandos

| Comando               | O que faz                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm install`         | Instala as dependências (use `npm ci` no CI).                                                                 |
| `npm run dev`         | Servidor de desenvolvimento em `http://localhost:4321`.                                                       |
| `npm run build`       | Build de produção em `dist/`.                                                                                 |
| `npm run preview`     | Serve o `dist/` localmente.                                                                                   |
| `npm run check`       | `astro check` (TypeScript strict + validação de conteúdo).                                                    |
| `npm run lint`        | ESLint, incluindo regras de acessibilidade (jsx-a11y).                                                        |
| `npm run format`      | Formata com Prettier (`format:check` só verifica).                                                            |
| `npm run verify:dist` | Verifica o build: links internos, títulos/descrições únicos, canonical, OG, alt, CSP, 3 cases e peso da home. |
| `npm run validate`    | Tudo acima, em sequência. **Rode antes de cada commit.**                                                      |

## Estrutura

```text
public/                       arquivos servidos como estão (favicon, OG, currículo, manifest)
src/
  assets/institucional/       logo e fotos (otimizados no build)
  assets/projetos/            capas e imagens dos cases
  components/                 Header, MobileMenu, Footer, ProjectCard, ProjectFilters,
                              ServiceCard, SocialLinks, SEO, ContactCTA, Icon, AnalyticsEvents
  content/projetos/*.md       um arquivo por estudo de caso
  content.config.ts           schema Zod da coleção "projetos"
  data/site.ts                marca, contatos, redes, navegação (dados verificados)
  data/services.ts            serviços e processo
  data/perfil.ts              formação, experiência, competências
  layouts/BaseLayout.astro    HTML base, SEO, fontes, analytics opcional
  lib/projetos.ts             ordenação, destaques e opções do filtro
  pages/                      /, /projetos, /projetos/[slug], /servicos, /sobre, /contato, 404, robots.txt
  styles/global.css           tokens de design (cores, raio, foco) e componentes base
scripts/verify-dist.mjs       verificação estática do build
vercel.json                   headers de segurança (CSP etc.), cache e redirects
lighthouserc.json             orçamento do Lighthouse CI (≥ 95 nas 4 categorias, CLS ≤ 0,1)
.github/workflows/quality.yml CI em pull requests e na main
```

## Como adicionar um novo projeto

1. Coloque as imagens reais em `src/assets/projetos/` com nomes em kebab-case (ex.: `meu-projeto-capa.png`). Capa em proporção 16:10, idealmente ≥ 1200 px de largura.
2. Crie `src/content/projetos/meu-projeto.md` (o nome do arquivo vira a URL `/projetos/meu-projeto`):

   ```md
   ---
   titulo: 'Nome do projeto — descrição curta'
   resumo: 'Entre 20 e 240 caracteres, factual.'
   capa: '../../assets/projetos/meu-projeto-capa.png'
   capaAlt: 'Descreva o que aparece na imagem.'
   tecnologias: ['PHP', 'MySQL']
   papel: 'O que você realmente fez'
   contexto: 'Projeto acadêmico · Instituição'
   ano: 2026
   destaque: false # true para aparecer na home (exatamente 3 destaques)
   ordem: 10 # ordem entre os destaques (menor primeiro)
   links:
     github: 'https://github.com/usuario/repo' # omita se não existir
     demo: 'https://...' # omita se não existir — nunca use "" ou "#"
   galeria: # opcional
     - imagem: '../../assets/projetos/meu-projeto-tela.png'
       alt: 'Descrição da tela.'
       legenda: 'Opcional.'
   ---

   ## O problema

   ## A solução

   ## O que aprendi
   ```

3. Rode `npm run validate`. O build **falha** se faltar campo obrigatório, se uma URL não for `https`, se houver campo desconhecido ou se a home não tiver exatamente 3 destaques.

## Variáveis de ambiente

Nenhuma é obrigatória. Veja `.env.example`.

| Variável                   | Onde                | Efeito                                                                                                                                  |
| -------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                 | Vercel (Produção)   | Domínio usado em canonical, OG, sitemap e robots. Padrão: `https://harada-dev-systems.vercel.app`.                                      |
| `VERCEL_ENV`               | Automática (Vercel) | `preview` ⇒ `noindex` em todas as páginas e `robots.txt` com `Disallow: /`.                                                             |
| `ANALYTICS_ENABLED`        | Vercel              | `true` ⇒ inclui Web Analytics e Speed Insights. **Habilite-os no painel antes**, senão geram 404.                                       |
| `ANALYTICS_EVENTS_ENABLED` | Vercel              | `true` ⇒ envia eventos de clique (orçamento, WhatsApp, currículo, links de projeto) sem dados pessoais. Requer plano com Custom Events. |

Nunca crie variáveis com segredo usando o prefixo `PUBLIC_`.

## Deploy (Vercel)

1. Conecte o repositório GitHub ao projeto na Vercel (o framework Astro é detectado; `vercel.json` já define build e saída).
2. Em **Settings → Environment Variables**, configure as variáveis acima conforme necessário.
3. Abra um pull request: a Vercel gera um **preview** (com `noindex`) e o GitHub Actions roda lint, tipos, build, `verify:dist` e Lighthouse CI.
4. Checklist antes de promover para produção:
   - [ ] CI verde no PR.
   - [ ] Navegar no preview em celular: menu, CTAs “Pedir orçamento” e “Ver projetos”, filtro de projetos, links de WhatsApp/GitHub/demo, download do currículo.
   - [ ] `curl -I <url-do-preview>` mostra `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
   - [ ] Console do navegador sem erros.
5. Faça o merge na `main` → deploy de produção. Depois: Lighthouse mobile na URL real, teste de compartilhamento (WhatsApp/LinkedIn) e envio do sitemap ao Search Console.

### Rollback

No painel da Vercel → **Deployments**, escolha o deploy anterior e use **Instant Rollback** (ou **Promote to Production**). No Git, prefira `git revert <commit>` a reescrever o histórico.

## Manutenção mensal (roteiro)

1. **Analytics:** visitas por página, origem do tráfego e (se ativo) eventos `cta_orcamento_click`, `whatsapp_click`, `curriculo_download_click`, `projeto_link_externo_click`.
2. **Contatos:** quantas conversas vieram do WhatsApp/e-mail no mês; ajuste de textos se a conversão cair.
3. **Performance:** Speed Insights (LCP, CLS, INP reais) e um Lighthouse mobile na home; investigar se alguma nota ficar < 95.
4. **Conteúdo:** novos projetos, currículo atualizado, links externos funcionando.
5. **Dependências:** `npm outdated` e `npm audit`; atualizar em branch própria e rodar `npm run validate`.

## Licença

MIT — ver [`LICENSE`](LICENSE).
