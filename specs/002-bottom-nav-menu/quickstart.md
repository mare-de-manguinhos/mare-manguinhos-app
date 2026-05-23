# Quickstart — Menu de Navegação Inferior

## O que será entregue

6 telas placeholder + menu inferior (bottom tabs) com 4 abas e stacks de navegação.

## Arquivos a criar/modificar

### Modificar
- `src/navigation/AppNavigator.tsx` — implementar bottom tabs com 4 abas

### Criar
- `src/navigation/VitrineStack.tsx` — stack navigator (Vitrine → Produto)
- `src/navigation/PedidosStack.tsx` — stack navigator (Historico → Acompanhamento)
- `src/navigation/types.ts` — tipos de navegação compartilhados
- `src/components/shared/TabIcon.tsx` — ícone customizado para abas
- `src/screens/vitrine/VitrineScreen.tsx` — placeholder
- `src/screens/vitrine/ProdutoScreen.tsx` — placeholder
- `src/screens/carrinho/CarrinhoScreen.tsx` — placeholder
- `src/screens/pedido/HistoricoScreen.tsx` — placeholder
- `src/screens/pedido/AcompanhamentoScreen.tsx` — placeholder
- `src/screens/perfil/PerfilScreen.tsx` — placeholder

## Dependências

Todas já instaladas no `package.json`:
- `@react-navigation/native` ✅
- `@react-navigation/bottom-tabs` ✅
- `@react-navigation/stack` ✅
- `@expo/vector-icons` (built-in no Expo) ✅

## Paleta de Cores (tailwind.config.js)

```js
colors: {
  'mar':        '#1A5F7A',  // primário escuro
  'oceano':     '#2E86AB',  // primário claro — aba ativa
  'marinha':    '#5A7A87',  // neutro — aba inativa
  'pedra-mar':  '#B8D4DC',  // neutro claro
  'areia':      '#FDF6EC',  // fundo
}
```

## Passos de Implementação

1. Criar `src/navigation/types.ts` com `AppTabParamList`, `VitrineStackParamList`, `PedidosStackParamList`
2. Criar 6 telas placeholder em `src/screens/*/` (cada uma exibe seu nome como título)
3. Criar `src/components/shared/TabIcon.tsx` com Ionicons (ativa/inativa)
4. Criar `src/navigation/VitrineStack.tsx` (VitrineScreen + ProdutoScreen)
5. Criar `src/navigation/PedidosStack.tsx` (HistoricoScreen + AcompanhamentoScreen)
6. Modificar `src/navigation/AppNavigator.tsx` — implementar bottom tabs
7. Verificar que `RootNavigator.tsx` não precisa de alterações

## Verificação

- App compila sem erros de tipo
- Ao logar, 4 abas aparecem no rodapé
- Tocar em cada aba mostra o placeholder correspondente
- Na aba Vitrine, navegar para Produto e voltar
- Na aba Pedidos, navegar para Acompanhamento e voltar
- Aba ativa destacada com cor `oceano`, inativas com `marinha`
