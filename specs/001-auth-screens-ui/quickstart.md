# Quickstart: Auth Screens UI

**Feature**: 001-auth-screens-ui  
**Branch**: `001-auth-screens-ui`  
**Date**: 2026-05-10

Guia de desenvolvimento para implementar as telas de login e registro do Maré de Manguinhos.

---

## Pré-requisitos

- Node.js 18+ instalado
- Expo CLI: `npm install -g expo-cli` (ou usar `npx expo`)
- App Expo Go no celular OU emulador Android/iOS configurado

---

## Rodar o projeto

```bash
cd mare-manguinhos-app
npm install
npx expo start
```

Pressione `a` para Android, `i` para iOS, ou `w` para web.

---

## Arquivos a criar/modificar nesta feature

```text
MODIFICAR:
  tailwind.config.js                      ← adicionar paleta de cores praiana
  src/types/index.ts                      ← adicionar AuthCredentials, RegisterPayload, FormState types
  src/screens/auth/LoginScreen.tsx        ← implementar tela completa
  src/screens/auth/RegisterScreen.tsx     ← implementar tela completa
  src/navigation/RootNavigator.tsx        ← ligar ao authStore

CRIAR:
  src/store/authStore.ts                  ← Zustand store com mock
  src/utils/formatPhone.ts               ← máscara de telefone brasileiro
  src/components/ui/AppInput.tsx         ← input reutilizável com erro e acessibilidade
  src/components/ui/AppButton.tsx        ← botão com loading state
  src/components/shared/AppLogo.tsx      ← logo do app (ícone + nome)
```

---

## Ordem de implementação recomendada

A ordem abaixo garante que cada arquivo dependa apenas de arquivos já prontos:

### Etapa 1 — Fundação (sem dependências)

**1a. Estender a paleta no `tailwind.config.js`**

Adicionar ao `theme.extend.colors`:

```js
'mar': '#1A5F7A',
'mar-dark': '#0D3D52',
'oceano': '#2E86AB',
'solar': '#F2A23A',
'areia-dourada': '#F5C97A',
'areia': '#FDF6EC',
'espuma': '#FAFCFD',
'pedra-mar': '#B8D4DC',
'ardosia': '#1C3A47',
'marinha': '#5A7A87',
'coral': '#E05A5A',
'mangue': '#3A9E6A',
```

**1b. Adicionar tipos em `src/types/index.ts`**

Adicionar após os tipos existentes:
- `AuthCredentials` `{ email, password }`
- `RegisterPayload` `{ nome, email, telefone, bairro?, password }`
- `LoginFormState` (estado local da tela)
- `RegisterFormState` (estado local da tela)

Ver definições completas em [data-model.md](data-model.md).

**1c. Criar `src/utils/formatPhone.ts`**

```ts
export function formatBrazilianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

export function rawPhone(formatted: string): string {
  return formatted.replace(/\D/g, '');
}
```

---

### Etapa 2 — Componentes UI atômicos

**2a. Criar `src/components/ui/AppButton.tsx`**

Props: `label`, `onPress`, `loading?`, `disabled?`, `variant?`, `accessibilityLabel`.

- Estado `loading`: exibe `ActivityIndicator` + desabilita toque
- Variante `primary`: fundo `bg-mar`, texto `text-espuma`
- Variante `secondary`: fundo `bg-transparent`, borda `border-mar`, texto `text-mar`
- Estado `disabled`: opacidade reduzida `opacity-50`

**2b. Criar `src/components/ui/AppInput.tsx`**

Props: ver [data-model.md](data-model.md) interface `AppInputProps`.

- Label acima do campo (`text-ardosia`)
- Campo com borda `border-pedra-mar`, foco `border-oceano`
- Ícone de toggle de senha (quando `onToggleSecure` fornecido) — usar ícone de texto simples "👁" ou `Pressable` com texto
- Mensagem de erro abaixo (`text-coral`, `text-sm`)
- Props de acessibilidade: `accessibilityLabel`, `accessibilityHint`, `accessible`

**2c. Criar `src/components/shared/AppLogo.tsx`**

```tsx
import { Image, Text, View } from 'react-native';

export default function AppLogo({ size = 'md', showTitle = true }: AppLogoProps) {
  const dimensions = { sm: 64, md: 96, lg: 128 };
  const dim = dimensions[size];
  return (
    <View className="items-center gap-2">
      <Image
        source={require('../../../assets/Logo.png')}
        style={{ width: dim, height: dim, borderRadius: dim / 4 }}
        accessibilityLabel="Logo do Maré de Manguinhos"
      />
      {showTitle && (
        <Text className="text-mar font-bold text-xl">Maré de Manguinhos</Text>
      )}
    </View>
  );
}
```

