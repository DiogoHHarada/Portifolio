# PDD — Harada DevSystems

**Product Design & Development Document | Documento de Design Técnico e Desenvolvimento**  
**Versão:** 1.0  
**Referência:** 13/11/2026  
**Documento de produto:** `PRD_Harada_DevSystems.md`  
**Fonte:** *Harada DevSystems: análise técnica e plano de reestruturação do site* (11 páginas, 13/11/2026)  
**Objetivo:** descrever uma implementação incremental e verificável, sem presumir acesso ao código ou a credenciais não fornecidas.

> **Confiabilidade das decisões:** **[PDF]** decisão explicitada no relatório; **[DESIGN]** detalhamento técnico proposto; **[CONFIRMAR]** item dependente da inspeção do repositório, versão da ferramenta ou aprovação. Não tratar trechos deste documento como evidência de que o sistema já está implementado.

---

## 1. Arquitetura-alvo

### 1.1 Princípio arquitetural

[PDF] Construir um **site de conteúdo prioritariamente estático** com Astro, dados de projetos versionados no Git e sem banco de dados no MVP. JavaScript no navegador é exceção: apenas quando necessário para menu, filtro ou interação real.

```text
                      VISITANTE / RECRUTADOR
                                |
                          HTTPS / CDN
                                |
                       Vercel (deploy)
                                |
                    Site Astro pré-renderizado
                   +-------------------------+
                   | páginas HTML e assets   |
                   | CSS Tailwind            |
                   | JS mínimo onde preciso  |
                   +-------------------------+
                      |                |
                Content Collections    Metadados SEO
                  Markdown + Zod       sitemap/robots/OG
                      |
                  GitHub / CI

      FASE 5 OPCIONAL — somente após autorização e configuração:
       /contato → Astro Action server-side → Zod + Turnstile
                                     |              |
                                   Resend       Supabase (opcional)
                                     |
                              notificação por e-mail
```

### 1.2 Decisões de stack

| Camada | Escolha-base | Critério / observação |
|---|---|---|
| Framework | **Astro 5** [PDF] | HTML estático; roteamento por arquivos; Content Collections; imagens nativas. |
| Linguagem | **TypeScript strict** [PDF] | Tipos de componentes, utilitários e dados estruturados. |
| CSS | **Tailwind CSS 4** [PDF] | Design tokens, responsividade e consistência. |
| Fonte | **Poppins hospedada localmente** [PDF] | PDF cita `@fontsource-variable/poppins`; **confirmar existência/compatibilidade da variante** no momento da instalação; alternativa técnica é pacote estático Poppins, sem voltar a depender de link faltante. |
| Conteúdo | `.md` com esquema Zod [PDF] | Build falha para campos estruturais inválidos. |
| Ilustrações e imagens | `astro:assets` e SVG [PDF] | `<Image />` e largura/altura conhecidas; WebP/AVIF quando apropriado. |
| Ícones | SVG inline ou `astro-icon` [PDF] | Não carregar fonte global grande para poucos ícones. |
| Deploy | Vercel + previews [PDF] | CI antes de promover produção. |
| Analytics | Vercel Analytics + Speed Insights [PDF] | Ativação e teste após configurar projeto. |
| Lint/CI | ESLint, Prettier, `astro check`, GitHub Actions, Lighthouse CI [PDF] | Gates reproduzíveis. |
| Backend | **Nenhum no MVP** [PDF] | Astro Actions/Resend/Turnstile só na fase 5. |
| Banco | **Nenhum no MVP** [PDF] | Supabase/PostgreSQL somente se histórico de contatos for aprovado. |

**Alternativa considerada [PDF]:** Next.js pode ser avaliado se o objetivo principal mudar para experiência React, login ou painel, mas não deve ser introduzido sem nova decisão arquitetural.

---

## 2. Baseline, auditoria e estratégia de migração

### 2.1 Estado diagnosticado (não presumir que persiste)

[PDF, pp. 1–4] O site original tem HTML/CSS/JS sem build; `.btn-contato` ocultando ações no mobile; Poppins não importada; ID `mensagem` duplicado; `<a><button>`; `href=""` no logo; texto provisório; imagens duplicadas; links sociais sem acessibilidade; menu mobile não semântico; ausência de SEO social, sitemap, robots e favicon; imagens pesadas; falta de cabeçalhos de segurança/analytics.

