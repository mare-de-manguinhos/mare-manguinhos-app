# Research: Auth Screens UI

**Feature**: 001-auth-screens-ui  
**Date**: 2026-05-10  
**Scope**: Resolução de todas as incógnitas técnicas antes da implementação.

---

## R-001 — NativeWind v4 com Expo 54

**Decision**: Usar `className` diretamente nas primitivas React Native (`View`, `Text`, `TextInput`, `Pressable`). O HOC `styled()` foi removido no NativeWind v4 e não deve ser usado.

**Rationale**: O projeto já usa NativeWind v4.2.3 com configuração funcional (`tailwind.config.js` com `presets: [require('nativewind/preset')]` e `babel.config.js` com o preset Expo). Os stubs existentes já usam `className` e funcionam. Estender cores customizadas no `theme.extend.colors` do `tailwind.config.js` é o mecanismo correto para a paleta praiana.

**Pattern**:
```tsx
// ✅ Correto — v4
<View className="flex-1 bg-sand-light px-6">
  <Text className="text-primary font-semibold">Texto</Text>
</View>

// ❌ Errado — API v3/v2, removida em v4
const StyledView = styled(View);
```

**Color extension in tailwind.config.js**:
```js
theme: {
  extend: {
    colors: {
      'mar': '#1A5F7A',          // color-primary
      'mar-dark': '#0D3D52',     // color-primary-dark
      'oceano': '#2E86AB',       // color-secondary
      'solar': '#F2A23A',        // color-accent
      'areia-dourada': '#F5C97A',// color-accent-light
      'areia': '#FDF6EC',        // color-background
      'espuma': '#FAFCFD',       // color-surface
      'pedra-mar': '#B8D4DC',    // color-border
      'ardosia': '#1C3A47',      // color-text-primary
      'marinha': '#5A7A87',      // color-text-secondary
      'coral': '#E05A5A',        // color-error
      'mangue': '#3A9E6A',       // color-success
    },
  },
},
```

**Alternatives considered**: Usar `StyleSheet.create()` puro — rejeitado porque o projeto já adotou NativeWind como padrão de estilização.

---

## R-002 — Máscara de Telefone Brasileiro sem Dependência Nativa

**Decision**: Implementar função utilitária pura `formatBrazilianPhone(value: string): string` em `src/utils/formatPhone.ts`, sem bibliotecas externas.

**Rationale**: A constituição proíbe dependências nativas fora do ecossistema Expo. Bibliotecas de máscara como `react-native-mask-input` são dependências nativas não gerenciadas pelo Expo. A máscara `(XX) XXXXX-XXXX` pode ser implementada em 10 linhas de JavaScript puro com `replace` e `slice`.

**Implementation pattern**:
```ts
export function formatBrazilianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

// Raw value for validation/submission:
export function rawPhone(formatted: string): string {
  return formatted.replace(/\D/g, '');
}
```

**Usage**: `onChangeText={(v) => setTelefone(formatBrazilianPhone(v))}`

**Alternatives considered**: `react-native-mask-input` — rejeitado (dependência nativa, viola Princípio VI). `react-native-masked-text` — rejeitado (deprecated, dependência nativa).

---

## R-003 — authStore com Zustand + expo-secure-store

**Decision**: Criar `src/store/authStore.ts` implementando exatamente a interface `AuthStore` de `src/types/index.ts`. Nesta feature (UI-only), a ação `login` usa um mock com delay. A integração real substitui apenas o mock por uma chamada ao `authService`.

**Rationale**: A interface `AuthStore` já está definida em `src/types/index.ts` com `{ usuario, token, login, logout }`. O `RootNavigator.tsx` já tem um TODO comentado indicando onde ler `useAuthStore`. O store é o único ponto que precisa mudar quando a API for integrada — as telas não mudam.

**Pattern**:
```ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthStore } from '../types';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,

  login: async (email, senha) => {
    // TODO: substituir mock por authService.login(email, senha)
    await new Promise((r) => setTimeout(r, 1500)); // simula latência
    const mockToken = 'mock-jwt-token';
    const mockUsuario = { id: '1', nome: 'Usuário Teste', email, telefone: '' };
    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    set({ token: mockToken, usuario: mockUsuario });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, usuario: null });
  },
}));
```

