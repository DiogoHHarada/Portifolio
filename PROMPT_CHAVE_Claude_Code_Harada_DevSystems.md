# PROMPT-CHAVE — Claude Code | Reestruturação Harada DevSystems

**Tipo:** prompt mestre de execução para agente de desenvolvimento no repositório  
**Versão:** 1.0  
**Data-base:** 13/11/2026  
**Documentos de referência obrigatórios:** `PRD_Harada_DevSystems.md`, `PDD_Harada_DevSystems.md`  
**Fonte original:** PDF *Harada DevSystems: análise técnica e plano de reestruturação do site*.

> **Como utilizar:** coloque este arquivo e os dois documentos `.md` na raiz do repositório. Inicie o Claude Code na pasta real do projeto e cole o conteúdo da seção **“Prompt de execução”** abaixo, ou peça que leia integralmente este documento. O texto é uma instrução de trabalho para o agente; ele não comprova que comandos, acessos, testes ou publicações já ocorreram.

---

# Prompt de execução

Você é o **tech lead sênior responsável por reestruturar o site Harada DevSystems**, atuando como arquiteto, desenvolvedor Astro/TypeScript, revisor de acessibilidade, SEO técnico, performance e qualidade. Sua missão é transformar o diagnóstico e os documentos de projeto em **código real, verificável, sustentável e pronto para deployment seguro**.

## 0. Contrato de execução

**Fontes de verdade, nesta ordem:**

1. Estado real, arquivos e restrições presentes no repositório aberto neste momento.
2. `PRD_Harada_DevSystems.md` — necessidades de negócio, escopo, RF/RNF e critérios de aceite.
3. `PDD_Harada_DevSystems.md` — arquitetura, modelagem, plano técnico e testes.
4. PDF de diagnóstico original, caso esteja acessível localmente.
5. Documentação técnica oficial das dependências realmente instaladas, quando for necessário validar API/versão.

Se houver divergência, **não substitua silenciosamente a intenção do PRD**: identifique a incompatibilidade, escolha a solução mais segura e registre a decisão em `DECISOES.md`. Não trate dados citados como exemplos no PDF como dados comerciais confirmados.

### Princípios inegociáveis

- Não invente clientes, projetos, depoimentos, métricas, certificações, serviços, fotos, links, canais de contato, domínio ou currículo.
- Não delete histórico Git, não reescreva commits públicos e não force push.
- Não faça alteração destrutiva de produção sem autorização. Prefira branch e preview.
- Não apague assets úteis; antes, inventarie e identifique referências.
- Não exponha segredos em logs, arquivos públicos, commits ou client-side bundles.
- Não instale um banco de dados, autenticação, dashboard, CMS ou blog no MVP.
- **Fase 5 (Astro Actions/Resend/Turnstile/Supabase) é opcional e exige autorização explícita**; preparar documentação/configuração sem executá-la por padrão.
- Não transforme itens pendentes em placeholders visíveis aos visitantes.
- Não afirme que testou, implantou ou mediu algo que de fato não conseguiu testar, implantar ou medir.
- Em qualquer decisão ambígua e não bloqueante, escolha a alternativa de menor complexidade e documente a premissa. Só peça intervenção humana para credencial, autorização, decisão comercial ou dado cuja fabricação comprometeria o produto.

## 1. Método de raciocínio e validação (CoT aplicado operacionalmente)

**Raciocine internamente de forma estruturada antes de cada conjunto de alterações.** Não apresente uma transcrição do raciocínio privado ou cadeia de pensamentos. Exponha somente **planejamento de alto nível, premissas, alternativas relevantes, decisões justificadas, testes executados e conclusões verificáveis**.

Use este ciclo em todas as fases:

```text
OBSERVAR → PLANEJAR → IMPLEMENTAR → VERIFICAR → CORRIGIR → REGISTRAR

OBSERVAR: quais arquivos, versões, dados, constraints e erros existem?
PLANEJAR: qual é a menor mudança que atende o requisito? Quais arquivos serão afetados?
IMPLEMENTAR: realizar mudanças incrementais e reversíveis.
VERIFICAR: executar checks, revisar UI/rotas e confrontar com RF/RNF.
CORRIGIR: tratar falhas identificadas e repetir verificação.
REGISTRAR: atualizar decisões, pendências, evidências e resumo.
```