### 2.2 Procedimento obrigatório antes de editar

1. Conferir diretório de trabalho (`pwd`, `git status`, `ls`, `package.json`, árvores `src/` e `public/`).
2. Identificar framework atual, scripts, branch, histórico recente e integrações existentes; **não presumir** a estrutura do diagnóstico.
3. Inventariar assets reutilizáveis, links reais, dados comerciais e textos aprovados.
4. Verificar scripts de build/test e fazer baseline do projeto atual **sem sobrescrever o código**.
5. Criar branch de implementação ou confirmar mecanismo equivalente de rollback e preview.
6. Manter um `DECISOES.md` e `PENDENCIAS.md` no repositório para registrar desvios, ativos ausentes e evidências.

### 2.3 Convivência entre versão antiga e nova

[DESIGN] Recomenda-se implementação em branch com preview Vercel; promover após checklist de aceitação. O hotfix da versão antiga é uma atividade independente e somente deve ser feito se necessário para a página atualmente pública.

---

## 3. Estrutura proposta do repositório

```text
harada-dev/
├── public/
│   ├── favicon.svg
│   ├── favicon.png                         # se houver versão raster aprovada
│   ├── apple-touch-icon.png                # asset final aprovado
│   ├── robots.txt                          # gerado/adequado ao domínio real
│   ├── og-default.png                      # 1200x630, imagem aprovada
│   └── curriculo-diogo-harada.pdf          # SOMENTE quando arquivo real existir
├── src/
│   ├── assets/
│   │   ├── projetos/                       # imagens locais reais
│   │   └── institucional/                  # fotos e identidade aprovadas
│   ├── components/
│   │   ├── Header.astro
│   │   ├── MobileMenu.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectFilters.astro             # implementação mínima
│   │   ├── ServiceCard.astro
│   │   ├── SocialLinks.astro
│   │   ├── SEO.astro
│   │   └── ContactCTA.astro
│   ├── content/
│   │   └── projetos/
│   │       ├── pantrylist.md              # criar apenas após validar dados/arte
│   │       ├── estacao-meteorologica-cti.md
│   │       ├── ecommerce-cti.md
│   │       └── cafeteria.md               # se o projeto for real/validado
│   ├── content.config.ts
│   ├── data/
│   │   ├── site.ts                         # URLs/brand/config verificadas
│   │   └── services.ts                     # copy aprovada
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projetos/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── servicos.astro
│   │   ├── sobre.astro
│   │   ├── contato.astro
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css
│   └── actions/
│       └── index.ts                         # NÃO criar no MVP; fase 5 somente
├── .github/workflows/quality.yml
├── astro.config.mjs
├── vercel.json
├── package.json
├── tsconfig.json
├── .env.example                           # sem credenciais
├── README.md
├── DECISOES.md
├── PENDENCIAS.md
├── PRD_Harada_DevSystems.md
├── PDD_Harada_DevSystems.md
└── PROMPT_CHAVE_Claude_Code_Harada_DevSystems.md
```

[DESIGN] Os nomes exatos podem ser ajustados conforme o repo atual, desde que o padrão funcional seja preservado. Arquivos como currículo, OG e projetos não devem ser preenchidos por falsificações ou placeholders publicáveis. O diretório `src/actions/` é somente ilustrativo da expansão futura.

---

## 4. Modelagem de conteúdo

### 4.1 Coleção `projetos`

[PDF] Cada projeto é um Markdown validado, contendo título, resumo, imagem de capa, tecnologias, participação, ano, destaque e links, seguido das seções “O problema”, “A solução” e “O que aprendi”.

[DESIGN] Exemplo de `src/content.config.ts` com API de Content Collections do Astro 5 (validar a sintaxe instalada antes de aplicar):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string().min(3),
      resumo: z.string().min(20).max(240),
      capa: image(),
      tecnologias: z.array(z.string().min(1)).min(1),
      papel: z.string().min(3),
      ano: z.number().int().min(2000),
      destaque: z.boolean().default(false),
      links: z.object({
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
      }).default({}),
    }),
});

