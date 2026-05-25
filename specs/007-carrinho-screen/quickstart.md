# Quickstart: CarrinhoScreen

## What you're building

A cart screen for the delivery app — displays items added via ProdutoScreen, allows removal, shows subtotal, and navigates to checkout.

## Where to work

| File | Purpose | Status |
|------|---------|--------|
| `src/screens/carrinho/CarrinhoScreen.tsx` | Main screen UI | Placeholder — needs full implementation |
| `src/store/carrinhoStore.ts` | Cart state (Zustand) | Exists — needs merge logic + removerItem update |
| `src/types/index.ts` | Type definitions | Exists — `CarrinhoStore` interface needs update |

## Files to read first

1. `src/screens/vitrine/ProdutoScreen.tsx` — stlying patterns (NativeWind classes, acessibilidade, layout)
2. `src/components/ui/AppButton.tsx` — reusable button component
3. `src/store/carrinhoStore.ts` — current store implementation

## Data flow

```
ProdutoScreen ──► carrinhoStore.adicionarItem() ──► CarrinhoScreen lê itens
CarrinhoScreen ──► carrinhoStore.removerItem() ──► store atualiza → UI re-renderiza
CarrinhoScreen ──► navigation.navigate('Checkout') ──► CheckoutScreen lê carrinhoStore
```

## Key rules

- No API calls in this screen (local data only)
- Same product + same cut = merge weight (increment `pesoKg`)
- Different cut = separate entry
- Removal by `(produtoId, corte)` pair
- Use existing NativeWind design tokens (`bg-areia`, `bg-espuma`, `text-terracota`, etc.)
- All interactive elements need `accessibilityLabel`
