# PRD — Harada DevSystems

**Product Requirements Document | Documento de Requisitos do Produto**  
**Versão:** 1.0  
**Data de referência:** 13/11/2026  
**Produto:** Reestruturação do site/portfólio Harada DevSystems  
**Site analisado no diagnóstico:** https://harada-dev-systems.vercel.app/  
**Documento-base:** *Harada DevSystems: análise técnica e plano de reestruturação do site* (11 páginas, 13/11/2026)  
**Estado:** Especificação inicial, sujeita à conferência dos arquivos e ativos reais do repositório.

> **Convenção de rastreabilidade:** **[FONTE]** = explicitamente indicado no PDF; **[DERIVADO]** = requisito organizado a partir do diagnóstico; **[PROPOSTA]** = detalhamento de implementação/gestão a validar; **[PENDENTE]** = depende de informações ou acessos não fornecidos. O relatório é uma avaliação pontual do site; não equivale a auditoria contínua nem comprova o estado atual do repositório.

---

## 1. Visão executiva

### 1.1 Problema

[FONTE] O site analisado apresenta boa resposta de servidor, mas transmite uma impressão de incompletude: `Lorem ipsum` publicado, projetos repetidos sem links, tipografia Poppins declarada mas não carregada, CTAs do topo ocultos em telas menores, acessibilidade insuficiente e ausência de elementos básicos de SEO e compartilhamento. O próprio site funciona como prova de competência de quem oferece desenvolvimento web; erros visíveis prejudicam essa apresentação.

### 1.2 Visão de produto

Construir um site institucional/portfólio rápido, acessível, confiável e fácil de manter, com **dois caminhos claramente diferenciados**:

1. **Potenciais clientes:** compreender serviços, conferir trabalhos e entrar em contato para solicitar orçamento.
2. **Recrutadores/equipes técnicas:** avaliar projetos reais, stack, decisões técnicas, trajetória e currículo.

[FONTE] Esses caminhos devem aparecer desde a seção inicial da página `/`.

### 1.3 Proposta de valor

**Texto-guia a validar, não conteúdo já aprovado:** “Desenvolvimento web com foco em velocidade, clareza e resultados — conheça os projetos ou solicite um orçamento.”

[FONTE] O relatório sugere um posicionamento mais concreto, exemplificado por “Desenvolvedor web em Caraguatatuba. Sites rápidos e lojas virtuais para pequenos negócios”. Validar a forma de apresentação profissional, localização pública e serviços reais antes de publicar.

---

## 2. Objetivos e medidas de sucesso

| ID | Objetivo | Métrica / critério | Origem |
|---|---|---|---|
| OBJ-01 | Recuperar credibilidade e eliminar erros de apresentação | Nenhum `Lorem ipsum`, projeto falso/repetido, link quebrado ou texto provisório em produção | [FONTE] |
| OBJ-02 | Criar uma jornada para contratar serviços | CTA “Pedir orçamento” ou equivalente visível e funcional em desktop/mobile; contato direto via WhatsApp sem depender de JavaScript | [FONTE] |
| OBJ-03 | Criar jornada de avaliação técnica | Pelo menos **3 projetos reais**, cada um com página própria, papel, tecnologias, problema, solução e links disponíveis | [FONTE] |
| OBJ-04 | Maximizar experiência móvel | Testes em 360, 768, 1024 e 1440 px; CTAs não desaparecem; navegação e formulários acessíveis | [FONTE] |
| OBJ-05 | Melhorar qualidade técnica | Lighthouse **≥95** em Performance, Acessibilidade, Boas Práticas e SEO **no mobile** | [FONTE] |
| OBJ-06 | Controlar peso inicial | Página inicial com **menos de 500 KB de peso total**, conforme o relatório; validar metodologia de medição na homologação | [FONTE] |
| OBJ-07 | Tornar conteúdo encontrável e compartilhável | Títulos, descrições, canonical, OG, sitemap, robots, imagem de compartilhamento e JSON-LD conforme página | [FONTE] |
| OBJ-08 | Facilitar manutenção | Projetos gerenciados em Markdown validado no build; CI e publicação via Git/Vercel | [FONTE] |
| OBJ-09 | Instrumentar avaliação pós-lançamento | Analytics e Speed Insights ativos; leitura mensal das visitas e cliques nos contatos | [FONTE] |

