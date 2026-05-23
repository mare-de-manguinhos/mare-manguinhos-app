# Arquitetura — Maré de Manguinhos (App Consumidor)

> Documento de referência técnica para o time de desenvolvimento.
> Leitura recomendada antes de escrever qualquer linha de código.

---

## 1. Visão Geral

A arquitetura adotada é uma variação do padrão **Layered Architecture** (Arquitetura em Camadas), adaptada para o mundo React Native. Dentro do ecossistema React/React Native, ela também é chamada de **Feature-Sliced** quando as pastas são organizadas por domínio — que é exatamente o que foi adotado aqui.

Não é nada inventado: é o padrão mais adotado em projetos React Native profissionais justamente por ser **simples de entender e escalar**. O princípio unificador de tudo é a **Separação de Responsabilidades** (*Separation of Concerns*): cada arquivo, cada camada e cada função sabe fazer uma coisa — e faz bem feito.

```
┌─────────────────────────────────────────────┐
│         UI Layer (Telas + Componentes)       │  React Native + NativeWind
├─────────────────────────────────────────────┤
│         State Layer (Estado Global)          │  Zustand
├─────────────────────────────────────────────┤
│         Data Layer (Serviços de API)         │  Axios → Backend (outra equipe)
└─────────────────────────────────────────────┘
```

**Fluxo de dados — unidirecional:**

```
Tela → chama action do Store → Store chama Service → API retorna → Store atualiza → Tela re-renderiza
```

Pense nas camadas como uma **linha de montagem**: cada etapa tem uma única responsabilidade e só se comunica com a etapa adjacente. A tela não sabe de HTTP. O store não sabe de botões. O service não sabe de estado.

---

## 2. As 3 Camadas

### 2.1 UI Layer — Telas e Componentes

É tudo que o usuário **vê e interage**: telas, botões, listas, cards.

**Regra de ouro:** a UI não sabe de onde os dados vêm. Ela só sabe *exibir* o que recebe e *reagir* ao que o usuário faz.

```
Usuário toca "Adicionar ao Carrinho"
         │
         ▼
Tela chama uma função do Store
(ela não sabe o que acontece depois — não é problema dela)
```

Uma tela bem feita nessa arquitetura é como um **controle remoto**: tem botões que disparam ações, mas não tem motor dentro.

---

### 2.2 State Layer — Stores com Zustand

#### O que é um Store?

Um **Store** é um depósito central de informações que qualquer tela do app pode acessar e modificar — é a "memória" do app.

Sem um Store, você precisaria ficar passando informação de tela em tela como um "telefone sem fio". Isso se chama **prop drilling** e se torna um pesadelo à medida que o app cresce.

```
// ❌ Sem Store — informação viaja de mão em mão
VitrineScreen → prop → CarrinhoScreen → prop → BadgeTab
```

```
// ✅ Com Store — todas as telas apontam para o mesmo lugar
         ┌─────────────────┐
         │  carrinhoStore  │  ← fonte única da verdade
         │  itens: [...]   │
         └────────┬────────┘
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
  VitrineScreen  CarrinhoScreen  BadgeTab
```

Quando o Store muda, **todas as telas que dependem dele atualizam automaticamente** — sem você fazer nada.

#### Por que Zustand?

| Opção | Problema |
|---|---|
| `useState` em cada tela | Não compartilha estado entre telas |
| `Context API` | Funciona, mas causa re-renders desnecessários e exige muito código repetido |
| `Redux` | Muito boilerplate (actions, reducers, dispatchers) — over-engineering para esse escopo |
| **Zustand** ✅ | API mínima, sem boilerplate, resolve exatamente o que precisamos |

#### Exemplo de Store

```typescript
const useCarrinhoStore = create((set, get) => ({
  // DADOS
  itens: [],

  // AÇÕES
  adicionarItem: (produto, corte, peso) =>
    set((state) => ({ itens: [...state.itens, { produto, corte, peso }] })),

  removerItem: (produtoId) =>
    set((state) => ({ itens: state.itens.filter(i => i.produto.id !== produtoId) })),

  // DADO CALCULADO
  total: () =>
    get().itens.reduce((acc, i) => acc + i.produto.precoPorKg * i.pesoKg, 0),
}));
```

Uso em qualquer tela — sem passar props, sem contexto complexo:

```typescript
const { itens, adicionarItem } = useCarrinhoStore();
```

---

### 2.3 Data Layer — Services com Axios

É a camada que **conversa com o mundo externo** — no caso, o backend desenvolvido pela outra equipe.

**Regra de ouro:** nenhuma tela deve ter código de chamada HTTP dentro dela. Isso fica isolado nos Services.

#### Por que isso importa?

Se o backend mudar a rota `/produtos` para `/estoque/produtos`, você altera **um único arquivo** (`vitrineService.ts`) — nenhuma tela precisa ser tocada.