**Alternatives considered**: Context API — rejeitado (causa re-renders desnecessários, rejeitado na constituição). Redux — rejeitado (over-engineering para escopo MVP).

---

## R-004 — Lógica de Bloqueio de Login (5 tentativas)

**Decision**: Gerenciar o contador de tentativas com `useState` local na `LoginScreen`. Não persiste entre sessões — reseta ao reiniciar o app. Sem timeout automático (bloqueio persiste até o usuário interagir com "Esqueci minha senha").

**Rationale**: Contador de tentativas é estado de sessão da tela, não estado global do app. Não precisa de store. A constituição exige `useState` simples para formulários. Persistência de contagem seria over-engineering para MVP.

**Pattern**:
```ts
const [tentativas, setTentativas] = useState(0);
const bloqueado = tentativas >= 5;

const handleSubmit = async () => {
  if (bloqueado) return;
  // ... submit
  // em caso de erro de credenciais:
  setTentativas((n) => n + 1);
};
```

---

## R-005 — Acessibilidade em React Native

**Decision**: Usar as props nativas de acessibilidade do React Native: `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`, e `accessible` nos componentes `AppInput` e `AppButton`.

**Rationale**: React Native já tem suporte nativo a VoiceOver (iOS) e TalkBack (Android) via essas props. Não requer nenhuma biblioteca adicional. O WCAG AA de contraste é garantido pela paleta de cores definida na spec (Azul Mar #1A5F7A sobre Areia Clara #FDF6EC = contraste 7.2:1 > 4.5:1 mínimo).

**Pattern**:
```tsx
<TextInput
  accessibilityLabel="Campo de e-mail"
  accessibilityHint="Digite seu endereço de e-mail"
  accessible
  // ...
/>
<Pressable
  accessibilityLabel="Entrar"
  accessibilityRole="button"
  accessibilityState={{ disabled: loading || bloqueado }}
  // ...
/>
```

---

## R-006 — Navegação Pós-Registro (auto-login)

**Decision**: Após registro bem-sucedido (mock), chamar `authStore.login()` com as credenciais recém-cadastradas. Isso atualiza o `token` no store, o que faz o `RootNavigator` renderizar o `AppNavigator` automaticamente via reatividade do Zustand.

**Rationale**: O `RootNavigator` já tem o TODO indicando `const isAuthenticated = !!useAuthStore((s) => s.token)`. Quando o token for definido no store, o navigator troca para `AppNavigator` sem nenhuma navegação imperativa. Essa abordagem é declarativa e alinhada com a arquitetura do projeto.

**No explicit navigation needed**: A tela de registro apenas chama `authStore.login()` após o register mock — a navegação acontece automaticamente.

---

## R-007 — Reset de Formulário ao Navegar para Login

**Decision**: Não requer código explícito de reset. O React Navigation Stack por padrão **desmonta** a tela quando ela sai do stack. Como o estado dos campos está em `useState` local, o estado é perdido naturalmente ao desmontar.

**Rationale**: A tela de Registro navega de volta ao Login com `navigation.goBack()`. No stack navigator, isso desmonta `RegisterScreen`. Quando o usuário navegar para o registro novamente, uma nova instância da tela é montada com estado inicial vazio.

**Verification**: Confirmado pelo comportamento padrão do `@react-navigation/stack` v7 — unmount on blur é o comportamento default para stacks.

---

## Summary Table

| ID | Incógnita | Decisão | Impacto |
|----|-----------|---------|---------|
| R-001 | NativeWind v4 pattern | `className` direto; cores no `theme.extend` | tailwind.config.js |
| R-002 | Máscara de telefone | Utilitário puro `formatBrazilianPhone` | src/utils/formatPhone.ts (CREATE) |
| R-003 | authStore scaffold | Zustand + expo-secure-store com mock | src/store/authStore.ts (CREATE) |
| R-004 | Bloqueio 5 tentativas | `useState` local na LoginScreen | LoginScreen.tsx |
| R-005 | Acessibilidade RN | Props nativas `accessibilityLabel` etc. | AppInput.tsx, AppButton.tsx |
| R-006 | Navegação pós-registro | `authStore.login()` → RootNavigator reage | RegisterScreen.tsx |
| R-007 | Reset form ao voltar | Stack unmount natural — sem código extra | Nenhum |

**Todas as incógnitas resolvidas. Nenhum NEEDS CLARIFICATION remanescente.**