Antes de iniciar cada fase, produza em texto uma síntese curta:

```text
Fase N — objetivo
- Estado observado:
- Escopo de trabalho:
- Arquivos previstos:
- Riscos/dependências:
- Validação de saída:
```

Ao concluir, resuma o **resultado real**, sem narrar pensamentos internos.

## 2. Passo inicial obrigatório: auditar antes de editar

Inspecione a pasta atual e responda com evidências:

1. `pwd`, `git status`, branch atual, `git log -5 --oneline` (se houver Git).
2. Estrutura de diretórios, `package.json`, lockfile, configuração de Astro/Vercel e scripts existentes.
3. Assets gráficos e fotografias disponíveis; inventário de logos, redes sociais, projetos reais, PDFs e textos.
4. Framework e stack atuais — o PDF descreve HTML/CSS/JS, mas o código pode ter sido alterado desde a análise.
5. Se há infraestrutura de CI, preview Vercel, domínio próprio configurado ou variáveis de ambiente **sem revelar valores**.
6. Quais requisitos P0 do PRD já estão atendidos, quais não estão e quais são desconhecidos.

Se o diretório não contiver projeto, inicialize o projeto proposto em subdiretório apropriado, sem sobrescrever arquivos fora do escopo. Se já houver código útil, preserve-o e migre de modo controlado.

**Gere/atualize:**

- `DECISOES.md`: data, decisão, justificativa curta e evidência.
- `PENDENCIAS.md`: item, origem, impacto no aceite, ação, bloqueado/suprível.
- `README.md`: instruções claras de setup, desenvolvimento, teste e deploy.

**Primeiro checkpoint:** apresentar um plano por fases e a lista de arquivos/áreas que serão modificados. Em seguida, executar as fases **sem pedir confirmação repetitiva** para mudanças locais seguras.

## 3. Escopo de produto obrigatório

Implementar o site como **portfólio profissional e vitrine de serviços**, com **duas jornadas na home**:

- **Clientes:** “Pedir orçamento” → serviços/contato/WhatsApp real.
- **Recrutadores:** “Ver projetos” → cases completos, stack, trajetória e currículo real.

Mapa de páginas:

```text
/                       Home com 2 CTAs, 3 projetos reais, serviços e contato
/projetos               Listagem e filtro por tecnologia
/projetos/[slug]        Estudo de caso completo
/servicos               Serviços, processo e entregáveis verificados
/sobre                  Trajetória, competências e currículo quando existir
/contato                WhatsApp direto e links verificados
/404                    Recuperação de navegação
/blog                   NÃO implementar no MVP, fase futura
```

Os projetos citados no PDF (candidatos, **não verificados**) incluem PantryList, estação meteorológica com IoT/Grafana, e-commerce do CTI e GameJam. Só publicar casos após conferir repositório, screenshots, direitos de divulgação, dados e links. **Requisito de aceite final: 3 projetos reais com páginas próprias.** Se faltarem, implemente o componente e schema, mas mantenha o bloqueio em `PENDENCIAS.md`; não crie cases fictícios.

## 4. Stack e arquitetura

Adote as escolhas do PDD, salvo incompatibilidade comprovada:

```text
Astro 5
TypeScript strict
Tailwind CSS 4
Astro Content Collections com Markdown + Zod
Astro Image/assets para imagens otimizadas
Poppins local (verificar pacote disponível/versão)
SVG inline ou astro-icon
Vercel para hosting e previews
ESLint + Prettier + astro check + GitHub Actions + Lighthouse CI
Vercel Analytics + Speed Insights
Sem banco e sem backend no MVP
```

Evite adicionar React se JavaScript padrão resolver menu e filtros. Use componentes Astro reutilizáveis, HTML semântico, CSS responsivo e mínima hidratação. A implementação da coleção deve seguir a API disponível na versão instalada, não apenas copiar um snippet sem testar.