```typescript
// services/vitrineService.ts — único lugar que conhece a API
export const vitrineService = {
  listarProdutos: () => api.get('/produtos'),
  buscarProduto:  (id: string) => api.get(`/produtos/${id}`),
};
```

```typescript
// Store — chama o service, não a API diretamente
const { data } = await vitrineService.listarProdutos();
```

---

## 3. O Papel do TypeScript

O TypeScript atua como uma **cola entre as camadas**. Os tipos definidos em `types/index.ts` garantem que as três camadas "falem a mesma língua":

```
Data Layer retorna um objeto Produto
    └── State Layer espera receber um Produto
          └── UI Layer sabe exatamente quais campos exibir
```

Se o backend mudar o nome de um campo, o TypeScript aponta o erro em compilação — antes de virar bug em produção. Para um time em formação, isso é especialmente valioso: **o compilador age como um revisor automático**.

---

## 4. Fluxo Completo — Exemplo Real

Usando o fluxo de **fazer um pedido** como exemplo:

```
1. USUÁRIO
   Toca "Confirmar Pedido" no CheckoutScreen

2. UI LAYER (CheckoutScreen)
   Chama: pedidoStore.fazerPedido(dadosCheckout)
   Exibe: spinner de loading enquanto aguarda

3. STATE LAYER (pedidoStore)
   Recebe os dados do checkout
   Chama: pedidoService.criar(dadosCheckout)

4. DATA LAYER (pedidoService)
   Faz: POST /pedidos → Backend da outra equipe
   Retorna: Pedido criado com ID e status inicial

5. DE VOLTA AO STORE
   pedidoStore salva o pedido em `pedidoAtivo`
   carrinhoStore.limpar() é chamado

6. UI ATUALIZA AUTOMATICAMENTE
   CheckoutScreen detecta mudança e navega para AcompanhamentoScreen
```

Cada camada fez **só o seu trabalho**.

---

## 5. Estrutura de Pastas

```
src/
├── navigation/
│   ├── RootNavigator.tsx       # decide entre AuthNavigator e AppNavigator
│   ├── AuthNavigator.tsx       # stack de login e cadastro
│   └── AppNavigator.tsx        # bottom tabs do app principal
│
├── screens/                    # telas organizadas por domínio
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── vitrine/
│   │   ├── VitrineScreen.tsx   # listagem de produtos por pescador
│   │   └── ProdutoScreen.tsx   # detalhes + escolha de corte
│   ├── carrinho/
│   │   └── CarrinhoScreen.tsx
│   ├── checkout/
│   │   └── CheckoutScreen.tsx  # endereço + frete + pagamento
│   ├── pedido/
│   │   ├── AcompanhamentoScreen.tsx
│   │   └── HistoricoScreen.tsx
│   └── perfil/
│       └── PerfilScreen.tsx
│
├── components/
│   ├── ui/                     # atômicos: Button, Input, Badge, Card...
│   └── shared/                 # compostos: ProdutoCard, PescadorCard, StatusBadge...
│
├── store/
│   ├── authStore.ts
│   ├── carrinhoStore.ts
│   └── pedidoStore.ts
│
├── services/
│   ├── api.ts                  # instância base do Axios (baseURL, headers, interceptors)
│   ├── authService.ts
│   ├── vitrineService.ts
│   ├── pedidoService.ts
│   ├── pagamentoService.ts
│   ├── perfilService.ts
│   └── freteService.ts
│
├── hooks/                      # lógica reutilizável entre telas
│   ├── useVitrine.ts
│   └── usePedido.ts
│
├── types/
│   └── index.ts                # todos os tipos e interfaces do app
│
└── utils/
    └── formatters.ts           # formatarMoeda, formatarPeso, formatarData...
```

> **Por que pastas por domínio?** Cada aluno pode trabalhar em uma feature (vitrine, carrinho, pedido) sem conflito com o trabalho dos colegas. É mais fácil de navegar e de revisar do que separar por tipo de arquivo.

---

## 6. Navegação

```
RootNavigator
├── AuthNavigator (Stack)          ← exibido quando não autenticado
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppNavigator (Bottom Tabs)     ← exibido quando autenticado
    ├── Tab: Vitrine (Stack)
    │   ├── VitrineScreen
    │   └── ProdutoScreen
    ├── Tab: Carrinho
    │   └── CarrinhoScreen
    ├── Tab: Pedidos (Stack)
    │   ├── HistoricoScreen
    │   └── AcompanhamentoScreen
    └── Tab: Perfil
        └── PerfilScreen
```

O `RootNavigator` lê o `authStore` para decidir qual stack exibir — sem lógica de negócio nas telas.

---

## 7. Definição dos Stores

```typescript
// store/authStore.ts
interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// store/carrinhoStore.ts
interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) => void;
  removerItem: (produtoId: string) => void;
  limpar: () => void;
  total: () => number;
}

// store/pedidoStore.ts
interface PedidoStore {
  pedidoAtivo: Pedido | null;
  historico: Pedido[];
  fazerPedido: (checkout: DadosCheckout) => Promise<void>;
  atualizarStatus: (pedidoId: string) => Promise<void>;
}
```

