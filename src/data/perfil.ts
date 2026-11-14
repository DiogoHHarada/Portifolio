/**
 * Perfil profissional — fontes: currículo PDF (Curriculo.pdf), texto "Sobre" do site anterior
 * e repositórios públicos no GitHub. Ver DECISOES.md para a rastreabilidade de cada item.
 */

export const competencias = [
  {
    grupo: 'Linguagens',
    itens: ['PHP', 'Java', 'C#', 'Python', 'JavaScript', 'TypeScript'],
  },
  {
    grupo: 'Web e frameworks',
    itens: ['HTML', 'CSS', 'Laravel'],
  },
  {
    grupo: 'Bancos de dados',
    itens: ['MySQL', 'PostgreSQL'],
  },
  {
    grupo: 'Ferramentas e práticas',
    itens: ['Git', 'GitHub', 'Scrum'],
  },
] as const;

export const formacao = [
  {
    curso: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
    instituicao: 'Instituto Federal de São Paulo (IFSP) — Campus Caraguatatuba',
    periodo: '2025 – 2027',
    status: 'Em andamento',
  },
  {
    curso: 'Técnico em Informática (concomitante ao ensino médio)',
    instituicao: 'Colégio Técnico Industrial Prof. Isaac Portal Roldán (CTI-UNESP) — Bauru/SP',
    periodo: '2022 – 2024',
    status: 'Concluído',
  },
] as const;

export const experiencia = [
  {
    cargo: 'Estagiário',
    organizacao: 'Prefeitura de Caraguatatuba',
    periodo: 'ago. 2025 – dez. 2025',
    atividades: [
      'Diagnóstico e correção de problemas em computadores, impressoras e outros equipamentos.',
      'Atendimento a usuários com dificuldades de hardware e software.',
      'Manutenção preventiva e corretiva, com testes após cada serviço.',
    ],
  },
] as const;

export const idiomas = [
  { idioma: 'Inglês', nivel: 'Básico (A2)' },
  { idioma: 'Espanhol', nivel: 'Básico (A2)' },
] as const;