export const collections = { projetos };
```

**Desvios justificados do exemplo do PDF:** URL opcional **deve ser omitida**, em vez de `demo: ""`; links vazios não passam por validação de URL e não devem criar CTAs quebrados. A coleção só deve ter arquivos de projetos verdadeiros.

### 4.2 Exemplo mínimo de frontmatter

> Exemplo de estrutura **não publicável como case real até ter conteúdo, links e imagem verificados**.

```md
---
titulo: "Nome real do projeto"
resumo: "Descrição factual, escrita depois de analisar as evidências do projeto."
capa: "../../assets/projetos/imagem-real.webp"
tecnologias: ["Tecnologia real 1", "Tecnologia real 2"]
papel: "Responsabilidade que foi efetivamente exercida"
ano: 2026
destaque: false
links:
  # github: "https://github.com/usuario/repositorio-publico"
  # demo: "https://dominio-verificado.com"
---

## O problema

Descrever o problema de forma objetiva, com contexto validado.

## A solução

Explicar a arquitetura, a execução e o resultado sem inventar métricas.

## O que aprendi

Registrar aprendizados autênticos, trade-offs e tecnologias.
```

### 4.3 Publicação e ordenação

- [DESIGN] `getCollection('projetos')` obtém os projetos em build; `getStaticPaths()` gera `/projetos/[slug]` usando o identificador de cada arquivo Markdown.
- [DESIGN] Destaques são `destaque === true`, com ordenação estável; o design deve prever quando não há 3 cases validados, sem inventar cards.
- [DESIGN] Tecnologias de filtros são derivadas das coleções (`Set` de strings normalizadas) para evitar filtro vazio ou labels divergentes.
- [DESIGN] A ordenação primária pode ser ano decrescente, sem apresentar métricas não verificadas.
- [DESIGN] Se houver imagens não autorizadas, manter o case fora da publicação até regularizar.

---

## 5. Layout, navegação e design system

### 5.1 Componentes e responsabilidades

| Componente | Responsabilidade | Requisitos ligados |
|---|---|---|
| `BaseLayout.astro` | Documento HTML, header/main/footer, estilos globais, SEO comum | RF-02, RF-18 |
| `Header.astro` | Logo linkando para `/`, navegação responsiva e CTAs | RF-01, RF-02, RF-11 |
| `MobileMenu.astro` | Botão semântico, estado de menu, teclado e Escape | RF-03, RNF-03 |
| `ProjectCard.astro` | Capa `<Image>`, título, resumo, stack, CTA de estudo de caso | RF-04, RF-05, RNF-09 |
| `ProjectFilters.astro` | Filtro por tecnologia, mensagens de estado vazio | RF-05 |
| `ServiceCard.astro` | Serviço e entregáveis reais, link de ação | RF-08 |
| `SocialLinks.astro` | Links validados, ícones SVG e `aria-label` | RF-10, RNF-03 |
| `SEO.astro` | Title, description, canonical, OG/Twitter, JSON-LD controlado | RF-13–15 |
| `ContactCTA.astro` | Link `wa.me` com texto opcional codificado corretamente | RF-10 |

### 5.2 Tokens de interface

[PDF] Acento verde atual citado: `#00ff08`; deve continuar **apenas se aprovado e com contraste adequado**.

[DESIGN] Definir em tokens:

```text
--color-bg            fundo base
--color-surface       cartões/superfícies
--color-text          texto principal
--color-muted         texto secundário com contraste AA
--color-accent        possível verde da marca, validado
--color-border        bordas e divisores
--radius-card         raio dos cards
--space-section       ritmo vertical de seções
--container-max       largura máxima do conteúdo
--focus-ring          contorno visível para teclado
```

Não atribuir valores definitivos sem verificar a identidade do site atual e a paleta real. Evitar usar verde intenso como corpo de texto sobre fundo claro sem teste de contraste.

### 5.3 Comportamento responsivo

