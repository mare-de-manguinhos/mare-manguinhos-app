# Research: Menu de Navegação Inferior (Bottom Tabs)

## Decision: Icon Library for Tab Bars

- **Decision**: Usar `@expo/vector-icons` com a família **Ionicons**
- **Rationale**: O `@expo/vector-icons` já vem instalado por padrão no Expo managed workflow (sem necessidade de `npm install` adicional). Ionicons oferece ícones variados para navegação (storefront, cart, list, person) e suporta variações `outline` e `filled` para indicar aba ativa/inativa. A família MaterialCommunityIcons também é nativa do Expo e serve como fallback.
- **Alternatives considered**: react-native-vector-icons (exige link manual no iOS), @expo/vector-icons com MaterialIcons (menos variações de outline/filled).

## Decision: Tab Bar Styling Approach

- **Decision**: Estilizar via NativeWind classes + `tabBarStyle` do React Navigation
- **Rationale**: O projeto já usa NativeWind como sistema de estilização. As cores do tema (`mar`, `oceano`, `areia`) estão definidas no `tailwind.config.js` e podem ser referenciadas diretamente via className.
- **Alternatives considered**: Styled-components (não faz parte do stack), StyleSheet.create manual (possível mas quebra consistência com o tema NativeWind).

## Decision: Stack Navigator — `@react-navigation/stack` vs `@react-navigation/native-stack`

- **Decision**: Usar `@react-navigation/stack` (JS-based)
- **Rationale**: O `AuthNavigator.tsx` já usa `@react-navigation/stack`, então manter consistência evita adicionar outra dependência. A diferença de performance entre `stack` e `native-stack` é irrelevante para o MVP (2 telas por stack).
- **Alternatives considered**: `@react-navigation/native-stack` (não está no package.json, adicionaria dependência).

## Decision: Tab Icons Mapping

| Tab | Ionicons (active) | Ionicons (inactive) |
|-----|-------------------|---------------------|
| Vitrine | `storefront` | `storefront-outline` |
| Carrinho | `cart` | `cart-outline` |
| Pedidos | `receipt` | `receipt-outline` |
| Perfil | `person` | `person-outline` |

## Decision: Active Tab Color

- **Decision**: Usar a cor `oceano` (#2E86AB) para a aba ativa e `marinha` (#5A7A87) ou `pedra-mar` (#B8D4DC) para abas inativas
- **Rationale**: `oceano` é a cor primária de destaque do app (usada em links e elementos interativos). `marinha`/`pedra-mar` são neutras e já constam no tema.
- **Alternatives considered**: `mar` (#1A5F7A) como ativa — mais escura, menos contraste com o fundo escuro do tab bar.

## Decision: Tab Bar Background

- **Decision**: Usar `areia` (#FDF6EC) como fundo do tab bar, com borda sutil no topo
- **Rationale**: Coerente com o fundo usado nas telas de autenticação. A paleta do app é inspirada em mar/praia.
- **Alternatives considered**: Branco puro (perde identidade visual), `mar` escuro (ícones escuros perdem contraste).
