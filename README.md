<div align="center">

# 🐟 Maré de Manguinhos — App Consumidor

**O "iFood da Maré" • Tradição no mar, inovação na entrega**

*Módulo Mobile — Plataforma do Consumidor*

---

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-blue)
![Disciplina](https://img.shields.io/badge/Ifes%20Serra-Extensão%20em%20Dev.%20de%20Software-green)

</div>

---

## 📌 Sobre este repositório

Este repositório contém o desenvolvimento do **módulo Consumidor** do ecossistema Maré de Manguinhos — a plataforma mobile que conecta moradores e compradores ao pescado fresco da Associação de Pescadores de Manguinhos, com entrega em domicílio e pagamento digital.

> ⚠️ **Escopo deste repositório:** apenas o app mobile do consumidor final (B2C).
> Os módulos de Gestão (painel admin) e do Pescador (bot WhatsApp) são desenvolvidos por equipes separadas.

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte da disciplina de **Extensão em Desenvolvimento de Software** do **Instituto Federal do Espírito Santo (Ifes) — Campus Serra**, sob orientação do professor **Paulo Sérgio dos Santos Júnior**.

A proposta integra os princípios de extensão universitária ao desenvolvimento de software, colocando a tecnologia a serviço de uma comunidade real com desafios reais.

---

## 🌊 Contexto do Projeto

Os pescadores artesanais de Manguinhos dependem de vendas físicas e imediatas no cais para escoar sua produção, o que os obriga a aceitar preços mais baixos e gera imprevisibilidade financeira para toda a comunidade.

O **Maré de Manguinhos** resolve esse problema criando um ecossistema digital hiperlocal de três módulos integrados. Este repositório é responsável pela ponta do consumidor: a vitrine digital e o fluxo de compra.

```
💬 WhatsApp do Pescador (outro módulo)
          │
          ▼
    🤖 IA + Backend (outro módulo)
          │
          ▼
📱 App do Consumidor  ◄── ESTE REPOSITÓRIO
```

---

## 📱 Funcionalidades do App

| Funcionalidade               | Descrição                                                                 |
|------------------------------|---------------------------------------------------------------------------|
| **Vitrine hiperlocal**       | Listagem de pescados disponíveis em tempo real, atualizada automaticamente conforme os barcos atracam |
| **Perfil do pescador**       | Cada pescador tem sua própria "loja" com foto e espécies disponíveis do dia |
| **Escolha de corte**         | O cliente seleciona a forma de preparo desejada: inteiro, limpo ou filé   |
| **Agendamento de entrega**   | Seleção de janela de horário para recebimento em domicílio                |
| **Pagamento digital**        | Integração com Pix e/ou cartão de crédito/débito diretamente no checkout     |
| **Cálculo de frete**         | Custo de entrega via motoboy parceiro calculado e exibido antes da confirmação |

---

## 🎨 Protótipo e Interface (UI/UX)

O fluxo de navegação e a interface do módulo do aplicativo foram desenhados visando uma experiência fluida. Este design serve como base visual e arquitetural para a implementação e tipagem dos componentes.

Você pode testar e explorar as telas através do protótipo interativo:

🚀 **[Acessar Protótipo Interativo (Figma)](https://pencil-person-24375050.figma.site/)**

---

## 🛠️ Tecnologias

> Escolhidas para equilibrar **baixa curva de aprendizado** e **aderência ao mercado atual**.

| Tecnologia | Função |
|---|---|
| [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) | Framework mobile cross-platform (iOS e Android com um único código) |
| [TypeScript](https://www.typescriptlang.org/) | Linguagem principal com tipagem estática |
| [NativeWind](https://www.nativewind.dev/) | Estilização com sintaxe Tailwind CSS |
| [React Navigation](https://reactnavigation.org/) | Navegação entre telas |
| [Zustand](https://zustand-demo.pmnd.rs/) | Gerenciamento de estado global |
| [Axios](https://axios-http.com/) | Consumo de APIs REST |

> 💡 **Para começar:** instale o [Node.js](https://nodejs.org/), o app **Expo Go** no seu celular e siga o [Quickstart do Expo](https://docs.expo.dev/get-started/create-a-project/).

---

## 👥 Público-Alvo

| Segmento                   | Perfil                                                                                 |
|----------------------------|----------------------------------------------------------------------------------------|
| **Moradores locais**       | Famílias e idosos de Manguinhos com vínculo emocional com a comunidade pesqueira       |
| **Consumidores premium**   | Moradores das regiões próximas dispostos a pagar pelo frescor e pela origem sustentável |

---

## 📊 Indicadores de Sucesso (MVP)

| Indicador                          | Meta              |
|------------------------------------|-------------------|
| Taxa de conversão da vitrine       | ≥ 15%             |
| Pedidos por semana                 | ≥ 30              |
| Ticket médio                       | ≥ R$ 45,00        |
| Taxa de recompra em 30 dias        | ≥ 30%             |
| Taxa de pedidos entregues          | ≥ 90%             |

---

## 🗺️ Roadmap

| Fase                  | Mês | Entregáveis deste módulo                                             |
|-----------------------|-----|----------------------------------------------------------------------|
| 🔬 **Prototipação**   | 1   | Protótipo navegável no Figma + validação com 10 potenciais clientes  |
| 🤖 **MVP**            | 2   | Vitrine mínima funcional integrada ao backend de estoque             |
| 🧑‍🤝‍🧑 **Onboarding**   | 3   | Integração de pagamento ativa + fluxo completo de checkout           |
| 🚀 **Lançamento**     | 4   | App aberto ao público + campanhas em Manguinhos e Laranjeiras        |

---

## 📁 Documentação

| Arquivo                      | Descrição                            |
|------------------------------|--------------------------------------|
| `prd-mvp-app-mare-manguinhos.md` | Product Requirements Document (PRD) |
| `pitch-app-mare-manguinhos.pptx` | Apresentação de proposta de produto |

---

## 🤝 Contribuindo

```bash
# 1. Faça um fork do repositório
# 2. Crie uma branch para sua feature
git checkout -b feature/minha-contribuicao

# 3. Commit suas alterações
git commit -m "feat: adiciona minha contribuição"

# 4. Envie para o seu fork
git push origin feature/minha-contribuicao

# 5. Abra um Pull Request
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Desenvolvido com 🐟 e ❤️ para a comunidade de Manguinhos

**Ifes Campus Serra — Extensão em Desenvolvimento de Software**
Professor: Paulo Sérgio dos Santos Júnior

</div>