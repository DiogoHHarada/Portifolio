import { getCollection, type CollectionEntry } from 'astro:content';

export type Projeto = CollectionEntry<'projetos'>;

/** Normaliza o nome de uma tecnologia para uso em filtros e atributos data-*. */
export function normalizarTecnologia(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Todos os projetos, do mais recente para o mais antigo (ordem estável). */
export async function listarProjetos(): Promise<Projeto[]> {
  const projetos = await getCollection('projetos');
  return projetos.sort(
    (a, b) =>
      b.data.ano - a.data.ano || a.data.ordem - b.data.ordem || a.id.localeCompare(b.id, 'pt-BR'),
  );
}

/**
 * Até 3 destaques para a home (RF-04). Nunca completa com projetos inventados:
 * se houver menos de 3, retorna somente os existentes e o verify:dist acusa a pendência.
 */
export async function listarDestaques(): Promise<Projeto[]> {
  const projetos = await getCollection('projetos', ({ data }) => data.destaque);
  return projetos
    .sort(
      (a, b) =>
        a.data.ordem - b.data.ordem || b.data.ano - a.data.ano || a.id.localeCompare(b.id, 'pt-BR'),
    )
    .slice(0, 3);
}

/** Opções do filtro derivadas da coleção, com contagem, sem duplicidade de rótulo. */
export function opcoesDeTecnologia(
  projetos: Projeto[],
): { valor: string; rotulo: string; total: number }[] {
  const mapa = new Map<string, { rotulo: string; total: number }>();
  for (const projeto of projetos) {
    for (const tecnologia of new Set(projeto.data.tecnologias)) {
      const valor = normalizarTecnologia(tecnologia);
      const atual = mapa.get(valor);
      mapa.set(valor, { rotulo: atual?.rotulo ?? tecnologia, total: (atual?.total ?? 0) + 1 });
    }
  }
  return [...mapa.entries()]
    .map(([valor, { rotulo, total }]) => ({ valor, rotulo, total }))
    .sort((a, b) => b.total - a.total || a.rotulo.localeCompare(b.rotulo, 'pt-BR'));
}