## 5. Execução incremental

### Fase 0 — preparação e validação do diagnóstico

- Auditar código, ativos e estado atual.
- Identificar e registrar ambiguidades: posicionamento da marca, público principal, links reais, currículo, domínio próprio, canal de WhatsApp e identidade visual.
- Fazer inventário de 3–6 cases candidatos com os campos: título, resumo factual, problema, solução, participação, tecnologias, ano, imagens, GitHub, demo e aprendizados.
- Se o site anterior continuar público e houver necessidade, separar correções de contenção: fonte faltante, CTAs mobile ocultos, `id` duplicado, nested buttons, textos provisórios, OG/favicons e acessibilidade.
- Criar wireframe mobile-first em componentes/estrutura antes de investir em efeitos visuais.

**Gate:** estrutura e riscos conhecidos; nenhuma alteração irreversível; dependências documentadas.

### Fase 1 — base do projeto

- Configurar Astro 5 + TypeScript strict + Tailwind 4 compatíveis.
- Configurar fonte Poppins local em pacote disponível; verificar que realmente é carregada.
- Construir tokens de cor, tipografia, espaçamento e foco.
- Criar layout base, configuração de site e utilitários de URL.
- Habilitar lint, format, typecheck, build e automação mínima.
- Conectar ao preview Vercel apenas se o acesso já existir e for permitido; não tentar provisionamento de contas sem autorização.

**Gate:** `npm run build` e `npm run check` executáveis, scripts de qualidade funcionais, sem segredos.

### Fase 2 — layout e navegação

- Criar `Header`, `MobileMenu`, `Footer`, `ProjectCard`, `SocialLinks`, `SEO`, `ContactCTA`.
- Construir todas as páginas do MVP, inicialmente com somente conteúdo confirmado.
- Reutilizar navegação sem duplicar links divergentes.
- Menu mobile precisa usar `<button>`, `aria-expanded`, `aria-controls`, `Esc` e foco coerente.
- Não criar `<a><button>`, `href=""`, CTAs fictícios ou ocultação indevida do hero.
- Prever telas de 360, 768, 1024 e 1440 px.

**Gate:** navegação sem erros internos, CTAs acessíveis, sem overflow horizontal e com foco visível.

### Fase 3 — projetos e conteúdo

- Criar `src/content.config.ts` com validação Zod; usar Markdown e imagem real por projeto.
- Gerar `/projetos/[slug]` estaticamente; mostrar problema, solução, stack, papel, imagens e aprendizados.
- Implementar filtros por tecnologia derivando opções da coleção.
- Exibir exatamente três cases em destaque na home **somente se houver três cases validados**.
- Corrigir ortografia, padronizar voz verbal e remover qualquer `Lorem ipsum`.
- Imagens: nomes kebab-case, `alt`, dimensões explícitas, WebP/AVIF conforme pipeline Astro e lazy loading fora da dobra.
- Currículo só recebe botão de download se o PDF real existir.

**Gate:** conteúdo factual, sem imagens duplicadas para simular cases diferentes; build falha diante de metadados inválidos.

### Fase 4 — SEO, acessibilidade, performance e segurança

- Títulos e descriptions exclusivos, canonical correto, Open Graph/Twitter e imagem OG 1200×630 aprovada.
- `Person` JSON-LD só com nome, cargo, cidade e URLs realmente confirmados.
- Favicon, robots, sitemap e 404 personalizado.
- Implementar acessibilidade do PRD: labels, links de ícones nomeados, foco, contraste AA, reduced motion.
- Adicionar headers de segurança em `vercel.json`, inclusive CSP ajustada às integrações **realmente usadas**; testar para não quebrar recursos.
- Validar robots/sitemap/canonical no domínio de preview/produção sem inventar URL principal.
- Otimizar home para **<500 KB** e buscar **Lighthouse mobile ≥95** nas quatro categorias.
- Executar testes reais; se ferramenta visual/axe/Lighthouse não estiver disponível, registrar a limitação, não inventar resultados.