**Nota [PROPOSTA]:** avaliar Lighthouse em build de produção, viewport mobile e rede simulada documentados, guardando relatórios; variabilidade entre execuções não deve ser ocultada.

---

## 3. Público, necessidades e jornadas

### 3.1 Persona A — cliente de desenvolvimento web

**Necessidade:** saber rapidamente o que é oferecido, ver provas de execução e entrar em contato com baixo atrito.  
**Percurso esperado:** `/` → `/servicos` ou projeto → `/contato` ou WhatsApp.  
**Dúvidas a resolver:** tipos de site, entregáveis, processo, tecnologias relevantes e modo de iniciar uma conversa.

### 3.2 Persona B — recrutador / avaliador técnico

**Necessidade:** analisar competência prática, profundidade de projetos e trajetória.  
**Percurso esperado:** `/` → `/projetos` → `/projetos/[slug]` → `/sobre` → currículo/GitHub/LinkedIn.

### 3.3 Princípio de comunicação

[DERIVADO] Adotar voz consistente em todo o site, sem alternância não intencional entre “desenvolvo” e “criamos”. Decidir se o protagonismo é **Diogo Harada (profissional)** ou **Harada DevSystems (marca)** e usar essa decisão nos textos. O nome Diogo Harada consta no PDF; dados biográficos e contatos ainda devem ser validados.

---

## 4. Escopo

### 4.1 MVP obrigatório — reestruturação

- [FONTE] Novo projeto usando **Astro 5**, **TypeScript**, **Tailwind CSS 4**, projetos em Markdown/Content Collections e Vercel.
- [FONTE] Rotas: `/`, `/projetos`, `/projetos/[slug]`, `/servicos`, `/sobre`, `/contato` e página 404.
- [FONTE] Página inicial com dois CTAs diferenciados, três projetos em destaque, serviços resumidos e contato.
- [FONTE] Página geral de projetos com filtro por tecnologia.
- [FONTE] Páginas individuais de projetos com problema, solução, tecnologias, participação, imagens, aprendizados e links reais existentes.
- [FONTE] Página “Sobre” com trajetória, formação, tecnologias e currículo para download, **quando os ativos correspondentes estiverem disponíveis**.
- [FONTE] Serviços: site institucional, loja virtual e landing page; publicar apenas serviços efetivamente confirmados.
- [FONTE] Contato por WhatsApp via URL `wa.me` válida, funcional sem JavaScript; redes sociais verificadas.
- [FONTE] SEO, acessibilidade WCAG AA como referência, otimização de imagens, headers de segurança, favicon e sitemap.
- [FONTE] Vercel Analytics + Speed Insights, automação de qualidade no repositório.

### 4.2 Opcional / fase posterior

- [FONTE] `/blog` com posts curtos após a publicação.
- [FONTE] Formulário com **Astro Actions + Zod + Resend**, **Cloudflare Turnstile** e honeypot.
- [FONTE] **Supabase/PostgreSQL** apenas se houver necessidade de armazenar consultas recebidas.
- [FONTE] CMS Git-based (Keystatic/Decap) caso seja necessário editar sem código.
- [FONTE] Evoluções com login, área do cliente e orçamento automático pertencem a outro escopo.

**Regra de escopo:** não implementar banco, autenticação, dashboard, CMS ou blog sem decisão explícita. A página `/contato` no MVP pode usar um CTA de WhatsApp e links de contato verificados; não apresentar formulário de envio real até existir infraestrutura funcional.

