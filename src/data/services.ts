/**
 * Serviços listados no escopo do PRD (site institucional, loja virtual e landing page).
 * Entregáveis descritos de forma conservadora: sem preços, prazos ou integrações não confirmadas.
 * Validação comercial final pendente — ver PENDENCIAS.md.
 */

export type Servico = {
  id: 'site-institucional' | 'loja-virtual' | 'landing-page';
  titulo: string;
  resumo: string;
  entregaveis: readonly string[];
  icone: 'site' | 'loja' | 'landing';
};

export const servicos: readonly Servico[] = [
  {
    id: 'site-institucional',
    titulo: 'Site institucional',
    resumo:
      'Para apresentar sua empresa ou seu trabalho com clareza: quem você é, o que oferece e como falar com você.',
    entregaveis: [
      'Páginas como início, sobre, serviços e contato',
      'Layout responsivo para celular, tablet e computador',
      'Botão de contato direto pelo WhatsApp',
      'Títulos, descrições e imagem de compartilhamento configurados',
    ],
    icone: 'site',
  },
  {
    id: 'loja-virtual',
    titulo: 'Loja virtual',
    resumo:
      'Para vender pela internet com um catálogo organizado, carrinho de compras e área de cadastro para os clientes.',
    entregaveis: [
      'Catálogo de produtos',
      'Carrinho de compras',
      'Cadastro e login de clientes',
      'Layout responsivo para celular, tablet e computador',
    ],
    icone: 'loja',
  },
  {
    id: 'landing-page',
    titulo: 'Landing page',
    resumo:
      'Página única focada em uma oferta, campanha ou evento, com uma chamada clara para o visitante entrar em contato.',
    entregaveis: [
      'Página única com estrutura pensada para conversão',
      'Chamada para ação com WhatsApp ou link de sua escolha',
      'Imagens otimizadas para carregamento rápido',
      'Layout responsivo para celular, tablet e computador',
    ],
    icone: 'landing',
  },
];

export const processo = [
  {
    titulo: 'Conversa inicial',
    texto: 'Você conta o objetivo do projeto e o que precisa. A conversa começa pelo WhatsApp.',
  },
  {
    titulo: 'Proposta',
    texto: 'Defino com você o escopo, as páginas e o prazo antes de começar.',
  },
  {
    titulo: 'Desenvolvimento',
    texto: 'Construo o site e compartilho versões para você revisar e ajustar.',
  },
  {
    titulo: 'Entrega',
    texto: 'Com tudo aprovado, o site é publicado e você recebe o acesso ao que foi entregue.',
  },
] as const;
