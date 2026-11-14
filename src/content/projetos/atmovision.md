---
titulo: 'AtmoVision — monitoramento meteorológico do CTI'
resumo: 'Plataforma web do TCC do curso técnico do CTI-UNESP que reúne dados climáticos (temperatura, umidade e vento) para a comunidade escolar, com gráficos, chatbot e área de usuário.'
capa: '../../assets/projetos/atmovision-capa.png'
capaAlt: 'Logotipo do AtmoVision: barras verticais azuis que lembram um gráfico, sobre as letras AV.'
tecnologias: ['PHP', 'Laravel', 'JavaScript', 'CSS', 'Grafana']
papel: 'Desenvolvedor em uma equipe de sete integrantes'
contexto: 'TCC · Técnico em Informática (CTI-UNESP)'
ano: 2024
destaque: true
ordem: 1
links:
  github: 'https://github.com/DiogoHHarada/TCC_Grupo5'
---

## O problema

A comunidade do Colégio Técnico Industrial (CTI-UNESP), em Bauru/SP — professores, alunos e funcionários — não tinha um lugar simples para consultar as condições do tempo no próprio campus. A proposta do trabalho de conclusão de curso foi oferecer essas informações de forma acessível, estimulando a consciência climática e a inclusão digital.

## A solução

O AtmoVision é uma aplicação web em **Laravel** que apresenta os dados registrados por uma estação de monitoramento com sensores (IoT). O repositório contém a aplicação web; a coleta feita pelos sensores não faz parte dele.

- **Modelo de dados:** cada registro guarda temperatura, umidade, velocidade e direção do vento, com data e hora.
- **Gráficos diário e semanal:** painéis do **Grafana** incorporados às páginas da aplicação.
- **API interna em JSON:** rotas que devolvem a última temperatura e a última umidade registradas.
- **Chatbot de perguntas rápidas:** botões como “Qual é a temperatura?” consultam a API e respondem na conversa.
- **Área de usuário:** cadastro, login, edição de perfil e recuperação de senha com código enviado por e-mail.

O projeto foi desenvolvido entre maio e novembro de 2024 por uma equipe de sete pessoas, com papéis de Product Owner, liderança técnica, UX/UI e desenvolvimento, seguindo a metodologia Scrum.

## O que aprendi

- Estruturar uma aplicação MVC com rotas, controllers, models e migrations no Laravel.
- Expor dados em endpoints JSON e consumi-los no front-end com JavaScript (`fetch`).
- Integrar uma ferramenta de visualização (Grafana) a uma aplicação web própria.
- Implementar fluxos de autenticação e recuperação de senha.
- Trabalhar em equipe com papéis definidos e entregas iterativas.