### 4.3 Correções de contenção do site existente

[FONTE] Caso o site antigo permaneça publicado durante a reconstrução, executar rapidamente, em branch separada ou alteração controlada:

1. Carregar corretamente a fonte Poppins.
2. Separar a classe de ocultação do botão do cabeçalho para não esconder os CTAs do hero no mobile.
3. Remover `id="mensagem"` duplicado.
4. Substituir padrões inválidos `<a><button>` por links semânticos estilizados.
5. Corrigir ortografia e remover textos provisórios.
6. Retirar projetos de portfólio fictícios/repetidos.
7. Adicionar favicon, description e Open Graph.
8. Adicionar rótulos acessíveis às redes e labels ao formulário.

**Observação:** esse hotfix não deve bloquear o desenvolvimento do novo site quando o lançamento for imediato e seguro.

---

## 5. Mapa de informação e requisitos por rota

| Rota | Papel | Blocos/funcionalidades mínimas | CTA principal |
|---|---|---|---|
| `/` | Porta de entrada dos dois públicos | Hero claro; duas jornadas; 3 projetos reais; resumo de serviços; contato | “Ver projetos” / “Pedir orçamento” |
| `/projetos` | Catálogo técnico | Grade responsiva; filtro por tecnologia; cards sem duplicidade; estados de filtro vazio | “Ver projeto” |
| `/projetos/[slug]` | Estudo de caso | Título; contexto/problema; solução; papel; stack; galeria; aprendizados; demo/GitHub quando disponíveis | “Ver demo” / “Código-fonte” |
| `/servicos` | Comercial | Oferta validada; processo; entregáveis; dúvidas frequentes apenas com informação real | “Solicitar orçamento” |
| `/sobre` | Perfil profissional | História; formação; conhecimentos; currículo validado; redes profissionais | “Baixar currículo” |
| `/contato` | Conversão | CTA WhatsApp sem JS; links sociais/e-mail verificados; formulário apenas na fase opcional | “Falar no WhatsApp” |
| `/404` | Recuperação de navegação | Mensagem clara; links de retorno | “Voltar ao início” |
| `/blog` | Autoridade orgânica futura | Lista de artigos e páginas de conteúdo | A definir |

### 5.1 Conteúdo mínimo dos projetos

[FONTE] O diagnóstico menciona trabalhos que merecem visibilidade: **e-commerce do CTI**, **estação/monitoramento meteorológico com IoT e Grafana**, **jogo de GameJam** e **PantryList Android/Kotlin**. Também cita uma imagem de **Cafeteria** e placeholders associados a **Tua Viagem**. Esses nomes não significam que todos possuam materiais, demonstração pública ou autorização de publicação; validar antes de criar páginas.

[DERIVADO] Para cada case, obter: nome final, resumo factual, problema, solução, responsabilidades, tecnologias, ano, imagens autorizadas, URL de demonstração (se existir), repositório (se público), aprendizados e autorização de divulgação.

---

## 6. Requisitos funcionais (RF)