| Viewport | Verificações mínimas |
|---|---|
| 360 px | Menu acessível; título sem corte; CTAs empilhados visíveis; cards 1 coluna. |
| 768 px | Espaçamento coerente; navegação sem sobreposição; cards adaptados. |
| 1024 px | Transição de header sem desaparecer ações; links acessíveis. |
| 1440 px | Layout contido; tipografia equilibrada; grid e imagens não distorcem. |

**Correção histórica essencial:** não reutilizar seletor que oculta ações no header para ocultar botões independentes do hero.

### 5.4 Acessibilidade na interação

- Header: `<nav aria-label="Navegação principal">`, `<button type="button" aria-controls="..." aria-expanded="...">`.
- O botão menu fecha via Esc e deve devolver foco coerentemente; `aria-expanded` acompanha o estado real.
- Não usar `<div>` clicável para ação, nem `<a><button>...`.
- CTA externo deve usar link; ação local pode usar `<button>`.
- Fornecer `focus-visible`, `prefers-reduced-motion`, labels de formulários e `alt` descritivo nas imagens de portfólio.
- Evitar elementos escondidos visualmente mas ainda alcançáveis via teclado ou anunciados incorretamente.

---

## 6. Design das páginas

### 6.1 Home `/`

1. Hero: nome/marca, posicionamento validado e dois caminhos principais.
2. Apresentação curta: especialidade e contexto sem métricas não confirmadas.
3. Três projetos em destaque (somente depois de validar 3 cases completos).
4. Serviços resumidos: institucional, e-commerce, landing page, conforme oferta real.
5. CTA final de WhatsApp/contato real.

**Regras:** nenhum CTA invisível no celular; ícones são decorativos ou nomeados, não substitutos de texto; evitar banners caros em desempenho.

### 6.2 Projetos `/projetos`

- Dados gerados pela Content Collection.
- Filtro por stack com componente de interface acessível; pode usar JavaScript leve, mantendo a listagem completa renderizada no HTML inicialmente.
- Mensagem “Nenhum projeto encontrado para este filtro” quando aplicável.
- Cards mostram nome, imagem, descrição e tecnologias; dados sem aprovação não entram em produção.

### 6.3 Projeto `/projetos/[slug]`

- Breadcrumb/navegação de retorno.
- Título, resumo, capa e metadados.
- Conteúdo Markdown com problema/solução/aprendizados.
- Galeria adicional quando existem imagens reais, responsivas e autorizadas.
- Links externos verificados e seguros; JSON-LD adicional é opcional e condicionado a semântica válida.
- SEO individual e imagem de compartilhamento, usando default aprovado apenas quando não houver imagem específica.

### 6.4 Serviços `/servicos`

- Apresentar serviços efetivos e o processo de contratação.
- Descrever entregáveis sem prometer prazos ou funcionalidades não aprovados.
- Encaminhar para canal de orçamento real.

### 6.5 Sobre `/sobre`

- História profissional factual, formação se confirmada, competências mencionadas no relatório e currículo atualizado quando recebido.
- Tecnologias citadas no diagnóstico como **candidatas a validação**: PHP, C#, Java, Python, Kotlin, MySQL, PostgreSQL e Git.
- Links sociais somente após verificação; revisar se perfil Instagram pessoal é adequado para a finalidade profissional.

### 6.6 Contato `/contato`

- MVP: WhatsApp direto sem `window.open`, podendo haver e-mail/redes verificados.
- Fase 5: formulário real server-side com estados de carregamento, sucesso e erro, antispam e política apropriada de dados.

### 6.7 404

- Página consistente com a marca, sem bloquear navegação, com links para `/` e `/projetos`.

---

## 7. SEO técnico e social

### 7.1 Metadados obrigatórios

