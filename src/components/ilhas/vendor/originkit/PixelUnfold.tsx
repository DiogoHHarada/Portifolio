// @ts-nocheck
/*
 * PixelUnfold — Originkit (https://www.originkit.dev/components/pixel-unfold), variante React.
 * Revela uma imagem por um mosaico de blocos que aparecem em ordem aleatória ao entrar na tela.
 * Ajustes marcados com "Harada:":
 *  - enquadramento "object-cover + topo", igual ao <Image> da capa (antes centralizava);
 *  - revela uma vez só (sem replay) e avisa ao terminar (onRevealed), para o <img>
 *    original voltar a ser exibido; em erro de carga também avisa;
 *  - sem placeholder e sem imagem padrão externa.
 */
'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export interface PixelUnfoldProps {
  imageSrc: string;
  pixelSize?: number;
  duration?: number;
  /** Harada: chamado quando o mosaico termina (ou a imagem falha). */
  onRevealed?: () => void;
}

function cubicBezierEase(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (p: number) => {
    let t = p;
    for (let i = 0; i < 8; i++) {
      const x = sampleX(t) - p;
      const d = dX(t);
      if (Math.abs(x) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= x / d;
    }
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return sampleY(t);
  };
}

export default function PixelUnfold({
  imageSrc,
  pixelSize = 32,
  duration = 1.4,
  onRevealed,
}: PixelUnfoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const tilesRef = useRef<{ x: number; y: number; order: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const startedRef = useRef(false);
  const doneRef = useRef(onRevealed);
  doneRef.current = onRevealed;

  const easeFn = useMemo(() => cubicBezierEase(0, 0, 0.58, 1), []);

  const build = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = imgElRef.current;
    if (!container || !canvas || !img || !img.complete || !img.naturalWidth) return false;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (cw <= 0 || ch <= 0) return false;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);

    const off = offscreenRef.current || document.createElement('canvas');
    offscreenRef.current = off;
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext('2d', { willReadFrequently: true });
    if (!octx) return false;

    const nW = img.naturalWidth;
    const nH = img.naturalHeight;
    const scale = Math.max(cw / nW, ch / nH);
    const dw = nW * scale;
    const dh = nH * scale;
    const dx = (cw - dw) / 2;
    const dy = 0; // Harada: alinhado ao topo, como object-top da capa.
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';
    octx.drawImage(img, dx * dpr, dy * dpr, dw * dpr, dh * dpr);

    const numCols = Math.ceil(cw / pixelSize);
    const rows = Math.ceil(ch / pixelSize);
    const data = octx.getImageData(0, 0, off.width, off.height).data;
    const tiles: { x: number; y: number; order: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * pixelSize;
        const y = row * pixelSize;
        const x0 = Math.floor(x * dpr);
        const y0 = Math.floor(y * dpr);
        const x1 = Math.min(off.width, Math.ceil((x + pixelSize) * dpr));
        const y1 = Math.min(off.height, Math.ceil((y + pixelSize) * dpr));
        let hasContent = false;
        for (let py = y0; py < y1 && !hasContent; py++) {
          let idx = (py * off.width + x0) * 4 + 3;
          for (let px = x0; px < x1; px++) {
            if (data[idx] > 3) {
              hasContent = true;
              break;
            }
            idx += 4;
          }
        }
        if (hasContent) tiles.push({ x, y, order: 0 });
      }
    }
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    tiles.forEach((t, i) => (t.order = i));
    tilesRef.current = tiles;
    return true;
  }, [pixelSize]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const off = offscreenRef.current;
    const dctx = canvas?.getContext('2d');
    const tiles = tilesRef.current;
    if (!canvas || !off || !dctx || !tiles.length) {
      doneRef.current?.();
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    dctx.clearRect(0, 0, canvas.width, canvas.height);
    const slot = duration / tiles.length;
    const committed = new Uint8Array(tiles.length);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = (now - start) / 1000;
      let allDone = true;
      for (let i = 0; i < tiles.length; i++) {
        if (committed[i]) continue;
        const t = tiles[i];
        const p = slot > 0 ? (elapsed - t.order * slot) / slot : 1;
        if (p <= 0) {
          allDone = false;
          continue;
        }
        const dx = Math.round(t.x * dpr);
        const dy = Math.round(t.y * dpr);
        const dw = Math.round((t.x + pixelSize) * dpr) - dx;
        const dh = Math.round((t.y + pixelSize) * dpr) - dy;
        dctx.clearRect(dx, dy, dw, dh);
        if (p >= 1) {
          dctx.globalAlpha = 1;
          dctx.drawImage(off, dx, dy, dw, dh, dx, dy, dw, dh);
          committed[i] = 1;
        } else {
          allDone = false;
          dctx.globalAlpha = easeFn(p);
          dctx.drawImage(off, dx, dy, dw, dh, dx, dy, dw, dh);
        }
      }
      dctx.globalAlpha = 1;
      if (allDone) {
        rafRef.current = null;
        doneRef.current?.();
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [duration, easeFn, pixelSize]);

  useEffect(() => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      imgElRef.current = img;
      setReady(true);
    };
    img.onerror = () => doneRef.current?.();
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observador = new IntersectionObserver(
      (entradas) => setIsInView(entradas.some((e) => e.isIntersecting)),
      { threshold: 0.35 },
    );
    observador.observe(container);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || !isInView || startedRef.current) return;
    startedRef.current = true;
    if (build()) animate();
    else doneRef.current?.();
  }, [ready, isInView, build, animate]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