| ID | Prioridade | Requisito e aceite verificável |
|---|---|---|
| RF-01 | P0 | Hero da home comunica proposta objetiva e disponibiliza os dois caminhos com links reais e nomes distintos. |
| RF-02 | P0 | Navegação semântica com um único conjunto lógico de links, adaptável a desktop/mobile. |
| RF-03 | P0 | Menu mobile é um `<button>` com `aria-expanded` e `aria-controls`; abre/fecha por clique, fecha por `Esc` e não aprisiona foco. |
| RF-04 | P0 | Home exibe **exatamente 3 projetos em destaque** selecionados a partir da coleção de projetos reais; caso faltem 3, lançamento fica com pendência explícita, sem criar projetos inventados. |
| RF-05 | P0 | `/projetos` lista projetos reais, permite filtro por tecnologia e comunica filtros sem resultado. |
| RF-06 | P0 | Cada projeto publicado tem rota estática válida, URL legível, capa otimizada e estrutura de estudo de caso. |
| RF-07 | P0 | Links externos de projetos aparecem apenas quando a URL válida estiver confirmada; nunca usar `#`, `example.com` ou URL inventada. |
| RF-08 | P0 | `/servicos` apresenta os três tipos de serviço citados no diagnóstico, após validação comercial. |
| RF-09 | P0 | `/sobre` exibe competências e trajetória verdadeiras; currículo só aparece como download quando PDF existir. |
| RF-10 | P0 | `/contato` mantém pelo menos um caminho de contato real que funcione sem JavaScript; preferencialmente WhatsApp. |
| RF-11 | P0 | Links internos não geram 404; logo leva a `/`; todos os CTAs são acessíveis também por teclado. |
| RF-12 | P0 | Página 404 personalizada oferece retorno ao início e aos projetos. |
| RF-13 | P0 | Páginas têm título e description exclusivos; compartilhamento exibe título, resumo e imagem OG. |
| RF-14 | P0 | Site disponibiliza `/robots.txt`, `/sitemap.xml`, favicon e canonical correto. |
| RF-15 | P0 | Metadados estruturados usam `Person` apenas com dados pessoais/profissionais públicos confirmados. |
| RF-16 | P1 | Analytics mede visitas e eventos de cliques de contato sem enviar texto do formulário/PII. |
| RF-17 | P1 | Conteúdo de projetos vem de Markdown versionado e é validado por esquema no build. |
| RF-18 | P1 | Header, footer, links sociais, SEO e cards são reutilizáveis; não há menu duplicado com conteúdo divergente. |
| RF-19 | P2 | Blog é ativado apenas quando houver conteúdo final aprovado. |
| RF-20 | P2 | Formulário opcional valida dados no servidor, verifica antispam, notifica por e-mail e oferece estados de sucesso/erro. |
| RF-21 | P2 | Persistência no Supabase ocorre somente mediante ativação explícita da fase de histórico. |

**P0 = requisito bloqueador do lançamento; P1 = necessário para operação consistente, preferencialmente até o lançamento; P2 = expansão opcional.**

---

## 7. Requisitos não funcionais (RNF)

### 7.1 Experiência, responsividade e acessibilidade

- **RNF-01 [FONTE]:** testar layouts em **360 px, 768 px, 1024 px e 1440 px**.
- **RNF-02 [FONTE]:** CTAs do topo continuam visíveis e utilizáveis em mobile; nenhum scroll horizontal involuntário.
- **RNF-03 [FONTE]:** foco visível por teclado (`:focus-visible`), semântica correta, links de ícone com `aria-label`, labels associados aos campos.
- **RNF-04 [FONTE]:** contraste mínimo equivalente ao nível AA; preferências `prefers-reduced-motion` respeitadas.
- **RNF-05 [FONTE]:** imagens informativas com `alt` descritivo; decorativas com `alt=""` consciente; imagens de projeto não dependem de `background-image` para seu conteúdo.
- **RNF-06 [DERIVADO]:** textos alinhados à esquerda em parágrafos extensos, sem justificação forçada.

### 7.2 Performance

- **RNF-07 [FONTE]:** Lighthouse mobile ≥95 nas quatro categorias de referência.
- **RNF-08 [FONTE]:** transferência total da home <500 KB na condição de medição documentada.
- **RNF-09 [FONTE]:** imagens tratadas pelo pipeline do Astro (WebP/AVIF conforme compatibilidade), dimensões explícitas, `lazy` em imagens fora da primeira dobra.
- **RNF-10 [DERIVADO]:** preferir HTML estático e JavaScript somente onde necessário; ícones SVG ou `astro-icon` em vez do pacote completo de Bootstrap Icons.
- **RNF-11 [DERIVADO]:** registrar e tratar regressões de CLS e recursos desnecessários.

