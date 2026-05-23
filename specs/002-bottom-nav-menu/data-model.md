# Data Model: Navegação (Bottom Tabs)

## Navigation Tree

```
RootNavigator (decide via authStore.token)
├── AuthNavigator (Stack — já existe)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── AppNavigator (Bottom Tabs — feature atual)
    ├── Tab: Vitrine
    │   └── VitrineStack (Stack)
    │       ├── VitrineScreen
    │       └── ProdutoScreen
    ├── Tab: Carrinho
    │   └── CarrinhoScreen
    ├── Tab: Pedidos
    │   └── PedidosStack (Stack)
    │       ├── HistoricoScreen
    │       └── AcompanhamentoScreen
    └── Tab: Perfil
        └── PerfilScreen
```

## Navigator Entities

### Tab (AppNavigator)

| Attribute | Type | Description |
|-----------|------|-------------|
| name | `Vitrine \| Carrinho \| Pedidos \| Perfil` | Identificador único da aba |
| label | `string` | Rótulo exibido no menu ("Vitrine", "Carrinho", "Pedidos", "Perfil") |
| icon | `{ active: string, inactive: string }` | Nomes dos ícones Ionicons para estado ativo/inativo |
| component | `React.ComponentType` | Tela ou Stack Navigator associado |
| hasStack | `boolean` | Se a aba contém um Stack Navigator interno |

### Stack (VitrineStack / PedidosStack)

| Attribute | Type | Description |
|-----------|------|-------------|
| screens | `Screen[]` | Lista de telas na pilha |
| initialScreen | `string` | Tela inicial exibida ao entrar na aba |

### Screen

| Attribute | Type | Description |
|-----------|------|-------------|
| name | `string` | Nome usado na navegação (e.g., "Vitrine", "Produto") |
| component | `React.ComponentType` | Componente da tela |
| isPlaceholder | `boolean` | Se é uma tela placeholder (true para todas nesta feature) |

## State Transitions

### Tab Switching

```
[Usuário toca Tab X]
    → Tab X fica ativa (destaque visual)
    → Tab Y anterior fica inativa (estilo padrão)
    → Conteúdo da Tab X é exibido
    → Se Tab X já estava ativa: nada muda (lazy: true)
```

### Stack Navigation (VitrineStack / PedidosStack)

```
[Usuário na VitrineScreen]
    → navigate('Produto') → ProdutoScreen exibida
    → Botão voltar no header
    → Volta para VitrineScreen

[Usuário na HistoricoScreen]
    → navigate('Acompanhamento') → AcompanhamentoScreen exibida
    → Botão voltar no header
    → Volta para HistoricoScreen
```

## Validation Rules

- Nomes de tela DEVEM ser únicos dentro de cada Stack Navigator
- Cada aba DEVE ter exatamente um componente associado (tela ou stack)
- Telas placeholder DEVEM exibir ao menos o nome da tela como conteúdo
- Ícones DEVEM existir na família Ionicons do @expo/vector-icons