- `<title>` único e útil por rota; home pode adotar a sugestão do PDF (“Diogo Harada | Desenvolvedor Web em Caraguatatuba”) **somente após validar nome/cidade/foco**.
- Meta `description` descritiva (sem repetição genérica).
- URL canonical absoluta usando domínio principal configurado no projeto, **nunca um domínio inventado**.
- `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, e `twitter:card=summary_large_image`.
- Imagem OG **1200×630**, arquivo real aprovado e acessível publicamente.
- `Person` JSON-LD na home com dados verdadeiros (nome, cargo, cidade se pública e `sameAs` GitHub/LinkedIn).
- Sitemap com `@astrojs/sitemap`, `robots.txt` apontando para o sitemap.
- Favicon SVG, fallback PNG, apple-touch-icon quando disponíveis.
- Cabeçalhos HTTP e resposta 404 real.

### 7.2 Regras de ambiente

- [DESIGN] `site` em `astro.config.mjs` usa variável de ambiente/propriedade de configuração confiável. Pré-produção utiliza URL verificável para build/preview; quando domínio definitivo é registrado, atualizar `site`, canonicals e sitemap.
- [DESIGN] Evitar indexação acidental de previews, sem bloquear o domínio definitivo.
- [DESIGN] Conferir status HTTP de robots/sitemap/404 e comportamento em crawler/simulador social.
- [PDF] Enviar sitemap ao Google Search Console após configurar domínio.

---

## 8. Performance e orçamento de recursos

### 8.1 Diagnóstico de origem

[PDF, p. 2–3] Principais arquivos reportados: `Cafeteria.jpg` (~573 KB), `imagem.jpg` (~479 KB), `eu - sobreMim.png` (~247 KB), `eu.png` (~160 KB); soma aproximada de **1,5 MB**. Imagens sem dimensões, ausência de `loading="lazy"` abaixo da dobra e CSS/fonte de ícones excessivos.

### 8.2 Implementação

- Usar `Image` do `astro:assets` para imagens locais; escolher formatos e `sizes` corretos.
- Reservar dimensões no layout. A imagem principal do hero deve ter prioridade apropriada; imagens fora da dobra `loading="lazy"`.
- Renomear arquivos para kebab-case, sem espaços; verificar referências antes de mover.
- Preferir SVG de ícones individuais.
- Hospedar fonte local, carregando somente estilos/pesos realmente usados; verificar o pacote compatível com Poppins.
- Manter CSS e JS mínimos; não introduzir React apenas para menu ou filtro simples.
- Definir orçamento de recursos da home **<500 KB conforme PDF**, documentar se o número é total transferido, como foi medido e as condições de cache.
- Medir Lighthouse mobile (4 categorias ≥95) em produção/preview equivalente; não garantir notas sem teste.

### 8.3 Resultado verificável

Guardar artefatos de performance com data/commit e apontar imagens/scripts causadores de regressão. Qualquer trade-off que impeça o budget deve constar no registro de pendências.

---

## 9. Segurança, deploy e cabeçalhos

### 9.1 Práticas obrigatórias

- Links externos com `target="_blank"` usam `rel="noopener noreferrer"`.
- Não colocar e-mail em locais desnecessários; avaliar redução de coleta por spam, sem tornar contato inacessível.
- Nenhum segredo em client bundle ou Git.
- Sem funções que usem `window.open` para abrir contato obrigatório.
- Aplicar headers de segurança a assets/rotas conforme compatibilidade da Vercel.

### 9.2 Esboço seguro de headers

[PDF] O relatório mostra exemplo de `vercel.json`; **não copiar a CSP literalmente sem testar**: fontes locais, Analytics/Speed Insights, Turnstile e scripts futuros precisam ser compatibilizados. O objetivo é política restritiva validada, não mero cabeçalho nominal.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

**[DESIGN]** Completar `Content-Security-Policy` depois de identificar as origens efetivamente usadas e validar suas interações. Se possível, partir de `default-src 'self'` e acrescentar as diretivas específicas que forem comprovadamente necessárias, sem abrir permissões amplas por conveniência.

### 9.3 Preview, publicação e rollback

1. GitHub → branch/PR → checks → preview Vercel.
2. Homologar conteúdo, acessibilidade, SEO e métricas antes de trocar domínio.
3. Configurar domínio real; validar DNS, TLS e redirecionamentos.
4. Atualizar canonical, OG, sitemap/robots, Search Console e perfis externos.
5. Manter rollback por deployment anterior/commit de release.
6. Documentar URL final, commit, horário e checklist de publicação.

---

## 10. Fase 5 — backend opcional (NÃO INCLUIR NO MVP)

### 10.1 Critério de ativação

Somente implementar após o mantenedor aprovar: necessidade de formulário, destinatário de notificações, provedor de envio, necessidade de armazenar contatos, tratamento de dados e acesso às credenciais.

### 10.2 Contrato proposto para o formulário

```text
Input:
  nome: string [2..100]
  email: string | vazio
  whatsapp: string | vazio
  tipo_projeto: string opcional
  mensagem: string [10..2000]
  honeypot: string (deve vir vazio)
  turnstileToken: string

