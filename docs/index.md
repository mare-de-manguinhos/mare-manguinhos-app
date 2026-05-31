# Maré de Manguinhos

**App Consumidor** — Conectando consumidores a pescadores artesanais de Manguinhos (Serra, ES).

## Sobre o Projeto

O Maré de Manguinhos é um aplicativo mobile que permite aos moradores de Manguinhos e região comprar peixe fresco diretamente dos pescadores artesanais da comunidade. O app oferece uma vitrine digital com produtos disponíveis em tempo real, escolha de corte (inteiro, limpo ou filé), carrinho de compras, checkout com pagamento digital e acompanhamento de entregas.

## Documentação

| Seção | Descrição |
|-------|-----------|
| [PRD](prd-mvp-app-mare-manguinhos.md) | Product Requirements Document — problema, público-alvo, escopo do MVP, métricas de sucesso |
| [Arquitetura](arch-mvp-app-mare-manguinhos.md) | Arquitetura em camadas (UI → State → Data), fluxo de dados, estrutura de pastas, decisões técnicas |
| [Rotas da API](map-routes-backend-mare-manguinhos.md) | Mapeamento tela-a-tela dos endpoints necessários para o MVP |
| [Codebase](codebase/overview.md) | Visão geral da estrutura do código-fonte e suas camadas |

## Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | React Native + Expo (managed workflow) |
| **Linguagem** | TypeScript |
| **Estilização** | NativeWind (Tailwind CSS) |
| **Navegação** | React Navigation (Stack + Bottom Tabs) |
| **Estado Global** | Zustand |
| **HTTP Client** | Axios |
| **Armazenamento Seguro** | expo-secure-store |

## Links

- [Repositório no GitHub](https://github.com/manguinhos-ifes/mare-manguinhos-app)
- [Protótipo no Figma](https://www.figma.com/design/SfFC5RLT8ftEcnYLFErAq9/MVP---Mare-de-Manguinhos)

---

> Projeto de Extensão Universitária — Ifes Serra (2025/2026)
