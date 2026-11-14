#!/usr/bin/env node
/**
 * Verificação estática do build (dist/) contra critérios do PRD/PDD.
 * Sem dependências externas. Sai com código 1 se algum critério bloqueante falhar.
 *
 * Cobre: T-05 (links internos), T-08 (meta/canonical/OG/JSON-LD/sitemap/robots),
 * AC-02 (sem Lorem ipsum, sem href vazio/#, sem <a><button>), AC-08, AC-10 (rel em _blank),
 * RNF-05 (alt em imagens), RNF-09 (dimensões), compatibilidade com a CSP (sem inline),
 * RF-04 (exatamente 3 cases na home) e RNF-08 (orçamento < 500 KB da home).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');
const ORCAMENTO_HOME_BYTES = 500 * 1024;

const falhas = [];
const falhar = (arquivo, msg) => falhas.push(`${arquivo}: ${msg}`);

if (!existsSync(dist)) {
  console.error('dist/ não encontrado. Rode `npm run build` antes.');
  process.exit(1);
}

function listar(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

const arquivos = listar(dist);
const paginas = arquivos.filter((f) => extname(f) === '.html');
const rel = (f) => relative(dist, f).split('\\').join('/');

/** Resolve um caminho de URL interno para um arquivo existente em dist (cleanUrls). */
function resolverInterno(urlPath) {
  const limpo = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (limpo === '' || limpo === '/') return join(dist, 'index.html');
  const semBarra = limpo.replace(/\/$/, '');
  const candidatos = [
    join(dist, semBarra),
    join(dist, `${semBarra}.html`),
    join(dist, semBarra, 'index.html'),
  ];
  return candidatos.find((c) => existsSync(c) && statSync(c).isFile());
}

