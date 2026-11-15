// @ts-nocheck
/*
 * SyncScroll — Originkit (https://www.originkit.dev/components/sync-scroll), variante React.
 * Faixa infinita de palavras que acompanha a direção da rolagem.
 * Ajustes marcados com "Harada:":
 *  - tipografia e cor vêm por className (tokens do site) em vez de objeto de fonte;
 *  - separador gráfico entre palavras;
 *  - o laço pausa fora da tela.
 */
'use client';

import * as React from 'react';
import { useRef, useState, useEffect, startTransition } from 'react';

export interface SyncScrollProps {
  words?: string[];
  baseVelocity?: number;
  direction?: 'left' | 'right';
  gap?: number;
  className?: string;
  /** Harada: classe do separador entre palavras. */
  separatorClassName?: string;
}

export default function SyncScroll({
  words = ['SCROLL', 'SYNC'],
  baseVelocity = 5,
  direction = 'left',
  gap = 32,
  className,
  separatorClassName = 'inline-block size-2 rotate-45 bg-accent',
}: SyncScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [numCopies, setNumCopies] = useState(2);
  const [unitWidth, setUnitWidth] = useState(0);

  const propsRef = useRef({ baseVelocity, direction });
  useEffect(() => {
    propsRef.current = { baseVelocity, direction };
  }, [baseVelocity, direction]);

  const state = useRef({
    x: 0,
    currentDirMultiplier: direction === 'right' ? -1 : 1,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    lastFrameTime: typeof window !== 'undefined' ? performance.now() : 0,
  });

  const renderBlockContent = (copyIndex: number) =>
    (words ?? []).map((word, wordIndex) => (
      <span
        key={`copy-${copyIndex}-word-${wordIndex}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: `${gap}px` }}
      >
        {word}
        <span className={separatorClassName} />
      </span>
    ));

  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    if (!container || !block) return;

    const updateSizes = () => {
      const cw = container.getBoundingClientRect().width || 0;
      const bw = block.getBoundingClientRect().width || 0;
      if (bw > 0) {
        const nextCopies = Math.max(3, Math.ceil(cw / bw) + 2);
        startTransition(() => {
          setUnitWidth(bw);
          setNumCopies(nextCopies);
        });
      }
    };

    updateSizes();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateSizes);
    ro.observe(container);
    ro.observe(block);
    return () => ro.disconnect();
  }, [words, gap]);

  useEffect(() => {
    if (unitWidth <= 0) return;

    let rafId = 0;
    let visivel = true;

    const wrap = (value: number, min: number, max: number) => {
      const range = max - min;
      if (range <= 0) return min;
      return ((((value - min) % range) + range) % range) + min;
    };
    const onScroll = () => {
      const scrollY = window.scrollY;
      const dy = scrollY - state.current.lastScrollY;
      state.current.lastScrollY = scrollY;
      if (Math.abs(dy) > 0.5) {
        const initialBaseSign = propsRef.current.direction === 'right' ? -1 : 1;
        state.current.currentDirMultiplier = initialBaseSign * (dy > 0 ? 1 : -1);
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      const last = state.current.lastFrameTime || now;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      state.current.lastFrameTime = now;

      const pixelsPerSecond = (unitWidth * propsRef.current.baseVelocity) / 100;
      const moveBy = state.current.currentDirMultiplier * pixelsPerSecond * dt;
      state.current.x = Number.isFinite(state.current.x + moveBy) ? state.current.x + moveBy : 0;

      const offset = -wrap(state.current.x, 0, unitWidth);
      if (scrollerRef.current) {
        scrollerRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      if (visivel) rafId = window.requestAnimationFrame(tick);
    };

    // Harada: pausa fora da tela.
    const observador = new IntersectionObserver((entradas) => {
      visivel = entradas.some((e) => e.isIntersecting);
      if (visivel && !rafId) {
        state.current.lastFrameTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    });
    if (containerRef.current) observador.observe(containerRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    state.current.lastFrameTime = performance.now();
    rafId = window.requestAnimationFrame(tick);

    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [unitWidth]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
      }}
    >
      <div
        ref={scrollerRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          userSelect: 'none',
        }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              flexShrink: 0,
              gap: `${gap}px`,
              paddingRight: `${gap}px`,
            }}
          >
            {renderBlockContent(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
