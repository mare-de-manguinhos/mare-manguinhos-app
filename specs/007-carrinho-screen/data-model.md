# Data Model: CarrinhoScreen

**Phase**: 1 — Design & Contracts  
**Feature**: CarrinhoScreen — Carrinho de Compras  
**Date**: 2026-05-24

---

## Entities

### ItemCarrinho (already exists in `src/types/index.ts`)

```typescript
export interface ItemCarrinho {
  produto: Produto;        // Snapshot at addition time (precoPorKg frozen)
  corte: Corte;            // 'inteiro' | 'limpo' | 'file'
  pesoKg: number;          // Weight in kg, merged when same (produtoId, corte)
}
```

**Chave única**: `(produto.id, corte)`

**Regras**:
- Se uma entrada com mesmo `produto.id` e `corte` já existe, o `pesoKg` é incrementado (merge), não criando nova entrada
- Se `produto.id` é diferente ou `corte` é diferente, nova entrada é criada
- Remoção é feita pelo par `(produtoId, corte)`

### CarrinhoStore Interface (in `src/types/index.ts`, implementado em `src/store/carrinhoStore.ts`)

**Changes required from current implementation**:

| Action | Current Signature | Required Signature |
|--------|-------------------|-------------------|
| `adicionarItem` | `(produto, corte, pesoKg)` — always pushes | `(produto, corte, pesoKg)` — merge if same key |
| `removerItem` | `(produtoId: string)` | `(produtoId: string, corte: Corte)` |
| `limpar` | `() => void` | No change |
| `total` | `() => number` | No change (sum of all items) |

### Data Flow

```
ProdutoScreen
  └─► carrinhoStore.adicionarItem(produto, corte, pesoKg)
       ├─ merge: se (produtoId, corte) existe → pesoKg += novoPeso
       └─ nova entrada: se não existe → push novo ItemCarrinho

CarrinhoScreen
  ├─► carrinhoStore.itens ──► renderiza lista de cards
  ├─► carrinhoStore.total() ──► exibe subtotal no rodapé
  └─► carrinhoStore.removerItem(produtoId, corte) ──► remove entrada da lista

CheckoutScreen (fora do escopo)
  └─► carrinhoStore.itens ──► lê do mesmo store global
  └─► carrinhoStore.limpar() ──► (após pedido confirmado)
```

## Validation Rules

| Campo | Regra | Origem |
|-------|-------|--------|
| `pesoKg` | > 0 | Garantido pela ProdutoScreen (controle não permite 0 ou negativo) |
| `corte` | Deve ser um dos valores de `Corte[]` | Garantido pelo tipo TypeScript |
| Merge | `pesoKg` não deve exceder `pesoDisponivel` do produto | (Nota: validação de estoque é na adição, não no carrinho) |

## State Transitions

```
Carrinho Vazio ──► adicionarItem() ──► Carrinho com Itens
Carrinho com Itens ──► removerItem() ──► Carrinho com Itens (ou Vazio se último)
Carrinho com Itens ──► checkout + limpar() ──► Carrinho Vazio
```