const atributo = (tag, nome) => {
  const m = tag.match(new RegExp(`\\s${nome}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : undefined;
};

const titulos = new Map();
const descricoes = new Map();

for (const pagina of paginas) {
  const nome = rel(pagina);
  const html = readFileSync(pagina, 'utf8');
  const eh404 = nome === '404.html';

  // --- Documento e SEO -------------------------------------------------------
  if (!/<html[^>]*\slang="pt-BR"/i.test(html)) falhar(nome, '<html lang="pt-BR"> ausente');
  const titulo = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  if (!titulo) falhar(nome, '<title> ausente');
  else titulos.set(titulo, [...(titulos.get(titulo) ?? []), nome]);

  const descricao = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  if (!descricao || descricao.length < 50) falhar(nome, 'meta description ausente ou curta');
  else descricoes.set(descricao, [...(descricoes.get(descricao) ?? []), nome]);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical?.startsWith('https://')) falhar(nome, 'canonical absoluto https ausente');
  else {
    const caminhoCanonical = new URL(canonical).pathname;
    if (
      caminhoCanonical.endsWith('.html') ||
      (caminhoCanonical !== '/' && caminhoCanonical.endsWith('/'))
    )
      falhar(nome, `canonical com .html ou barra final: ${canonical}`);
  }

  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!html.includes(`property="${prop}"`)) falhar(nome, `${prop} ausente`);
  }
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  if (ogImage && !ogImage.startsWith('https://')) falhar(nome, 'og:image deve ser URL absoluta');
  if (ogImage) {
    const caminhoOg = new URL(ogImage).pathname;
    if (!resolverInterno(caminhoOg)) falhar(nome, `og:image não existe em dist: ${caminhoOg}`);
  }
  if (!html.includes('name="twitter:card" content="summary_large_image"'))
    falhar(nome, 'twitter:card ausente');
  if (!/rel="icon"/.test(html)) falhar(nome, 'favicon ausente');
  if (eh404 && !html.includes('name="robots" content="noindex')) falhar(nome, '404 sem noindex');

  // --- Conteúdo proibido -------------------------------------------------------
  if (/lorem\s+ipsum/i.test(html.replace(/<[^>]+>/g, ' ')))
    falhar(nome, 'texto "Lorem ipsum" encontrado');
  if (/<a\b[^>]*>\s*<button/i.test(html)) falhar(nome, 'padrão inválido <a><button>');
  if (/\shref=("|')(#?)\1/i.test(html)) falhar(nome, 'href vazio ou "#"');
  if (/example\.(com|org)/i.test(html)) falhar(nome, 'URL de exemplo encontrada');

  // --- IDs duplicados ----------------------------------------------------------
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicados.length) falhar(nome, `id duplicado: ${[...new Set(duplicados)].join(', ')}`);

  // --- Compatibilidade com a CSP (sem inline) --------------------------------
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const tipo = atributo(`<x${attrs}>`, 'type');
    if (tipo === 'application/ld+json') {
      try {
        JSON.parse(m[2]);
      } catch {
        falhar(nome, 'JSON-LD inválido');
      }
      continue;
    }
    if (!atributo(`<x${attrs}>`, 'src')) falhar(nome, 'script inline (bloqueado pela CSP)');
  }
  if (/<style[\s>]/i.test(html)) falhar(nome, '<style> inline (bloqueado pela CSP)');
  if (/\sstyle="/i.test(html)) falhar(nome, 'atributo style="" (bloqueado pela CSP)');
  if (/\son[a-z]+="/i.test(html)) falhar(nome, 'handler inline on*="" (bloqueado pela CSP)');

  // --- Links ---------------------------------------------------------------
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = m[0];
    const href = atributo(tag, 'href');
    if (href === undefined) {
      falhar(nome, `<a> sem href: ${tag.slice(0, 80)}`);
      continue;
    }
    if (atributo(tag, 'target') === '_blank') {
      const relAttr = atributo(tag, 'rel') ?? '';
      if (!relAttr.includes('noopener') || !relAttr.includes('noreferrer'))
        falhar(nome, `target=_blank sem rel="noopener noreferrer": ${href}`);
    }
    if (/^https?:\/\//i.test(href)) {
      if (href.startsWith('http://')) falhar(nome, `link externo sem HTTPS: ${href}`);
      continue;
    }
    if (/^(mailto:|tel:)/i.test(href)) continue;
    if (href.startsWith('#')) {
      if (!ids.includes(href.slice(1))) falhar(nome, `âncora inexistente: ${href}`);
      continue;
    }
    const alvo = href.startsWith('/') ? href : posix.join(posix.dirname(`/${nome}`), href);
    if (!resolverInterno(alvo)) falhar(nome, `link interno quebrado: ${href}`);
  }

  // --- Imagens ---------------------------------------------------------------
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = atributo(tag, 'src');
    // `alt` sem valor é serializado pelo Astro para alt="" (imagem decorativa) e é válido.
    if (!/\salt(?=[\s=>/])/i.test(tag)) falhar(nome, `<img> sem alt: ${src}`);
    if (!atributo(tag, 'width') || !atributo(tag, 'height'))
      falhar(nome, `<img> sem width/height: ${src}`);
    if (src?.startsWith('/') && !resolverInterno(src)) falhar(nome, `imagem inexistente: ${src}`);
  }
}

for (const [titulo, onde] of titulos) {
  if (onde.length > 1) falhar(onde.join(', '), `título duplicado "${titulo}"`);
}
for (const [, onde] of descricoes) {
  if (onde.length > 1) falhar(onde.join(', '), 'meta description duplicada');
}

// --- Arquivos obrigatórios -----------------------------------------------------
for (const obrigatorio of [
  '404.html',
  'robots.txt',
  'sitemap-index.xml',
  'favicon.ico',
  'og-default.png',
  'projetos.html',
  'servicos.html',
  'sobre.html',
  'contato.html',
]) {
  if (!existsSync(join(dist, obrigatorio)))
    falhar('dist', `arquivo obrigatório ausente: ${obrigatorio}`);
}
const robots = existsSync(join(dist, 'robots.txt'))
  ? readFileSync(join(dist, 'robots.txt'), 'utf8')
  : '';
if (!/Sitemap: https:\/\/.+sitemap-index\.xml/.test(robots) && !/Disallow: \/\s*$/m.test(robots))
  falhar('robots.txt', 'sem referência ao sitemap');

// --- Home: 3 cases e orçamento de peso ------------------------------------------
const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const cards = (homeHtml.match(/data-card-projeto/g) ?? []).length;
if (cards !== 3)
  falhar('index.html', `RF-04: esperado exatamente 3 projetos em destaque, encontrado ${cards}`);
for (const cta of ['href="/contato"', 'href="/projetos"']) {
  if (!homeHtml.includes(cta)) falhar('index.html', `CTA de jornada ausente (${cta})`);
}

/**
 * Peso estimado da home (sem compressão HTTP, cenário pessimista):
 * HTML + CSS + JS de módulos + fontes woff2 referenciadas no CSS + para cada <img>
 * o MAIOR candidato do srcset (o navegador costuma baixar um menor no celular).
 */
const recursos = new Set();
for (const m of homeHtml.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gi))
  recursos.add(atributo(m[0], 'href'));
for (const m of homeHtml.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/gi)) recursos.add(m[1]);
for (const m of homeHtml.matchAll(/<img\b[^>]*>/gi)) {
  const srcset = atributo(m[0], 'srcset');
  if (srcset) {
    const candidatos = srcset.split(',').map((c) => c.trim().split(/\s+/)[0]);
    const maiores = candidatos
      .map((c) => ({ c, f: resolverInterno(c) }))
      .filter((x) => x.f)
      .sort((a, b) => statSync(b.f).size - statSync(a.f).size);
    if (maiores[0]) recursos.add(maiores[0].c);
  } else {
    recursos.add(atributo(m[0], 'src'));
  }
}
// Imports estáticos dos módulos JS e fontes woff2 do CSS
for (const r of [...recursos]) {
  if (!r) continue;
  const arquivo = resolverInterno(r);
  if (!arquivo) continue;
  const texto = readFileSync(arquivo, 'utf8');
  if (r.endsWith('.js')) {
    for (const m of texto.matchAll(/from\s*"\.\/([^"]+)"|import\s*"\.\/([^"]+)"/g)) {
      recursos.add(posix.join(posix.dirname(r), m[1] ?? m[2]));
    }
  }
  if (r.endsWith('.css')) {
    for (const m of texto.matchAll(/url\(([^)]+\.woff2)\)/g))
      recursos.add(m[1].replace(/["']/g, ''));
  }
}
let totalHome = statSync(join(dist, 'index.html')).size;
const detalhe = [['index.html', totalHome]];
for (const r of recursos) {
  if (!r) continue;
  const arquivo = resolverInterno(r);
  if (!arquivo) {
    falhar('index.html', `recurso não encontrado: ${r}`);
    continue;
  }
  const tamanho = statSync(arquivo).size;
  totalHome += tamanho;
  detalhe.push([r, tamanho]);
}
if (totalHome > ORCAMENTO_HOME_BYTES) {
  falhar('index.html', `RNF-08: peso estimado ${(totalHome / 1024).toFixed(1)} KB > 500 KB`);
}

// --- Relatório ---------------------------------------------------------------
console.log(`Páginas verificadas: ${paginas.length}`);
console.log(`Projetos em destaque na home: ${cards}`);
console.log(
  `Peso estimado da home (sem compressão, maior candidato de cada srcset): ${(totalHome / 1024).toFixed(1)} KB`,
);
for (const [r, t] of detalhe.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${(t / 1024).toFixed(1).padStart(7)} KB  ${r}`);
}
if (falhas.length) {
  for (const f of falhas) console.error(`FALHA  ${f}`);
  console.error(`\n${falhas.length} falha(s).`);
  process.exit(1);
}
console.log('\nOK: todas as verificações passaram.');