---

### Etapa 3 — Store

**3a. Criar `src/store/authStore.ts`**

Implementa a interface `AuthStore` de `src/types/index.ts`:
- `login(email, senha)`: mock com `setTimeout(1500ms)` → define `token` e `usuario` mock → `SecureStore.setItemAsync`
- `logout()`: `SecureStore.deleteItemAsync` → limpa store
- Adicionar `register(payload: RegisterPayload)`: mock similar ao login — após sucesso, chama `login()` internamente para auto-autenticar

Ver padrão completo em [research.md](research.md) seção R-003.

---

### Etapa 4 — Ligar RootNavigator ao store

**Modificar `src/navigation/RootNavigator.tsx`**:

Substituir o TODO existente:
```ts
// antes (stub):
const isAuthenticated = false;

// depois:
import { useAuthStore } from '../store/authStore';
const isAuthenticated = !!useAuthStore((s) => s.token);
```

---

### Etapa 5 — Telas

**5a. Implementar `src/screens/auth/LoginScreen.tsx`**

Layout (de cima para baixo, com `ScrollView` + `KeyboardAvoidingView`):
1. `AppLogo size="lg"` — topo centralizado
2. Subtítulo "Entre na sua conta" — `text-marinha`
3. `AppInput` para e-mail (tipo `email-address`, `autoCapitalize="none"`)
4. `AppInput` para senha (`secureTextEntry`, com toggle)
5. Link "Esqueci minha senha" — `text-mar`, toque exibe Alert informativo
6. `AppButton` "Entrar" com `loading` e `disabled` quando bloqueado
7. Aviso de bloqueio (condicional, após 5 tentativas) — card vermelho suave
8. Link "Ainda não tem conta? **Cadastre-se**" — `text-marinha` + `text-mar`

Estado local: `LoginFormState` (ver data-model.md).  
Validação: executar no `handleSubmit` antes de chamar o store.

**5b. Implementar `src/screens/auth/RegisterScreen.tsx`**

Layout (ScrollView com padding inferior para teclado):
1. Header com botão voltar "← Entrar" + título "Criar conta"
2. `AppInput` Nome completo
3. `AppInput` E-mail
4. `AppInput` Confirmar e-mail
5. `AppInput` Senha (com toggle)
6. `AppInput` Confirmar senha (com toggle)
7. `AppInput` Telefone (WhatsApp) — `keyboardType="phone-pad"`, `onChangeText={formatBrazilianPhone}`
8. `AppInput` Bairro (opcional — label deve indicar "Opcional")
9. `AppButton` "Criar conta" com loading
10. Link "Já tenho conta? **Entrar**" — volta ao login

Estado local: `RegisterFormState` (ver data-model.md).  
Validação completa em `handleSubmit`: campos obrigatórios → correspondência emails → correspondência senhas → telefone mínimo 10 dígitos.  
Sucesso: chama `authStore.register(payload)` → auto-login → RootNavigator reage.

---

## Validar manualmente

Após implementar, verificar:

- [ ] Tela de login exibe logo, campos, botão e link de cadastro
- [ ] Validação inline aparece sem submissão quando campos estão errados
- [ ] Botão "Entrar" fica em loading por ~1.5s (mock delay)
- [ ] Após 5 tentativas com "senha errada" (mock), aviso de bloqueio aparece
- [ ] Link "Cadastre-se" navega para a tela de registro
- [ ] Formulário de registro valida correspondência de e-mails e senhas
- [ ] Telefone formata automaticamente como `(XX) XXXXX-XXXX` durante digitação
- [ ] Botão "Criar conta" em loading por ~1.5s → navega para AppNavigator (vitrine stub)
- [ ] Voltando do registro para login, campos do registro estão vazios
- [ ] VoiceOver/TalkBack lê os labels dos campos corretamente

---

## Convenção de commits para esta feature

```bash
git add -A ; git commit -m "chore: extend tailwind config with beach color palette"
git add -A ; git commit -m "chore: add auth types to src/types/index.ts"
git add -A ; git commit -m "feat: create formatPhone utility"
git add -A ; git commit -m "feat: create AppButton component"
git add -A ; git commit -m "feat: create AppInput component"
git add -A ; git commit -m "feat: create AppLogo component"
git add -A ; git commit -m "feat: create authStore with Zustand mock"
git add -A ; git commit -m "feat: implement LoginScreen"
git add -A ; git commit -m "feat: implement RegisterScreen"
git add -A ; git commit -m "fix: wire RootNavigator to authStore"
```
