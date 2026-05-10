<!--
  SYNC IMPACT REPORT
  Version change: [unversioned template] → 1.0.0
  Modified principles: N/A — ratificação inicial
  Added sections:
    - Core Principles (7 princípios)
    - Stack Tecnológico e Dependências
    - Workflow de Desenvolvimento
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (Constitution Check section é dinâmico, sem alteração necessária)
    - .specify/templates/spec-template.md ✅ (sem alteração necessária)
    - .specify/templates/tasks-template.md ✅ (sem alteração necessária)
  Follow-up TODOs: None
-->

# Maré de Manguinhos Constitution

## Core Principles

### I. Arquitetura em Camadas (NON-NEGOTIÁVEL)

O app DEVE seguir uma Layered Architecture com fluxo de dados unidirecional em três camadas:
**UI Layer** (telas e componentes React Native com NativeWind) → **State Layer** (stores Zustand) → **Data Layer** (services Axios).

- Nenhuma tela ou componente DEVE conter chamadas HTTP diretamente; toda comunicação com a API DEVE passar pelos services da Data Layer.
- Nenhuma store DEVE conter lógica de renderização, navegação ou apresentação visual; stores são exclusivamente de estado e efeitos colaterais de dados.
- A Data Layer DEVE ser composta de services tipados derivados de uma instância base `api.ts` (Axios); não são permitidos múltiplos clientes HTTP paralelos.
- Violações desta camada bloqueiam aprovação de PR.

### II. TypeScript Estrito em Todas as Camadas

TypeScript é a única linguagem permitida no codebase. A tipagem estática é obrigatória e não opcional.

- O uso de `any` é PROIBIDO sem comentário explícito `// TODO: tipar` aprovado pelo time; ESLint DEVE flagrar `@typescript-eslint/no-explicit-any`.
- Todos os tipos de domínio central (`Produto`, `Pescador`, `ItemCarrinho`, `Pedido`, `DadosCheckout`, `Corte`, `StatusPedido`) DEVEM ser definidos exclusivamente em `src/types/index.ts` e importados de lá por todas as camadas.
- Nenhum tipo duplicado ou paralelo ao de `src/types/index.ts` é permitido.
- Props de componentes DEVEM ter interfaces TypeScript explícitas; nenhum componente de produção pode receber props sem tipagem.

### III. Segurança por Design

A segurança do consumidor é não-negociável, especialmente para dados de autenticação e pagamento.

- Tokens JWT DEVEM ser armazenados **exclusivamente** via `expo-secure-store`; é PROIBIDO usar `AsyncStorage`, `localStorage` ou qualquer outro mecanismo de persistência para credenciais.
- Nenhuma chave de API, secret ou credencial DEVE ser commitada no repositório; variáveis de ambiente sensíveis usam `.env` listado no `.gitignore`.
- Toda lógica de pagamento DEVE ser delegada integralmente ao gateway externo (Mercado Pago ou Stripe); dados de cartão nunca passam pelo app em texto puro.
- Rotas protegidas DEVEM verificar o estado de autenticação via `authStore` antes de renderizar conteúdo sensível.

### IV. Domínio Centralizado e Sem Duplicação

A modelagem de domínio é a fonte única de verdade para todo o codebase.

- `src/types/index.ts` é o único arquivo de definição de tipos de domínio; edições a tipos de domínio são feitas lá e propagadas automaticamente para todas as camadas.
- Nenhum service, store ou componente pode redefinir localmente uma entidade já tipada em `src/types/index.ts`.
- As stores Zustand cobertas pelo MVP são: `authStore`, `carrinhoStore`, `pedidoStore`; novos stores DEVEM ser justificados e revisados antes de serem adicionados.
- Os services cobertos pelo MVP são: `vitrineService`, `pedidoService`, `authService`, `pagamentoService`; todos derivam da instância base `api.ts`.

### V. Isolamento por Feature e Independência de Desenvolvimento

A estrutura feature-based é o contrato organizacional do time acadêmico.

- O diretório `src/screens/` é organizado por domínio: `auth/`, `vitrine/`, `carrinho/`, `checkout/`, `pedido/`, `perfil/`. Nenhuma tela de um domínio importa diretamente de outro domínio; comunicação entre features se dá via stores ou navegação.
- `src/components/ui/` contém componentes atômicos reutilizáveis sem conhecimento de domínio; `src/components/shared/` contém componentes compostos com conhecimento de domínio.
- Cada feature DEVE poder ser desenvolvida, testada e demonstrada de forma independente, sem exigir que outra feature esteja completa.
- Conflitos de merge oriundos de edição cruzada entre domínios são indicativo de violação desta separação.

### VI. Escopo MVP Disciplinado (YAGNI)

O time de extensão universitária DEVE priorizar a entrega do MVP funcional sobre a antecipação de funcionalidades futuras.