Validação extra proposta:
  exigir pelo menos um contato entre email e whatsapp;
  normalizar strings e limitar tamanho;
  rejeitar token antispam inválido;
  limitar abuso/taxa conforme a plataforma.

Output público:
  success: boolean
  message: texto genérico sem dados sensíveis

Efeitos:
  (1) notificar por Resend;
  (2) opcional: persistir no Supabase com cliente server-only.
```

[PDF] A fase usa Astro Actions, Zod, Cloudflare Turnstile + honeypot e Resend. A Action exige ambiente server-side adequado na Vercel; ativar/adaptar renderização sob demanda **somente nesta fase**, preservando pré-renderização das páginas que puderem continuar estáticas.

### 10.3 Tabela `contatos` opcional

[PDF, p. 6] O modelo original sugere `id`, `nome`, `email`, `whatsapp`, `tipo_projeto`, `mensagem`, `origem`, `criado_em` e RLS habilitado. Exemplo compatível:

```sql
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 2 and 100),
  email text,
  whatsapp text,
  tipo_projeto text,
  mensagem text not null check (char_length(mensagem) between 10 and 2000),
  origem text,
  criado_em timestamptz not null default now()
);

alter table public.contatos enable row level security;
-- Nenhuma policy pública: mutações apenas no servidor autorizado.
```

**Atenção [DESIGN]:** a chave `service_role` contorna RLS e, por isso, deve permanecer **somente no servidor**, com controles de acesso, logs mínimos e sem exposição em respostas/variáveis públicas. Planejar política de retenção e exclusão antes da coleta real.

### 10.4 Variáveis de ambiente (nomes exemplificados no PDF)

```dotenv
# Preencher apenas no ambiente do provedor, sem commitar valores reais.
RESEND_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
TURNSTILE_SECRET=
```

[DESIGN] Incluir, quando necessário, variável de site URL e chave pública do widget Turnstile (publicável por definição), mas jamais publicar segredo de verificação. `SUPABASE_URL` sozinha não ativa banco; a fase é opcional.

### 10.5 Falhas e recuperação

- Falha no Resend: retornar erro amigável sem afirmar envio; registrar log técnico sem dados excessivos.
- Falha de banco quando armazenamento estiver aprovado: definir política transacional/retry e alertar mantenedor; não perder o lead silenciosamente.
- Turnstile inválido: rejeitar, sem bypass inseguro.
- Bloqueador de JS: link WhatsApp disponível como alternativa.

---

## 11. Observabilidade e indicadores

[PDF] Adotar Vercel Analytics e Speed Insights e revisar mensalmente visitas e cliques no WhatsApp.

[DESIGN] Eventos sugeridos (sem dados pessoais):

| Evento | Gatilho | Dimensões não sensíveis |
|---|---|---|
| `cta_orcamento_click` | clique CTA orçamento | rota, posição do CTA |
| `projeto_aberto` | visita a página de projeto | slug do case |
| `projeto_link_externo_click` | clique GitHub/demo | slug, tipo de link |
| `curriculo_download_click` | clique no PDF (se existir) | rota |
| `whatsapp_click` | clique no link direto | rota, posição |

Não enviar e-mail, telefone, nome, mensagem ou URL de texto pré-preenchido como parâmetros de evento. Verificar se os recursos nativos do provedor suportam instrumentação desejada antes de prometer evento implementado.

---

## 12. Testes e automação de qualidade

### 12.1 Scripts esperados

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint .",
    "format:check": "prettier --check ."
  }
}
```

**[DESIGN]** Ajustar scripts conforme ferramentas efetivamente instaladas. Garantir `@astrojs/check` se o comando `astro check` exigir, sem instalar pacote redundante.

### 12.2 Matriz de testes

