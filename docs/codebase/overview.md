# Visão Geral do Código-fonte

> Estrutura, organização e responsabilidades do código-fonte do app Maré de Manguinhos.

## Arquitetura em Camadas

O app segue uma **Layered Architecture** (Arquitetura em Camadas) com fluxo de dados unidirecional:

```
UI Layer (Telas + Componentes React Native com NativeWind)
    → State Layer (Stores Zustand)
        → Data Layer (Services Axios)
            → API Backend
```

Cada camada tem uma responsabilidade única e se comunica apenas com a camada adjacente.

## Estrutura de Diretórios

```
src/
├── navigation/        # Configuração de navegação (RootNavigator, AuthNavigator, AppNavigator, stacks)
├── screens/           # Telas organizadas por domínio (auth, vitrine, carrinho, checkout, pedido, perfil)
├── components/        # Componentes React Native
│   ├── ui/            #   Atômicos reutilizáveis (Button, Input, Chip, Badge...)
│   └── shared/        #   Compostos com conhecimento de domínio (ProdutoCard, PescadorCard...)
├── store/             # Stores Zustand (authStore, carrinhoStore, pedidoStore)
├── services/          # Services Axios (api.ts + services por domínio)
├── hooks/             # Custom hooks reutilizáveis
├── types/             # Tipos TypeScript centralizados (index.ts)
└── utils/             # Utilitários (formatters, formatCEP, formatPhone)
```

## Camada por Camada

### Navigation (`src/navigation/`)

Define a árvore de navegação do app usando React Navigation. O `RootNavigator` decide entre `AuthNavigator` (login/cadastro) e `AppNavigator` (4 abas principais) baseado no estado de autenticação.

| Arquivo | Responsabilidade |
|---------|-----------------|
| `RootNavigator.tsx` | Decisão auth vs app |
| `AuthNavigator.tsx` | Stack de autenticação |
| `AppNavigator.tsx` | Bottom tabs principal |
| `VitrineStack.tsx` | Stack Vitrine → Produto |
| `CarrinhoStack.tsx` | Stack Carrinho → Checkout |
| `PedidosStack.tsx` | Stack Histórico → Acompanhamento |
| `types.ts` | Tipos dos parâmetros de navegação |

### Screens (`src/screens/`)

Telas do app organizadas por domínio. Cada tela segue o padrão: consumir dados de uma store, exibir via componentes, disparar ações via store.

| Domínio | Telas |
|---------|-------|
| `auth/` | LoginScreen, RegisterScreen |
| `vitrine/` | VitrineScreen, ProdutoScreen |
| `carrinho/` | CarrinhoScreen |
| `checkout/` | CheckoutScreen |
| `pedido/` | AcompanhamentoScreen, HistoricoScreen |
| `perfil/` | PerfilScreen |

### Store (`src/store/`)

Gerenciamento de estado global com Zustand. Cada store é responsável por um domínio do app.

| Store | Responsabilidade |
|-------|-----------------|
| `authStore` | Autenticação (login, logout, token JWT) |
| `carrinhoStore` | Itens do carrinho (adicionar, remover, limpar, calcular total) |
| `pedidoStore` | Pedido ativo e histórico |

### Services (`src/services/`)

Camada de comunicação com a API. Todos os services derivam de uma instância base `api.ts` (Axios) que centraliza `baseURL`, headers e interceptors.

| Service | Endpoints |
|---------|-----------|
| `api.ts` | Instância base Axios |
| `authService.ts` | Cadastro, login, dados do usuário |
| `vitrineService.ts` | Vitrine, listagem de produtos |
| `pedidoService.ts` | Criar pedido, status, histórico |
| `pagamentoService.ts` | Geração Pix, pagamento cartão |
| `freteService.ts` | Cálculo de frete |
| `perfilService.ts` | Perfil, endereços |
| `cepService.ts` | Busca de CEP |

### Types (`src/types/index.ts`)

Arquivo único e centralizado com todos os tipos TypeScript do domínio: `Produto`, `Pescador`, `ItemCarrinho`, `Pedido`, `Corte`, `StatusPedido`, `Endereco`, `DadosCheckout`, etc.

### Components (`src/components/`)

- **`ui/`**: Componentes atômicos sem conhecimento de domínio (Button, Input, Chip, StepIndicator, TabIcon)
- **`shared/`**: Componentes compostos com conhecimento de domínio (ProdutoCard, PescadorCard, OceanHeader)

## Decisões de Projeto

| Decisão | Justificativa |
|---------|---------------|
| **Feature-based folders** | Cada aluno trabalha em uma feature sem conflito |
| **Zustand** | API mínima, sem boilerplate, suficiente para o MVP |
| **Sem cache client-side complexo** | Loading/error state por tela é suficiente |
| **Um único api.ts** | Centraliza baseURL e token |
| **types/index.ts unificado** | Contrato explícito num só lugar |
| **Sem biblioteca de formulário** | useState resolve sem overhead extra |

## Fluxo de Dados (Exemplo: Fazer Pedido)

```
Usuário toca "Confirmar Pedido"
    → CheckoutScreen chama pedidoStore.fazerPedido(dados)
        → pedidoStore chama pedidoService.criar(dados)
            → api.post('/pedidos', dados) → Backend
        → pedidoStore salva pedido em pedidoAtivo
    → UI atualiza automaticamente
    → Navega para AcompanhamentoScreen
```