---

## 8. Camada de Serviços

```typescript
// services/api.ts — instância base compartilhada por todos os services
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// injeta token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```typescript
// services/pedidoService.ts
export const pedidoService = {
  criar:           (dados: DadosCheckout) => api.post<Pedido>('/pedidos', dados),
  buscarStatus:    (id: string) => api.get<Pedido>(`/pedidos/${id}`),
  listarHistorico: () => api.get<Pedido[]>('/pedidos/meus'),
};

// services/perfilService.ts
export const perfilService = {
  buscar:          () => api.get<Usuario>('/api/app/perfil'),
  atualizar:       (dados: Partial<Pick<Usuario, 'nome' | 'telefone'>>) =>
    api.put<Usuario>('/api/app/perfil', dados),
  listarEnderecos: () => api.get<Endereco[]>('/api/app/enderecos'),
  criarEndereco:   (dados: EnderecoInput) => api.post<Endereco>('/api/app/enderecos', dados),
  removerEndereco: (id: string) => api.delete(`/api/app/enderecos/${id}`),
};

// services/freteService.ts
export const freteService = {
  calcular: (params: { endereco: string; latitude?: number; longitude?: number }) =>
    api.post<{ valorFrete: number; prazoEstimadoMinutos: number }>('/api/app/frete/calcular', params),
};
```

---

## 9. Tipos Centrais

```typescript
// types/index.ts

type Corte = 'inteiro' | 'limpo' | 'file';

type Categoria = 'peixe' | 'crustaceo';

type StatusPedido = 'confirmado' | 'em_preparo' | 'a_caminho' | 'entregue' | 'cancelado';

type FormaPagamento = 'pix' | 'cartao';

interface Pescador {
  id: string;
  nome: string;
  foto: string;
}

interface Produto {
  id: string;
  especie: string;
  foto: string;
  precoPorKg: number;
  pesoDisponivel: number;      // em kg
  cortesDisponiveis: Corte[];
  badges?: string[];
  pescador: Pescador;
  categoria: Categoria;
}

interface ItemCarrinho {
  produto: Produto;
  corte: Corte;
  pesoKg: number;
}

interface Pedido {
  id: string;
  itens: ItemCarrinho[];
  status: StatusPedido;
  enderecoEntrega: string;
  janelaEntrega: string;
  frete: number;
  valorTotal: number;
  formaPagamento: FormaPagamento;
  criadoEm: string;
}

interface DadosCheckout {
  itens: ItemCarrinho[];
  enderecoEntrega: string;
  janelaEntrega: string;
  formaPagamento: FormaPagamento;
  frete: number;
  valorTotal: number;
}

interface Endereco {
  id: string;
  label: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}
```

---

## 10. Dependências

| Pacote | Papel na arquitetura |
|---|---|
| `expo` + `react-native` | Base do app |
| `typescript` | Tipagem estática — obrigatória desde o início |
| `nativewind` | Estilização com classes Tailwind |
| `@react-navigation/native` + `bottom-tabs` + `stack` | Navegação entre stacks e tabs |
| `zustand` | State management (auth, carrinho, pedido) |
| `axios` | HTTP client para comunicação com o backend |
| `expo-secure-store` | Persiste o token JWT com segurança no dispositivo |

> ⚠️ Use `expo-secure-store` para salvar o token de autenticação — **nunca** o `AsyncStorage` para dados sensíveis.

---

## 11. Decisões e Justificativas

| Decisão | Justificativa |
|---|---|
| **Feature-based folders** | Cada aluno trabalha em uma feature sem conflito com os colegas |
| **Zustand** em vez de Redux ou Context | API mínima, sem boilerplate, suficiente para o escopo do MVP |
| **Sem cache client-side complexo** | A vitrine muda constantemente; `loading/error` state por tela é suficiente |
| **Um único `api.ts`** | Centraliza baseURL e token — fácil trocar URL de homologação para produção |
| **`types/index.ts` unificado** | Mantém o contrato com o backend explícito num só lugar; facilita revisão |
| **Sem biblioteca de formulário no MVP** | `useState` simples resolve login, cadastro e checkout sem overhead extra |

---

## 12. Resumo

| Conceito | Em uma frase |
|---|---|
| **Arquitetura em camadas** | Cada parte do código tem uma responsabilidade única e bem definida |
| **Store (Zustand)** | Depósito central de dados compartilhados — a "memória" do app |
| **Services (Axios)** | Único lugar que fala com a API — se a API mudar, só ele muda |
| **Types (TypeScript)** | Contrato entre camadas — garante que todos falam a mesma língua |
| **Feature-based folders** | Pastas por domínio, não por tipo de arquivo |