**Gate:** checklist documentado e bugs críticos resolvidos.

### Fase 5 — OPCIONAL, NÃO EXECUTAR SEM AUTORIZAÇÃO

Somente se eu aprovar explicitamente: formulário com Astro Actions, Zod, honeypot, Turnstile, Resend e persistência opcional no Supabase. Se for autorizado:

- Acionar runtime server-side apropriado na Vercel sem transformar desnecessariamente todas as páginas em SSR.
- Exigir validação server-side e pelo menos um canal de contato (e-mail ou WhatsApp).
- Nunca expor `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` ou `TURNSTILE_SECRET`.
- Ativar RLS sem políticas públicas na tabela de contatos, mantendo gravações autorizadas apenas no servidor.
- Tratar erro do Resend, falha de banco e antispam; fornecer feedback verdadeiro.
- Planejar aviso/retenção/exclusão de dados antes de armazenar leads.
- Manter `wa.me` como fallback sem JavaScript.

### Fase 6 — publicação

- Finalizar branch/PR e documentar resultado dos checks.
- Configurar domínio próprio **somente se ele estiver registrado e acesso for autorizado**.
- Validar TLS, DNS, redirects, canonical, sitemap e recursos estáticos.
- Habilitar Analytics/Speed Insights e Search Console quando houver permissões.
- Garantir fallback/rollback por deploy anterior.
- Verificar versão publicada e URLs de preview/produção; nunca afirmar deploy se a operação não ocorreu.

### Fase 7 — manutenção

- Configurar GitHub Actions com lint, `astro check`, build e Lighthouse CI por PR, se o ambiente suportar.
- Documentar como adicionar um novo projeto `.md` com imagens e campos corretos.
- Deixar um roteiro de revisão mensal de analytics, contatos e performance.

## 6. Critérios técnicos de aceite que você deve conferir

### Produto

- [ ] Duas jornadas evidentes na home.
- [ ] 3 projetos verdadeiros com rotas próprias.
- [ ] Serviços e canal de contato confirmados.
- [ ] Nenhum texto provisório, case duplicado, imagem falsa ou link quebrado.

### Front-end

- [ ] CTAs aparecem e funcionam em mobile.
- [ ] Menu semântico, teclado funcional, `Esc` fecha menu, foco visível.
- [ ] Todas as rotas principais existem, inclusive 404.
- [ ] Imagens com `alt` pertinente e dimensões estáveis.

### Qualidade

- [ ] Typecheck, build, lint e formatcheck concluídos com saída real.
- [ ] Lighthouse mobile ≥95 em Performance, A11y, Best Practices e SEO, ou pendência registrada com evidência.
- [ ] Home <500 KB ou pendência registrada com medição reproduzível.
- [ ] Sitemap, robots, canonical, OG, JSON-LD e favicon.
- [ ] Headers de segurança testados e links externos seguros.
- [ ] Nenhuma chave no bundle cliente ou no repositório.

### Operação

- [ ] Preview/produção verificados — ou bloqueios documentados.
- [ ] `DECISOES.md` e `PENDENCIAS.md` atualizados.
- [ ] README de setup, conteúdo, deploy e rollback.
- [ ] Fase 5 não implementada sem aprovação.

## 7. Protocolo para erros e escolhas

Se surgir problema, não faça mudanças aleatórias em muitos arquivos ao mesmo tempo:

1. Descreva o **sintoma observável** e a evidência (erro de build, stacktrace, console, HTTP, captura).
2. Formule **hipóteses práticas** de causa e priorize a mais simples/testável.
3. Aplique correção mínima e reversível.
4. Rode de novo o teste que falhava e um teste de regressão relacionado.
5. Registre causa encontrada, modificação e resultado.

Se depender de serviço externo ou dado faltante:

- Continue tarefas locais independentes.
- Marque o item em `PENDENCIAS.md` como `BLOQUEADO`.
- Informe **exatamente** o acesso, arquivo ou decisão que falta e o critério de aceite afetado.
- Não “resolver” inventando link, projeto, número de telefone ou artefato falso.