### 7.3 SEO e distribuição

- **RNF-12 [FONTE]:** canonical absoluto, título/description próprios, OG/Twitter, sitemap e robots consistentes com o domínio selecionado.
- **RNF-13 [FONTE]:** imagem social de **1200 × 630 px** para compartilhamento.
- **RNF-14 [DERIVADO]:** utilizar `noindex` nos previews quando necessário, sem bloquear involuntariamente a produção.

### 7.4 Segurança e privacidade

- **RNF-15 [FONTE]:** configurar `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`; avaliar `X-Frame-Options`.
- **RNF-16 [FONTE]:** links `target="_blank"` com `rel="noopener noreferrer"`.
- **RNF-17 [FONTE]:** jamais colocar chaves do Resend, Turnstile ou Supabase no cliente; variáveis na Vercel quando fase 5 for ativada.
- **RNF-18 [PROPOSTA]:** minimizar dados pessoais coletados; documentar consentimento, finalidade, retenção e contato sobre privacidade antes de ativar armazenamento de leads.

### 7.5 Qualidade e operação

- **RNF-19 [FONTE]:** ESLint, Prettier, `astro check`, Lighthouse CI e GitHub Actions como controles de regressão.
- **RNF-20 [DERIVADO]:** falha de validação de conteúdo ou links críticos deve impedir merge/deploy quando automatizável.
- **RNF-21 [FONTE]:** hospedagem na Vercel, deploy por push e preview por pull request.

---

## 8. Histórias do usuário e cenários de aceite

### US-01 — Solicitar orçamento

**Como** visitante interessado em contratar, **quero** entender o serviço e acessar um contato rápido, **para** iniciar um orçamento.

**Dado** que abro a home em 360 px, **quando** olho o hero, **então** visualizo o CTA “Pedir orçamento”, consigo acioná-lo e sou direcionado para um contato válido, inclusive com JavaScript desativado.

### US-02 — Avaliar portfólio

**Como** recrutador, **quero** filtrar tecnologias e ler estudos de caso, **para** avaliar experiência prática.

**Dado** que estou em `/projetos`, **quando** seleciono “Kotlin” (se existir projeto com essa tecnologia), **então** só aparecem os projetos correspondentes; **quando** abro um projeto, vejo problema, solução, tecnologias, atuação e links disponíveis.

### US-03 — Navegar apenas com teclado

**Como** pessoa que usa teclado, **quero** acessar menu, links e CTAs com indicação de foco, **para** navegar sem mouse.

**Dado** o menu fechado, **quando** pressiono Tab/Enter, **então** consigo abri-lo; **quando** pressiono Esc, **então** ele fecha de forma previsível.

### US-04 — Compartilhar projeto

**Como** visitante, **quero** enviar o link do case pelo WhatsApp ou LinkedIn, **para** recomendar o trabalho.

**Dado** um projeto publicado no domínio principal, **quando** sua URL for inspecionada por ferramenta de compartilhamento, **então** existem título, descrição, URL canonical e imagem social válida.

### US-05 — Manter projetos

**Como** mantenedor, **quero** adicionar um `.md` com dados padronizados, **para** publicar um case sem duplicar componentes.

**Dado** o schema do conteúdo, **quando** um campo obrigatório falta, **então** o build sinaliza erro; **quando** o conteúdo está válido, **então** a listagem e a rota do projeto são geradas.

---

## 9. Restrições e decisões de produto

| Tema | Decisão |
|---|---|
| Persistência | **Sem banco no MVP** [FONTE]. |
| Arquitetura | Astro + TypeScript + Tailwind + Markdown [FONTE]. |
| Identidade visual | Preservar vínculo com identidade atual, incluindo verde `#00ff08` como possível acento, mas criar paleta coerente e verificar contraste [FONTE]. |
| Idioma inicial | Português brasileiro [DERIVADO do site e da documentação]. |
| Conteúdo | Usar informações reais e verificadas; nenhum placeholder em produção [FONTE]. |
| Contato | WhatsApp direto é obrigatório quando número for validado; formulário e armazenamento são opcionais [FONTE]. |
| Domínio próprio | Recomendado no diagnóstico, **ainda não informado/confirmado** [PENDENTE]. |
| Alternativa de stack | Next.js é citado como alternativa para foco em React/área autenticada, mas **não é a escolha inicial deste PRD** [FONTE]. |

