/**
 * Dados institucionais VERIFICADOS.
 * Fonte de cada valor registrada em DECISOES.md (site anterior, currículo PDF e perfis públicos).
 * Não adicionar canais, links ou dados sem confirmação do autor.
 */

export const site = {
  marca: 'Harada DevSystems',
  pessoa: 'Diogo Harada',
  nomeCompleto: 'Diogo Henrique Silva Harada',
  cargo: 'Desenvolvedor web',
  idioma: 'pt-BR',
  locale: 'pt_BR',
  descricaoPadrao:
    'Portfólio de Diogo Harada, desenvolvedor web: projetos reais, serviços de sites institucionais, lojas virtuais e landing pages, e contato direto pelo WhatsApp.',
  curriculo: {
    href: '/curriculo-diogo-harada.pdf',
    nomeArquivo: 'curriculo-diogo-harada.pdf',
    tamanho: 'PDF, 83 KB',
  },
  ogImagem: {
    src: '/og-default.png',
    largura: 1200,
    altura: 630,
    alt: 'Logo Harada DevSystems com o nome Diogo Harada, desenvolvedor web',
  },
} as const;

/** WhatsApp: número presente no site anterior (script.js) e no currículo. */
const WHATSAPP_NUMERO = '5514996021767';

export function whatsappUrl(mensagem?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const contato = {
  whatsappExibicao: '(14) 99602-1767',
  mensagemOrcamento: 'Olá, Diogo! Vim pelo seu site e gostaria de pedir um orçamento.',
  email: 'diogohharada@gmail.com',
} as const;

export type RedeSocial = {
  nome: string;
  url: string;
  icone: 'github' | 'linkedin' | 'instagram';
  /** false = mantido no cadastro, mas oculto até decisão do autor (ver PENDENCIAS.md). */
  exibir: boolean;
};

export const redes: readonly RedeSocial[] = [
  { nome: 'GitHub', url: 'https://github.com/DiogoHHarada', icone: 'github', exibir: true },
  {
    nome: 'LinkedIn',
    url: 'https://www.linkedin.com/in/diogo-harada/',
    icone: 'linkedin',
    exibir: true,
  },
  {
    nome: 'Instagram',
    url: 'https://www.instagram.com/diogo.haradxz/',
    icone: 'instagram',
    exibir: false,
  },
];

export const redesVisiveis = redes.filter((r) => r.exibir);

export const navegacao = [
  { href: '/', rotulo: 'Início' },
  { href: '/projetos', rotulo: 'Projetos' },
  { href: '/servicos', rotulo: 'Serviços' },
  { href: '/sobre', rotulo: 'Sobre' },
  { href: '/contato', rotulo: 'Contato' },
] as const;