- Features fora do escopo MVP (login social, notificações push, programa de fidelidade, reviews, módulo B2B) NÃO DEVEM ser implementadas ou preparadas antecipadamente.
- Formulários no MVP DEVEM ser resolvidos com `useState` simples; bibliotecas de formulário (React Hook Form, Formik, etc.) NÃO SÃO permitidas no MVP.
- Cache client-side complexo NÃO É permitido; estados de `loading` e `error` por tela são suficientes; nenhuma estratégia de cache como React Query ou SWR é adotada no MVP.
- Toda adição de dependência DEVE ser justificada no PR; o ecossistema Expo gerenciado é a restrição de compatibilidade; dependências nativas não gerenciadas pelo Expo são PROIBIDAS.

### VII. Colaboração Acadêmica via Git (NON-NEGOTIÁVEL)

O fluxo Git é o mecanismo de colaboração e rastreabilidade do time em formação.

- Todos os commits DEVEM seguir **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`. Commits sem prefixo convencional são rejeitados no PR.
- Todo trabalho novo DEVE partir de uma feature branch com nomenclatura `feature/<nome-da-feature>` a partir de `main`; commits diretos em `main` são PROIBIDOS.
- Pull Requests DEVEM ter no mínimo uma revisão de par antes do merge.
- A branch `main` DEVE sempre representar um estado deployável e funcional do app.

## Stack Tecnológico e Dependências

Este projeto é um aplicativo mobile multiplataforma (iOS e Android) construído sobre o ecossistema **Expo gerenciado**.

**Plataforma e Linguagem**
- Runtime: React Native + Expo (managed workflow)
- Linguagem: TypeScript (obrigatório, sem exceções)
- Plataformas-alvo: iOS 15+ e Android 10+

**UI e Estilização**
- Estilização: NativeWind com sintaxe Tailwind CSS
- Navegação: React Navigation com stacks e bottom tabs

**Estado e Dados**
- Gerenciamento de estado global: Zustand
- Comunicação HTTP: Axios (instância base `api.ts`)
- Armazenamento seguro: expo-secure-store (exclusivo para JWT)

**Backend**
- A API REST é desenvolvida por uma equipe separada; o frontend consome os endpoints via Axios sem conhecer os detalhes de implementação do backend.

**Escopo Técnico do MVP**
- Cadastro e login por e-mail
- Vitrine hiperlocal por pescador
- Página de produto com escolha de corte (inteiro / limpo / filé)
- Carrinho de compras
- Checkout com endereço e janela de entrega
- Cálculo de frete
- Pagamento via Pix e cartão (gateway externo)
- Acompanhamento de status do pedido
- Histórico de pedidos

## Workflow de Desenvolvimento

O time de extensão universitária segue um fluxo de desenvolvimento acadêmico colaborativo, priorizando aprendizado e entrega incremental.

**Branches e Commits**
- `main`: branch de produção protegida; sempre deployável
- `feature/<nome>`: branch de trabalho criada a partir de `main` para cada nova funcionalidade
- Mensagens de commit: Conventional Commits obrigatório (ver Princípio VII)

**Revisão de Código**
- PRs DEVEM descrever o que foi feito, como testar e screenshots/gravações de tela quando relevante
- Toda PR DEVE ser revisada por ao menos um outro membro antes do merge
- PR em conflito com um princípio desta constituição NÃO pode ser mergeada sem documentar e aprovar uma exceção

**Constitution Check em PRs**
Toda PR DEVE verificar:
- [ ] Nenhuma chamada HTTP em telas ou componentes (Princípio I)
- [ ] Nenhum `any` sem justificativa (Princípio II)
- [ ] JWT apenas em expo-secure-store (Princípio III)
- [ ] Tipos de domínio somente em `src/types/index.ts` (Princípio IV)
- [ ] Feature não importa diretamente de outro domínio (Princípio V)
- [ ] Nenhuma feature out-of-MVP implementada (Princípio VI)
- [ ] Commit messages seguem Conventional Commits (Princípio VII)

## Governance

Esta constituição é a fonte de autoridade para decisões de arquitetura e processo no projeto Maré de Manguinhos. Ela DEVE ser consultada antes de qualquer decisão de design significativa.

- **Emendas**: Qualquer alteração à constituição DEVE ser proposta via PR dedicado, justificada com contexto e aprovada por consenso do time. A versão DEVE ser incrementada seguindo Semantic Versioning: MAJOR para remoção/redefinição de princípios; MINOR para adição de princípio ou seção; PATCH para refinamentos de redação.
- **Precedência**: Em caso de conflito entre esta constituição e qualquer outra prática, convenção ou sugestão de ferramenta, esta constituição prevalece.
- **Revisão de Conformidade**: A aderência aos princípios é verificada no Constitution Check de cada PR. Violações recorrentes de um princípio DEVEM ser endereçadas em reunião de time.
- **Exceções**: Exceções a qualquer princípio DEVEM ser documentadas no PR como `EXCEÇÃO: <princípio> — <justificativa>` e aprovadas explicitamente pelo time.
- **Contexto Acadêmico**: Por ser um projeto de extensão universitária, a constituição também serve como guia de aprendizado; o time é encorajado a discutir os princípios e propor melhorias como parte do processo formativo.

**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