| ID | Categoria | Cenário | Esperado |
|---|---|---|---|
| T-01 | Build | `npm run build` | sucesso e páginas geradas |
| T-02 | Types | `npm run check` | sem erros |
| T-03 | Lint/format | scripts respectivos | sem falhas |
| T-04 | Content | retirar campo obrigatório de case em ambiente de teste | build indica schema inválido |
| T-05 | Links | navegar rotas, 404 e links externos | sem rotas e CTAs quebrados |
| T-06 | Mobile | 360/768/1024/1440 px | ações visíveis e sem overflow |
| T-07 | A11y | teclado e Axe | foco, labels, menu, contraste e landmarks corretos |
| T-08 | SEO | inspecionar HTML de cada rota | meta, canonical, OG, JSON-LD, sitemap |
| T-09 | Social | compartilhar URL publicada/inspecionar metadados | título, imagem e descrição |
| T-10 | Performance | Lighthouse mobile em build de produção | ≥95 nas 4 categorias; home <500 KB |
| T-11 | Segurança | cabeçalhos HTTP e links externos | política presente e recursos funcionais |
| T-12 | Contato | link `wa.me` com JS desligado | canal válido e acionável |
| T-13 | Fase 5 opcional | payload inválido/antispam/resend | validação, tratamento de falhas e nenhuma chave vazada |

### 12.3 CI

[PDF] CI roda lint, `astro check` e Lighthouse CI em pull requests. [DESIGN] Fluxo recomendado:

```text
Pull request
  ├─ checkout + install lockfile
  ├─ npm run lint
  ├─ npm run format:check
  ├─ npm run check
  ├─ npm run build
  ├─ verificação de links/rotas
  └─ Lighthouse CI (preview ou servidor local configurado)
       └─ anexar resultados ao PR
```

Se um check não puder rodar pela infraestrutura atual, registrar “não executado” em vez de marcar como aprovado.

---

## 13. Plano técnico por fase e critérios de passagem

### Fase 0 — inspeção e preparação

**Entregas:** inventário do repo/assets; análise de riscos; copy e posição pendentes; 3–6 cases candidatos; decisão de domínio; wireframe mobile; baseline atual.  
**Gate:** `DECISOES.md` e `PENDENCIAS.md`, requisitos P0 compreendidos, sem alteração destrutiva.

### Fase 1 — fundação

**Entregas:** Astro/TS/Tailwind, config, tipografia local, tokens, SEO/layout básico, Git/CI e preview quando acessos existirem.  
**Gate:** build e lint/typecheck executáveis, README de ambiente.

### Fase 2 — layout e páginas

**Entregas:** header único, menu correto, home, projetos, detalhe, serviços, sobre, contato, 404, cartões e responsividade.  
**Gate:** testes manuais de viewport, navegação por teclado e links internos.

### Fase 3 — conteúdo

**Entregas:** Content Collection + Zod, projetos comprovados, fotos otimizadas, textos revisados, currículo real (se entregue).  
**Gate:** nenhum placeholder e mínimo de 3 cases para considerar o produto final pronto.

### Fase 4 — qualidade

**Entregas:** metadados, OG, Person JSON-LD verificado, robots/sitemap, ícones, acessibilidade, headers e Lighthouse.  
**Gate:** checks AC do PRD; evidências da medição.

### Fase 5 — backend opcional

**Entregas:** formulário com Zod/Turnstile/honeypot, envio Resend e histórico Supabase se autorizado.  
**Gate:** testes seguros de envio real e tratamento de erros; **não bloquear MVP se fase não autorizada**.

### Fase 6 — produção

**Entregas:** domínio próprio, redirecionamento da URL anterior quando acordado, DNS/HTTPS, Search Console, Analytics, Speed Insights, documentação de release.  
**Gate:** auditoria pós-deploy e rollback disponível.

### Fase 7 — evolução

**Entregas:** CI sustentável, processo para novo case Markdown, revisão mensal dos indicadores.  
**Gate:** README operacional e responsáveis definidos.

**Estimativa de referência [PDF]:** 7–10 dias de trabalho ao todo; não interpretar como compromisso sem acesso a ativos, disponibilidade de domínio ou aprovação da identidade.

---