---

## 10. Dependências e informações pendentes

**Não inventar estas informações. O desenvolvimento estrutural pode avançar com os dados existentes, mantendo tarefas pendentes fora da interface pública.**

| ID | Item | Como resolver | Impacto |
|---|---|---|---|
| DEP-01 | Nome público, cargo, cidade e proposta de valor aprovados | Confirmar conteúdo institucional | Hero, title, JSON-LD |
| DEP-02 | Público/posição principal (marca vs. profissional) | Escolher voz e hierarquia da marca | Copy e navegação |
| DEP-03 | WhatsApp, e-mail profissional, GitHub e LinkedIn reais | Verificar canais e URLs | CTAs, contato e links sociais |
| DEP-04 | Currículo PDF atualizado | Obter arquivo validado | `/sobre` |
| DEP-05 | Três a seis projetos verdadeiros com screenshots e links | Inventário de cases | Home e portfólio; **mínimo 3 para aceite final** |
| DEP-06 | Fotos profissionais e autorização de publicação | Inventariar ativos | Hero, Sobre e projetos |
| DEP-07 | Domínio próprio registrado e escolhido | Configurar DNS/Vercel | Canonical, Search Console, publicação |
| DEP-08 | Identidade e cores finais | Verificar marca atual | Design system |
| DEP-09 | Credenciais para Analytics/Speed Insights/Console | Acesso autorizado | Operação pós-deploy |
| DEP-10 | Decisão explícita de ativar formulário/Resend/Supabase | Aprovação de escopo e chaves | Apenas fase opcional |

---

## 11. Roadmap e gates

| Etapa | Conteúdo | Estimativa do PDF | Gate de saída |
|---|---|---|---|
| Contenção | Correções no site atual, se necessário | 1–2 h | Erros visíveis graves corrigidos |
| Fase 0 — Preparação | Posicionamento, inventário de 3–6 projetos, domínio, wireframe mobile | ½ dia | Dependências documentadas |
| Fase 1 — Base | Astro, TypeScript, Tailwind, fonte local, Git, Vercel, lint/prettier | 1 dia | Build e preview funcionais |
| Fase 2 — UI | Layout, menu, cards, rotas, 404, responsive | 2–3 dias | Navegação funcional nas quatro larguras |
| Fase 3 — Conteúdo | Schemas e cases Markdown, imagens, copy, currículo | 1–2 dias | Conteúdo real, sem placeholders |
| Fase 4 — Qualidade | SEO, OG, canonical, acessibilidade, performance | 1 dia | Gates técnicos aprovados |
| Fase 5 — Opcional | Formulário, antispam, Resend, Supabase | 1–2 dias | Só após aprovação; envio testado |
| Fase 6 — Publicação | Domínio, segurança, analytics, Search Console | ½ dia | Produção verificada |
| Fase 7 — Contínua | GitHub Actions, novos projetos, análise mensal | Contínua | Rotina documentada |

[FONTE] O PDF estima **7 a 10 dias de trabalho** para a reestruturação, distribuíveis em duas ou três semanas. Trata-se da estimativa do documento original, não de prazo contratual garantido.

---

## 12. Matriz de aceite para lançamento

