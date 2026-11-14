# Direção de design

**Conceito: caderno técnico editorial.** Um dossiê de engenharia em modo escuro: tipografia grande, linhas finas, numeração (01/02/03) e um único acento (o verde da marca) usado com parcimônia. O objetivo é parecer feito por uma pessoa com critério, e não por um template: sem hero centralizado com gradiente, sem trio de cards com ícones.

## Tipografia (arquivos locais via Fontsource, CSP sem fontes externas)

| Papel                             | Fonte            | Pesos         |
| --------------------------------- | ---------------- | ------------- |
| Títulos (h1, h2, números grandes) | Instrument Serif | 400 e itálico |
| Texto e interface                 | Geist Sans       | 400, 500      |
| Rótulos, índices, tecnologias     | JetBrains Mono   | 400, 500      |

A serifada só existe no peso 400; por isso os títulos não usam negrito. O itálico em verde (`.destaque-serif`) marca a palavra-chave de cada título. Cada família tem um fallback com métricas ajustadas (`size-adjust`, `ascent-override`…) e as fontes acima da dobra têm `<link rel="preload">`; CLS medido: 0.

## Cores (tokens em `src/styles/global.css`)

| Token                      | Valor                 | Uso                                                  |
| -------------------------- | --------------------- | ---------------------------------------------------- |
| `bg`                       | `#0a0b09`             | fundo (tinta quente, não preto puro)                 |
| `surface`                  | `#11130f`             | superfícies                                          |
| `text`                     | `#ece9e1`             | texto (cor de osso), 16,4:1                          |
| `muted`                    | `#a3a69a`             | texto secundário, 7,9:1                              |
| `accent`                   | `#00ff08`             | marca: botão principal, faixa de contato, marcadores |
| `border` / `border-strong` | `#2a2d26` / `#454a3f` | linhas finas                                         |

## Estrutura e componentes

- **Home:** hero assimétrico (título grande + retrato com "ficha técnica"); as duas jornadas são dois blocos tipográficos separados por uma linha ("Precisa de um site?" / "Recrutador ou equipe técnica?").
- **Projetos:** lista editorial numerada, com capa grande alternando de lado em telas largas (`ProjectCard`). O estudo de caso tem coluna lateral fixa com a ficha (participação, ano, tecnologias, links).
- **Serviços e processo:** linhas numeradas com divisórias (`ServiceCard`), sem ícones de biblioteca.
- **Contato:** a faixa de contato em verde (`ContactCTA`) é o momento de marca de cada página; botões `btn-escuro` e `btn-contorno-escuro` existem só para esse fundo.
- **Micro-interações:** setas que deslizam, zoom lento da capa e sublinhado que engrossa ao passar o mouse. Todas respeitam `prefers-reduced-motion`.
- **Estados:** filtro sem resultado (mensagem desenhada), 404 com número em destaque, sem JavaScript (menu e filtro com alternativa).

## Escala e espaçamento

Títulos fluidos com `clamp()` (`titulo-display`, `titulo-pagina`, `titulo-secao`); seções separadas por `mt-28`/`sm:mt-36`; container de 76 rem com gutter de 20 px (32 px a partir de 640 px). Raio pequeno (0,375–0,5 rem) para um visual mais técnico.

## Restrições mantidas

CSP estrita (sem estilos ou scripts inline), HTML sem conteúdo inventado, navegação por teclado, foco visível (contorno de 2 px no acento) e os mesmos textos e dados de `src/data/` e `src/content/`.
