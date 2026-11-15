/**
 * Montagem das ilhas React (efeitos do OriginKit e do React Bits).
 *
 * Por que não `client:visible` do Astro: as ilhas do Astro injetam <script> e <style>
 * inline, o que quebraria a CSP estrita do site (script-src/style-src 'self', ver D-06).
 * Aqui tudo é módulo externo: este arquivo é pequeno e React, GSAP e cada efeito só são
 * baixados (import dinâmico) quando um ponto de montagem chega perto da tela.
 *
 * Todos os efeitos são decorativos: com `prefers-reduced-motion: reduce`, sem WebGL
 * ou sem JavaScript, o HTML do Astro continua completo e nada é montado.
 */
import type { ComponentType, ReactNode } from 'react';

type Props = Record<string, unknown>;
type Modulo = { default: ComponentType<Props & { children?: ReactNode }> };

interface Definicao {
  carregar: () => Promise<Modulo>;
  /**
   * substituir: o componente desenha o conteúdo (o HTML original é o fallback).
   * envolver: o componente desenha um invólucro e os nós originais são movidos para dentro.
   */
  modo: 'substituir' | 'envolver';
  /** Media query exigida para montar (ex.: só com mouse, só em telas largas). */
  midia?: string;
  /** Ajusta as props com dados lidos do DOM no momento da montagem. */
  preparar?: (el: HTMLElement, props: Props) => Props;
}

const comMouse = '(hover: hover) and (pointer: fine)';
const carregar = (p: Promise<unknown>) => p as Promise<Modulo>;

const registro = {
  /** OriginKit · Halftone Pulse — grade de pontos em WebGL no fundo do hero. */
  halftone: {
    carregar: () => carregar(import('@/components/ilhas/vendor/originkit/HalftonePulse')),
    modo: 'substituir',
    midia: '(min-width: 768px)',
  },
  /** OriginKit · Sync Scroll — faixa de tecnologias que segue a direção da rolagem. */
  faixa: {
    carregar: () => carregar(import('@/components/ilhas/vendor/originkit/SyncScroll')),
    modo: 'substituir',
  },
  /** OriginKit · Pixel Unfold — capa do projeto revelada em mosaico. */
  'capa-pixel': {
    carregar: () => carregar(import('@/components/ilhas/vendor/originkit/PixelUnfold')),
    modo: 'substituir',
    preparar: (el, props) => {
      const img = el.parentElement?.querySelector('img');
      const src = img?.currentSrc || img?.src;
      if (!img || !src) throw new Error('capa sem imagem');
      // Capa que já estava na tela quando a página abriu (ex.: primeira de /projetos):
      // não some e reaparece; o mosaico é só para as que chegam pela rolagem.
      if ('ilhaNaTelaInicial' in el.dataset) throw new Error('capa já na tela');
      return {
        ...props,
        imageSrc: src,
        onRevealed: () => {
          el.dataset.revelado = '';
        },
      };
    },
  },
  /** React Bits · Magnet — botões principais atraídos pelo cursor. */
  ima: {
    carregar: () => carregar(import('@/components/ilhas/vendor/reactbits/Magnet')),
    modo: 'envolver',
    midia: comMouse,
  },
  /** React Bits · Spotlight Card — luz verde que segue o cursor nas linhas de serviço. */
  holofote: {
    carregar: () => carregar(import('@/components/ilhas/vendor/reactbits/SpotlightCard')),
    modo: 'envolver',
    midia: comMouse,
  },
  /** React Bits · Scroll Reveal — título revelado palavra a palavra ao entrar na tela. */
  revelar: {
    carregar: () => carregar(import('@/components/ilhas/vendor/reactbits/ScrollReveal')),
    modo: 'substituir',
    preparar: (el, props) => ({
      ...props,
      children: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
    }),
  },
} satisfies Record<string, Definicao>;

export type NomeIlha = keyof typeof registro;

const ehNome = (nome: string | undefined): nome is NomeIlha =>
  nome !== undefined && Object.hasOwn(registro, nome);

async function montar(el: HTMLElement) {
  const nome = el.dataset.ilha;
  if (!ehNome(nome)) return;
  const def: Definicao = registro[nome];
  if (def.midia && !window.matchMedia(def.midia).matches) return;

  let props: Props = {};
  try {
    props = JSON.parse(el.dataset.ilhaProps ?? '{}') as Props;
    if (def.preparar) props = def.preparar(el, props);
  } catch {
    return;
  }

  const [{ createElement }, { flushSync }, { createRoot }, modulo, encaixe] = await Promise.all([
    import('react'),
    import('react-dom'),
    import('react-dom/client'),
    def.carregar(),
    def.modo === 'envolver' ? import('@/components/ilhas/Encaixe') : Promise.resolve(null),
  ]);

  const raiz = createRoot(el);
  // flushSync: troca o conteúdo e o devolve no mesmo quadro (sem piscar nem deslocar layout).
  flushSync(() => {
    if (def.modo === 'envolver' && encaixe) {
      const nos = Array.from(el.childNodes);
      raiz.render(createElement(modulo.default, props, createElement(encaixe.default, { nos })));
    } else {
      raiz.render(createElement(modulo.default, props));
    }
  });
  el.dataset.ilhaAtiva = '';
}

function iniciar() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pontos = document.querySelectorAll<HTMLElement>('[data-ilha]');
  if (!pontos.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        observador.unobserve(entrada.target);
        void montar(entrada.target as HTMLElement);
      }
    },
    { rootMargin: '200px 0px' },
  );
  pontos.forEach((el) => {
    const caixa = el.getBoundingClientRect();
    if (caixa.top < window.innerHeight && caixa.bottom > 0) el.dataset.ilhaNaTelaInicial = '';
    observador.observe(el);
  });
}

// Depois do carregamento e com a thread livre: os efeitos nunca disputam com o LCP.
const quandoOcioso = (fn: () => void) =>
  'requestIdleCallback' in window
    ? window.requestIdleCallback(fn, { timeout: 2500 })
    : setTimeout(fn, 1200);

if (document.readyState === 'complete') quandoOcioso(iniciar);
else window.addEventListener('load', () => quandoOcioso(iniciar), { once: true });