- [ ] **AC-01:** três projetos reais com páginas individuais, tecnologias e links existentes.
- [ ] **AC-02:** zero `Lorem ipsum`, imagens repetidas como projetos diferentes, conteúdo fictício e links quebrados.
- [ ] **AC-03:** home com dois CTAs visíveis e funcionais em 360/768/1024/1440 px.
- [ ] **AC-04:** menu mobile acessível via teclado, `aria-expanded` coerente, `Esc` funcional e foco visível.
- [ ] **AC-05:** todas as quatro notas Lighthouse mobile ≥95 no build de produção.
- [ ] **AC-06:** home abaixo de 500 KB conforme medição reproduzível registrada.
- [ ] **AC-07:** OG (imagem 1200×630), description, canonical e compartilhamento testados.
- [ ] **AC-08:** favicon, robots, sitemap e página 404 disponíveis.
- [ ] **AC-09:** domínio próprio ativo e sitemap enviado ao Search Console — dependente de DEP-07.
- [ ] **AC-10:** links externos seguros; headers aplicados e testados sem quebrar a página.
- [ ] **AC-11:** CI executa lint, typecheck e controles de qualidade.
- [ ] **AC-12:** Analytics/Speed Insights habilitados e sem captura de informação pessoal sensível.
- [ ] **AC-13:** nenhuma chave exposta ao cliente ou ao Git.
- [ ] **AC-14:** URLs, conteúdo, telas e testes revisados manualmente após o deploy.

**Regra de honestidade:** se uma dependência externa impedir qualquer critério, documentar `BLOQUEADO` com causa e evidência. Não relatar o projeto como 100% aprovado enquanto critérios P0 dependentes de terceiros estiverem pendentes.

---

## 13. Riscos e mitigação

| Risco | Probabilidade/impacto | Mitigação |
|---|---|---|
| Faltarem projetos e imagens reais | Alto para conteúdo / alto | Inventário antes de publicar; não inventar casos; bloquear aceite AC-01. |
| Identidade ambígua entre recrutamento e prestação de serviços | Médio / alto | Hero com dois caminhos; voz consistente; revisão de copy. |
| Páginas pesadas pelas imagens | Médio / alto | Pipeline Astro, budgets, Lighthouse CI e imagens dimensionadas. |
| Bibliotecas e dependências mudarem de API | Médio / médio | Conferir versões existentes e documentação antes de alterar; registrar desvios do stack-base. |
| Domínio não estar disponível | Médio / alto para SEO | Manter preview; registrar bloqueio; não publicar canonical fictício. |
| Formulário gerar spam e exposição de dados | Médio / alto se ativado | Fase 5 explícita; Turnstile, honeypot, validação server-side e chaves server-only. |
| CSP bloquear scripts essenciais | Médio / médio | Testar preview e produção, alinhar diretivas aos serviços realmente utilizados. |
| Reescrita comprometer site em produção | Médio / alto | Trabalhar com branch/preview, sem excluir assets úteis; rollback por deploy Vercel. |

---

## 14. Fora de escopo explícito

- Sistema de gestão, ERP, CRM, autenticação ou área logada.
- E-commerce próprio dentro do site de portfólio.
- Geração automática de cases ou depoimentos sintéticos apresentados como reais.
- Painel de administração, migrations e PostgreSQL no MVP.
- Produção obrigatória de artigos de blog.
- Compra de domínio e provisionamento de serviços pagos sem autorização.

---

## 15. Relacionamento com os demais arquivos

- **`PDD_Harada_DevSystems.md`**: arquitetura, estruturas, contratos de conteúdo, fases técnicas, testes, segurança, deploy e rastreabilidade dos RF/RNF.
- **`PROMPT_CHAVE_Claude_Code_Harada_DevSystems.md`**: instrução operacional para que um agente trabalhe no repositório com inspeção inicial, execução incremental, validação, registro de bloqueios e entrega verificável.

**Fonte primária:** *Harada DevSystems: análise técnica e plano de reestruturação do site*, páginas 1–11, 13/11/2026. Onde o PDF apresenta exemplos (domínio, título, cabeçalhos, links e textos), este PRD não os transforma em dados confirmados.
