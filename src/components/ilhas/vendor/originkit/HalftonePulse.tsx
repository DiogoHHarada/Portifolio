// @ts-nocheck
/*
 * HalftonePulse — Originkit (https://www.originkit.dev/components/halftone-pulse), variante React.
 * Grade de pontos em WebGL cujo tamanho e opacidade carregam uma onda radial.
 * Ajustes marcados com "Harada:":
 *  - fundo transparente e sem tamanho mínimo (era 1200×800), para servir de camada do hero;
 *  - o ponteiro é lido na janela (o conteúdo fica por cima do canvas);
 *  - o laço pausa quando o canvas sai da tela ou a aba fica oculta.
 */
'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

const MAX_DPR = 1.5; // Harada: 2 → 1.5 (custo de GPU em telas retina sem ganho visível)
const SPAN = 2.4;

const VERT_SRC = `
precision highp float;

attribute vec2 a_cell;

uniform vec2  uRes;
uniform float uTime, uPx, uFreq, uContrast, uDpr;
uniform vec2  uOrigin;

varying float v_scale;
varying float v_ramp;

void main(){
  float ar = uRes.x / max(uRes.y, 1.0);
  vec2 p = (a_cell - 0.5) * 2.0 * vec2(ar, 1.0) * ${SPAN.toFixed(2)};
  float dist = length(p - uOrigin);
  float s = sin(dist * uFreq - uTime * 2.5) * 0.5 + 0.5;
  s = pow(s, uContrast);
  v_scale = s;
  v_ramp = clamp(a_cell.y, 0.0, 1.0);
  gl_PointSize = max(s * uPx * uDpr, 0.0);
  gl_Position = vec4(p / vec2(ar, 1.0) / ${SPAN.toFixed(2)}, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;

uniform vec3 uBase, uAccent;

varying float v_scale;
varying float v_ramp;

void main(){
  vec2 q = gl_PointCoord - 0.5;
  float d = length(q) * 2.0;
  if (d > 1.0) discard;
  float m = 1.0 - smoothstep(0.70, 1.0, d);
  vec3 col = mix(uBase, uAccent, v_ramp);
  float a = v_scale * 0.9 * m;
  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function parseColor(
  input: string | undefined,
  fb: [number, number, number],
): [number, number, number] {
  if (!input) return fb;
  const str = String(input).trim();
  if (str.charAt(0) === '#') {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r / 255, g / 255, b / 255];
    }
    return fb;
  }
  return fb;
}

function num(v: unknown, fb: number): number {
  return typeof v === 'number' && isFinite(v) ? v : fb;
}

function clampN(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function grid(n: number): { cell: Float32Array; count: number } {
  const cols = Math.max(2, n);
  const rows = Math.max(2, Math.round(n * 0.68));
  const count = cols * rows;
  const cell = new Float32Array(count * 2);
  let k = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cell[k * 2] = cols > 1 ? x / (cols - 1) : 0.5;
      cell[k * 2 + 1] = rows > 1 ? y / (rows - 1) : 0.5;
      k++;
    }
  }
  return { cell, count };
}

type WaveGroup = { frequency?: number; contrast?: number };
const WAVE_DEFAULTS: Required<WaveGroup> = { frequency: 272, contrast: 100 };

export interface HalftonePulseProps {
  className?: string;
  baseColor?: string;
  accentColor?: string;
  density?: number;
  dotSize?: number;
  speed?: number;
  hover?: number;
  wave?: WaveGroup;
}

export default function HalftonePulse(props: HalftonePulseProps) {
  const {
    className,
    baseColor = '#FFFFFF',
    accentColor = '#FFFFFF',
    density = 55,
    dotSize = 100,
    speed = 50,
    hover = 200,
    wave,
  } = props;

  const wave_ = { ...WAVE_DEFAULTS, ...(wave || {}) };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptrRef = useRef({ tx: 0.5, ty: 0.5, x: 0.5, y: 0.5 });

  const vRef = useRef<Record<string, number | string>>({});
  vRef.current = {
    base: baseColor,
    accent: accentColor,
    density: Math.round(clampN(num(density, 60), 12, 160)),
    dotSize: clampN(num(dotSize, 100), 20, 400) / 100,
    speed: clampN(num(speed, 50), 0, 100) / 50,
    hover: clampN(num(hover, 100), 0, 200) / 100,
    frequency: (clampN(num(wave_.frequency, 100), 20, 400) / 100) * 6.0,
    contrast: (clampN(num(wave_.contrast, 100), 20, 400) / 100) * 1.0,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const aCell = gl.getAttribLocation(prog, 'a_cell');
    gl.enableVertexAttribArray(aCell);

    const locs: Record<string, WebGLUniformLocation | null> = {};
    const u = (name: string) => {
      if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
      return locs[name];
    };

    const bCell = gl.createBuffer();
    let builtFor = 0;
    let count = 0;
    const build = (n: number) => {
      const g = grid(n);
      gl.bindBuffer(gl.ARRAY_BUFFER, bCell);
      gl.bufferData(gl.ARRAY_BUFFER, g.cell, gl.STATIC_DRAW);
      builtFor = n;
      count = g.count;
    };

    let raf = 0;
    let last = performance.now();
    const PTR_RATE = 4.5;
    let clock = 0;
    // Harada: só anima enquanto visível.
    let visivel = true;

    const render = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = vRef.current;
      clock = (clock + dt * (v.speed as number)) % 3600;

      const ptr = ptrRef.current;
      const k = 1 - Math.exp(-dt * PTR_RATE);
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = canvas.clientWidth || 1200;
      const ch = canvas.clientHeight || 800;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      const wantN = v.density as number;
      if (wantN !== builtFor) build(wantN);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.bindBuffer(gl.ARRAY_BUFFER, bCell);
      gl.vertexAttribPointer(aCell, 2, gl.FLOAT, false, 0, 0);

      const pitch = Math.min(bw, bh) / Math.max(wantN, 1);
      gl.uniform2f(u('uRes'), bw, bh);
      gl.uniform1f(u('uTime'), clock);
      gl.uniform1f(u('uPx'), Math.max(1.0, (pitch / dpr) * 0.9 * (v.dotSize as number)));
      gl.uniform1f(u('uDpr'), dpr);
      gl.uniform1f(u('uFreq'), v.frequency as number);
      gl.uniform1f(u('uContrast'), v.contrast as number);
      gl.uniform2f(
        u('uOrigin'),
        (ptr.x - 0.5) * 2 * (bw / Math.max(bh, 1)) * SPAN * (v.hover as number),
        (0.5 - ptr.y) * 2 * SPAN * (v.hover as number),
      );
      const cb = parseColor(v.base as string, [1, 1, 1]);
      const ca = parseColor(v.accent as string, [0.984, 0.749, 0.141]);
      gl.uniform3f(u('uBase'), cb[0], cb[1], cb[2]);
      gl.uniform3f(u('uAccent'), ca[0], ca[1], ca[2]);

      gl.drawArrays(gl.POINTS, 0, count);
      if (visivel && !document.hidden) raf = requestAnimationFrame(render);
    };

    const retomar = () => {
      if (raf || !visivel || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(render);
    };

    build(vRef.current.density as number);
    // Harada: ponteiro na janela, pois o texto do hero fica por cima do canvas.
    const track = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      ptrRef.current.tx = clampN((e.clientX - r.left) / r.width, 0, 1);
      ptrRef.current.ty = clampN((e.clientY - r.top) / r.height, 0, 1);
    };
    const onLeave = () => {
      ptrRef.current.tx = 0.5;
      ptrRef.current.ty = 0.5;
    };
    const observador = new IntersectionObserver((entradas) => {
      visivel = entradas.some((e) => e.isIntersecting);
      retomar();
    });
    observador.observe(canvas);
    window.addEventListener('pointermove', track, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', retomar);

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observador.disconnect();
      window.removeEventListener('pointermove', track);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', retomar);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={className ?? 'block h-full w-full'} aria-hidden="true" />
  );
}
