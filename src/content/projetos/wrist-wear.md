---
titulo: 'Wrist Wear — loja virtual de pulseiras artesanais'
resumo: 'E-commerce de uma marca fictícia de pulseiras artesanais, com catálogo de produtos, carrinho de compras e cadastro de clientes, feito em PHP com banco PostgreSQL.'
capa: '../../assets/projetos/wrist-wear-capa.png'
capaAlt: 'Logotipo da Wrist Wear: pulseiras entrelaçadas em um círculo dourado com folhas e o texto Wrist Wear, Artisainal Bracelets.'
tecnologias: ['PHP', 'PostgreSQL', 'HTML', 'CSS']
papel: 'Integrante da equipe de desenvolvimento'
contexto: 'Projeto acadêmico · CTI-UNESP'
ano: 2023
destaque: true
ordem: 2
links:
  github: 'https://github.com/DiogoHHarada/E-commerce'
galeria:
  - imagem: '../../assets/projetos/wrist-wear-produtos.jpg'
    alt: 'Pulseiras de miçangas coloridas espalhadas sobre uma superfície branca.'
    legenda: 'Foto de produtos usada no catálogo da loja.'
---

## O problema

Como trabalho do segundo semestre do curso técnico, o desafio era construir uma loja virtual funcional para uma empresa fictícia — a Wrist Wear, marca de pulseiras artesanais — cobrindo o caminho completo do cliente: conhecer os produtos, montar o pedido e ter uma conta na loja.

## A solução

Um site em **PHP** com banco de dados **PostgreSQL**, sem framework, organizado em páginas:

- **Início, Produtos, Carrinho, Contate-nos e Sobre nós**, com menu responsivo.
- **Carrinho de compras** vinculado à sessão do visitante, com registro das compras e do status de cada pedido no banco.
- **Cadastro e login de clientes** com controle de sessão.
- Funções utilitárias centralizadas para conexão (PDO) e execução de consultas SQL.

## O que aprendi

- Modelar tabelas relacionais para usuários e compras, incluindo o status de cada pedido.
- Manter estado entre páginas com sessões e cookies em PHP.
- Separar responsabilidades em funções reutilizáveis de acesso a dados.
- Desenvolver em equipe um sistema completo, do banco de dados à interface.
