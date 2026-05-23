# Vitrine Sections — Interface Contracts

**Phase**: 1 — Design & Contracts
**Source**: [spec.md](../spec.md) Functional Requirements

## Section Order & Layout Contract

A VitrineScreen é composta por 5 seções empilhadas verticalmente dentro de um container rolável:

| Order | Section | Variant | Conditional |
|-------|---------|---------|-------------|
| 1 | `SearchBar` | Barra de busca fixa no topo | Always |
| 2 | `Banner` | Imagem full-width com texto sobreposto | Only if banner != null |
| 3 | `NossosPescadores` | Scroll horizontal com avatares | Always (empty = mensagem) |
| 4 | `FiltrosCategoria` | Chips horizontais roláveis | Always |
| 5 | `DisponivelAgora` | Grid 2 colunas de cards | Always (empty = mensagem) |

## Component Contracts

### `SearchBar`

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Texto atual da busca |
| `onChangeText` | `(text: string) => void` | Callback de alteração |
| `onClear` | `() => void` | Limpar texto |
| `placeholder` | `string` | Placeholder text |

**Accessibility**: `accessibilityLabel="Buscar produtos"`

---

### `VitrineBanner`

| Prop | Type | Description |
|------|------|-------------|
| `titulo` | `string` | Título do banner |
| `subtitulo` | `string` | Subtítulo |
| `descricao` | `string` | Descrição |
| `imagem` | `string` | URL da imagem de fundo |

**Behavior**: Full-width, ~180px height, rounded bottom corners.

---

### `PescadorCard`

| Prop | Type | Description |
|------|------|-------------|
| `pescador` | `{ id, nome, foto }` | Dados do pescador |
| `selected` | `boolean` | Se está selecionado |
| `onPress` | `() => void` | Callback de toque |

**Behavior**: Avatar circular (fallback para inicial), nome abaixo. Destaque visual quando `selected`.

---

### `CategoriaChip`

| Prop | Type | Description |
|------|------|-------------|
| `categoria` | `{ id, nome }` | Dados da categoria |
| `active` | `boolean` | Se está ativo |
| `onPress` | `() => void` | Callback de toque |

**Behavior**: Chip horizontal. Fundo `#1A5F7A` + texto branco quando `active`. Fundo neutro quando inativo.

---

### `ProdutoCard`

| Prop | Type | Description |
|------|------|-------------|
| `produto` | `ProdutoResumo` | Dados resumidos do produto |
| `onPress` | `() => void` | Callback de toque → navega para ProdutoScreen |

**Behavior**: Card com imagem no topo, info abaixo. Badges coloridos no canto superior. Grid 2 colunas.

---

## Navigation Contract

```
VitrineStack (Stack Navigator)
  ├── VitrineScreen (this feature) — params: undefined
  └── ProdutoScreen (existing) — params: { produtoId: string }
```

Already implemented in `src/navigation/VitrineStack.tsx` and typed in `src/navigation/types.ts` as `VitrineStackParamList`.
