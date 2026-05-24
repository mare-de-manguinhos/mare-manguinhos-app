# Research: CarrinhoScreen

**Phase**: 0 — Outline & Research  
**Feature**: CarrinhoScreen — Carrinho de Compras  
**Date**: 2026-05-24

---

## Technical Stack (already established by constitution)

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Language | TypeScript 5.9 | Constitutive requirement; all types centralized in `src/types/index.ts` |
| UI Framework | React Native 0.81 + Expo 54 | Managed workflow, established in constitution |
| Styling | NativeWind (Tailwind CSS) | Design tokens already defined (`bg-areia`, `text-terracota`, etc.) |
| State Management | Zustand 5 | `carrinhoStore` already scaffolded; no additional dependencies needed |
| Navigation | React Navigation 7 (bottom tabs) | CarrinhoScreen is a direct tab, no stack wrapper needed |
| HTTP Client | Axios | Not needed for this screen (local data only) |
| Storage | None | Carrinho is in-memory Zustand; no persistence for MVP |
| Icons | `@expo/vector-icons` (Ionicons) | Already used across the app (`cart`, `cart-outline`, `trash-outline`) |
| Testing | Not yet configured | No test framework in `devDependencies` — deferred to project-level setup |

---

## Design Tokens (already established)

| Token | Hex | Usage in CarrinhoScreen |
|-------|-----|------------------------|
| bg-areia | #FDF6EC | Screen background |
| bg-espuma | #FAFCFD | Card backgrounds |
| bg-terracota | #D45D4A | Primary buttons (Ir para Checkout) |
| text-terracota | #D45D4A | Highlighted values, prices |
| text-ardosia | #2D3436 | Primary text |
| text-marinha | #3A9D8F | Secondary text, labels |
| border-pedra-mar | #D6CFC4 | Card borders |
| bg-mangue | #2C7865 | Success toast (reuse from ProdutoScreen) |

---

## Store Contract (carrinhoStore)

Current `carrinhoStore.ts` needs updates per clarification:

| Change | Current | Required |
|--------|---------|----------|
| `adicionarItem` | Always pushes new entry | Merge weight if same (produtoId, corte) exists |
| `removerItem` | `(produtoId: string)` | `(produtoId: string, corte: Corte)` |
| `itens` | `ItemCarrinho[]` | OK, no changes needed |
| `total` | Computed sum | OK, no changes needed |

No NEEDS CLARIFICATION remains — all resolved in spec clarifications session.
