# Navigation Contracts

> Contratos de interface entre os navegadores e as telas do app.

## AppTabParamList (Bottom Tabs)

Contrato que define os parâmetros que cada aba aceita ao ser navegada.

```typescript
export type AppTabParamList = {
  Vitrine: undefined;
  Carrinho: undefined;
  Pedidos: undefined;
  Perfil: undefined;
};
```

- Nenhuma aba recebe parâmetros no MVP (`undefined`).
- O tipo `undefined` significa que a tela não espera `route.params`.

## VitrineStackParamList (Stack da aba Vitrine)

```typescript
export type VitrineStackParamList = {
  Vitrine: undefined;
  Produto: { produtoId: string };
};
```

- `Vitrine`: tela inicial — sem parâmetros.
- `Produto`: recebe `produtoId` para buscar detalhes (embora o placeholder ignore).

## PedidosStackParamList (Stack da aba Pedidos)

```typescript
export type PedidosStackParamList = {
  Historico: undefined;
  Acompanhamento: { pedidoId: string };
};
```

- `Historico`: tela inicial — sem parâmetros.
- `Acompanhamento`: recebe `pedidoId` para exibir status (embora o placeholder ignore).

## Tab Icon Contract

```typescript
interface TabIconConfig {
  name: 'Vitrine' | 'Carrinho' | 'Pedidos' | 'Perfil';
  iconFocused: keyof Ionicons.glyphMap;   // ex: 'storefront'
  iconNotFocused: keyof Ionicons.glyphMap; // ex: 'storefront-outline'
}
```

## Screen Placeholder Contract

Toda tela placeholder DEVE implementar:

```typescript
interface PlaceholderScreen {
  /** Nome visível exibido como título na tela */
  displayName: string;
  /** Grupo/domínio ao qual a tela pertence */
  domain: 'vitrine' | 'carrinho' | 'pedido' | 'perfil';
}
```
