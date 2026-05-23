# Data Model: Vitrine Home Screen

**Phase**: 1 — Design & Contracts
**Source**: [spec.md](./spec.md) Key Entities + Backend doc `GET /api/app/vitrine`

## Entity: `VitrineData`

Root response object from `GET /api/app/vitrine`. All vitrine data in one payload.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `banner` | `Banner` | No | Banner promocional (null/undefined = ocultar seção) |
| `pescadores` | `Pescador[]` | Yes | Lista de pescadores ativos |
| `categorias` | `Categoria[]` | Yes | Lista de categorias para filtro |
| `produtos` | `ProdutoResumo[]` | Yes | Lista de produtos disponíveis |

---

## Entity: `Banner`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `titulo` | `string` | Yes | Título principal do banner |
| `subtitulo` | `string` | Yes | Subtítulo do banner |
| `descricao` | `string` | Yes | Descrição complementar |
| `imagem` | `string` (URL) | Yes | URL da imagem de fundo do banner |

---

## Entity: `Pescador`

Already exists in `src/types/index.ts`. Kept here for reference.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Identificador único |
| `nome` | `string` | Yes | Nome do pescador |
| `foto` | `string` (URL) | Yes | URL da foto de perfil |

---

## Entity: `Categoria`

Already exists in `src/types/index.ts` as `Categoria` (`'peixe' | 'crustaceo'`). But for the vitrine response, categorias include display name.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | `"todos"`, `"peixe"`, `"crustaceo"` |
| `nome` | `string` | Yes | `"Todos"`, `"Peixes"`, `"Crustáceos"` |

---

## Entity: `ProdutoResumo`

Simplified version of `Produto` for vitrine display. The full `Produto` (with `cortesDisponiveis`, `descricao`, `categoria`) is used in ProdutoScreen.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Identificador único do produto |
| `especie` | `string` | Yes | Nome da espécie (ex: "Robalo", "Camarão Rosa") |
| `foto` | `string` (URL) | Yes | URL da foto do produto |
| `precoPorKg` | `number` | Yes | Preço por quilograma |
| `pesoDisponivel` | `number` | Yes | Quantidade disponível em kg |
| `badges` | `string[]` | No | Array de badges: "Hoje", "Premium", "Favorito" |
| `pescador` | `{ id: string, nome: string }` | Yes | Info resumida do pescador |

---

## Entity: `FiltroAtivo`

Local state entity for filter management (not from API).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `pescadorId` | `string` | No | `null` | Filtro ativo por pescador |
| `categoriaId` | `string` | No | `"todos"` | Filtro ativo por categoria |
| `buscaTermo` | `string` | No | `""` | Termo de busca textual |

---

## Validation Rules (from spec)

| Rule | Source |
|------|--------|
| Banner ausente (null/undefined) → ocultar seção inteira | FR-014 |
| Pescadores vazios → "Nenhum pescador disponível" | FR-020 |
| Produtos vazios → "Nenhum produto disponível no momento" | FR-029 |
| Busca ignora termos < 2 caracteres | FR-010 |
| Filtros de pescador e categoria são combináveis | FR-023 |
| Toggle: tocar no mesmo pescador remove o filtro | FR-018 |

---

## State Transitions

```
INITIAL
  │
  ├── carregando → LOADING (skeleton/spinner)
  │
  ├── sucesso → LOADED (exibir vitrine completa)
  │                │
  │                ├── aplica filtro pescador → FILTERED
  │                ├── aplica filtro categoria → FILTERED
  │                ├── digita busca → SEARCHED
  │                └── toca card → NAVIGATE (ProdutoScreen)
  │
  └── erro → ERROR (mensagem + "Tentar novamente")
               │
               └── toca "Tentar novamente" → LOADING
```