## 14. Mapeamento dos requisitos do PRD para implementação

| Requisitos | Arquivos/entregas | Evidência |
|---|---|---|
| RF-01, RF-08 | `index.astro`, `servicos.astro`, `ContactCTA` | revisão dos CTAs mobile e links |
| RF-02, RF-03, RF-11, RF-12 | `Header`, `MobileMenu`, `404.astro` | navegação teclado/rotas |
| RF-04–07, RF-17 | `content.config.ts`, `content/projetos/*.md`, listagem, `[slug].astro` | build, filtro, 3 cases reais |
| RF-09–10 | `sobre.astro`, `contato.astro` | currículo existente, contato válido |
| RF-13–15, RNF-12–14 | `SEO.astro`, `astro.config.mjs`, OG, robots, sitemap | teste de metadados e share |
| RNF-01–06 | Tailwind/tokens, layouts, components | 4 viewports + Axe + teclado |
| RNF-07–11 | assets otimizados e pipeline Astro | relatório Lighthouse e peso |
| RNF-15–18 | `vercel.json`, links, env server-only | inspeção HTTP e bundle |
| RNF-19–21, RF-16 | workflows, Vercel | logs CI, preview e métricas |
| RF-20–21 | `actions/index.ts`, antispam, Resend, Supabase | apenas fase opcional, testes de envio |

---

## 15. Decisões em aberto — não preencher automaticamente

1. **Conteúdo:** quais cases possuem provas, screenshots e repositórios públicos? O PDF cita possibilidades, não confere todos os dados necessários.
2. **Marca:** “Harada DevSystems” como empresa ou “Diogo Harada” como identidade central? Manter as duas trilhas, mas escolher linguagem e hierarquia.
3. **Imagem:** logo, fotos e OG aprovados. Não gerar foto realista ou material de portfólio fictício para encobrir lacunas.
4. **Domínio:** URL final ainda não comprovada; o domínio citado no relatório é um **exemplo**, não um registro verificado.
5. **WhatsApp:** número e mensagem predefinida precisam ser fornecidos/confirmados.
6. **Currículo:** só exibir download se PDF estiver no repositório.
7. **Fonte:** verificar a variante correta de Poppins compatível com Astro/Fontsource.
8. **Fase 5:** autorizar separadamente formulário, e-mail e Supabase; confirmar rotina de privacidade.
9. **Analytics/Console:** ativação depende de conta/projeto e permissão do mantenedor.

---

## 16. Definition of Done (DoD) e handoff

Uma implementação só pode ser reportada como **concluída** quando:

- [ ] Arquivos modificados e dependências estão documentados.
- [ ] Requisitos P0 estão atendidos sem conteúdo falso.
- [ ] `npm run build`, `npm run check` e `npm run lint` passaram (ou impedimentos foram explicitados).
- [ ] Navegação por teclado e mobile foi realmente testada.
- [ ] Nenhum link `#` é usado para simular um CTA não funcional.
- [ ] Evidências SEO/OG/robots/sitemap/canonical foram conferidas.
- [ ] Lighthouse e budget da home foram aferidos e anexados, ou marcados como não verificados.
- [ ] Credenciais não aparecem no código cliente, logs públicos ou commits.
- [ ] Deploy preview e produção são identificados corretamente; não afirmar publicação se não houve deploy.
- [ ] Pendências têm próxima ação concreta e responsável sugerido.
- [ ] A fase 5 opcional não foi executada silenciosamente.

**Entrega do agente:** resumo do que mudou; mapa dos arquivos; comandos e saídas relevantes; URLs efetivamente verificadas; decisões técnicas; itens ainda pendentes; riscos; próximos passos.

---

## 17. Referências e limites

**Documento primário:** *Harada DevSystems: análise técnica e plano de reestruturação do site* (11 páginas, datado de 13/11/2026).  
**Complemento interno:** `PRD_Harada_DevSystems.md`.

As especificações de estrutura, ensaios de código, critérios extras de qualidade, eventos analíticos e comandos são **propostas de desenho técnico**, não afirmações extraídas literalmente do PDF. A inspeção do repositório e a verificação da versão efetivamente instalada têm precedência sobre exemplos de API deste documento.
