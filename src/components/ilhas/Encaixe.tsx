import { useLayoutEffect, useRef } from 'react';

/**
 * Reaproveita o HTML gerado pelo Astro dentro de um componente React.
 *
 * Os nós originais (links, ícones, atributos de métrica) são movidos, não recriados:
 * o conteúdo continua igual com ou sem JavaScript, e o React só desenha o efeito em volta.
 * `display: contents` faz o invólucro não interferir no layout.
 */
export default function Encaixe({ nos }: { nos: Node[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.append(...nos);
  }, [nos]);

  return <div ref={ref} className="contents" />;
}