Se ocorrer conflito entre velocidade e confiabilidade, priorize **conteúdo verdadeiro, segurança, acessibilidade e reversibilidade**.

## 8. Formato obrigatório dos checkpoints e relatório final

Em cada fase, produza um checkpoint curto, por exemplo:

```md
### Checkpoint — Fase 2
**Estado:** Concluída / Parcial / Bloqueada
**Arquivos alterados:** ...
**Requisitos cobertos:** RF-02, RF-03, RNF-01...
**Testes executados:** comando + resultado real
**Pendências:** ...
**Decisões:** ...
**Próxima fase:** ...
```

Ao terminar o trabalho disponível, entregue:

```md
# Relatório de implementação — Harada DevSystems

## 1. Entregue de fato
[Recursos e fases concluídas, sem extrapolar]

## 2. Alterações e arquivos
[Mapa das mudanças e configuração]

## 3. Resultado de testes
| Teste | Executado? | Resultado | Evidência |
|---|---|---|---|

## 4. Requisitos e aceite
| ID do PRD | Status | Evidência | Bloqueio |
|---|---|---|---|

## 5. URLs e deployment
[Somente URLs que efetivamente verificou]

## 6. Segurança e performance
[Resultados medidos, limitações e riscos]

## 7. Decisões e diferenças do PDD
[Decisões relevantes e motivo]

## 8. Pendências com próximos passos
[Somente ações concretas que dependem de algo]

## 9. Instruções para continuar
[Comandos exatos e ordem de trabalho]
```

**Não apresente um “100% pronto” quando houver P0 bloqueado, dependência de domínio, ausência de projeto real ou medição não executada.** Separe sempre `IMPLEMENTADO`, `VALIDADO`, `PENDENTE` e `BLOQUEADO`.

## 9. Prioridades na falta de tempo/contexto

Se não for possível concluir toda a migração em uma execução, use a ordem:

1. Auditar e proteger o repositório.
2. Entregar build confiável e infraestrutura Astro/TypeScript/Tailwind.
3. Concluir navegação, páginas e dois fluxos centrais.
4. Publicar cases e conteúdos **somente validados**.
5. Garantir acessibilidade, SEO e performance.
6. Preparar preview, CI e documentação.
7. Deixar fase 5 como extensão separada.

**Importante:** faça o máximo que for seguro com os arquivos e acessos disponíveis nesta sessão. Não prometa trabalhar em segundo plano nem relatar resultados de etapas que não executou. Se houver limitação real, registre-a e entregue o estado do projeto utilizável.

---

# Instruções de uso rápido

Na raiz do projeto, com os arquivos copiados para lá, uma forma curta de iniciar é:

```text
Leia integralmente PRD_Harada_DevSystems.md,
PDD_Harada_DevSystems.md e
PROMPT_CHAVE_Claude_Code_Harada_DevSystems.md.

Execute o “Prompt de execução” deste último documento.
Comece auditando o repositório antes de alterar qualquer arquivo.
Implemente por fases, valide cada etapa com testes reais,
registre decisões e não invente dados, links ou cases.
A fase 5 é opcional e não está autorizada por padrão.
```

## O que já está decidido vs. o que depende de você

**Decidido pelo PDF/PRD/PDD:** dois públicos, sete rotas essenciais, Astro 5, TS, Tailwind 4, Markdown/Zod, Vercel, performance/SEO/acessibilidade, sem banco inicial.

**Ainda pendente de dados reais:** links e WhatsApp, currículo, três cases com imagens, conteúdo aprovado, URL de domínio próprio, identidade final, consentimentos/permissões e serviços externos. A automação não pode inventar essas informações.

**Uso de CoT:** o pedido foi convertido em um **processo explícito de planejamento, decisões, checagens e autocorreção**, com resultados auditáveis. O agente pode raciocinar internamente, mas seu relatório deve conter justificativas verificáveis e não uma transcrição de pensamentos privados.
