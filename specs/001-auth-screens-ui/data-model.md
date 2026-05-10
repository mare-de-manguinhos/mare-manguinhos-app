# Data Model: Auth Screens UI

**Feature**: 001-auth-screens-ui  
**Date**: 2026-05-10  
**Source**: `spec.md` Key Entities + `research.md` decisões de design

---

## Entidades Existentes (não alteradas)

### `Usuario` — `src/types/index.ts` (existente)

```ts
interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  // bairro não existe ainda — será adicionado quando backend definir o campo
}
```

> **Nota**: O campo `bairro` está no `RegisterPayload` mas ainda não na entidade `Usuario` porque o backend ainda não está disponível. Quando a API for integrada, `bairro` será adicionado à entidade.

### `AuthStore` — `src/types/index.ts` (existente)

```ts
interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}
```

---

## Tipos Novos a Adicionar em `src/types/index.ts`

### `AuthCredentials` — payload do formulário de login

```ts
interface AuthCredentials {
  email: string;
  password: string;
}
```

**Usado por**: `authStore.login()`, `contracts/auth-api.md` (endpoint POST /auth/login)

---

### `RegisterPayload` — payload do formulário de cadastro

```ts
interface RegisterPayload {
  nome: string;
  email: string;
  telefone: string; // formato raw de dígitos: "27999999999"
  bairro?: string;  // opcional
  password: string;
}
```

**Usado por**: `authStore.register()` (a ser adicionado ao AuthStore quando API for integrada), `contracts/auth-api.md` (endpoint POST /auth/register)

---

### `LoginFormState` — estado local da tela de login

```ts
interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  tentativasFalhas: number; // bloqueio após 5
  errors: {
    email?: string;
    password?: string;
    geral?: string; // erro de credenciais inválidas ou bloqueio
  };
}
```

**Usado por**: `LoginScreen.tsx` (useState local — não vai para o store)

---

### `RegisterFormState` — estado local da tela de registro

```ts
interface RegisterFormState {
  nome: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  telefone: string;        // valor formatado com máscara
  bairro: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  errors: {
    nome?: string;
    email?: string;
    confirmEmail?: string;
    password?: string;
    confirmPassword?: string;
    telefone?: string;
    geral?: string;        // erro de e-mail duplicado (mock)
  };
}
```

**Usado por**: `RegisterScreen.tsx` (useState local — não vai para o store)

---

## Regras de Validação

| Campo | Regra | Mensagem de Erro |
|-------|-------|-----------------|
| email | Não vazio, formato válido (regex RFC 5322 simplificado) | "Insira um e-mail válido" |
| password (login) | Não vazio | "A senha é obrigatória" |
| nome | Não vazio, mínimo 3 caracteres | "Insira seu nome completo" |
| email (registro) | Não vazio, formato válido | "Insira um e-mail válido" |
| confirmEmail | Igual ao campo email | "Os e-mails não coincidem" |
| password (registro) | Não vazio, mínimo 8 caracteres | "A senha deve ter no mínimo 8 caracteres" |
| confirmPassword | Igual ao campo password | "As senhas não coincidem" |
| telefone | Mínimo 10 dígitos (DDD + número) | "Insira um telefone com DDD válido" |
| bairro | Sem validação (opcional) | — |

---

## Componentes de UI (contrato de props)

### `AppInput`

```ts
interface AppInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;    // exibe ícone de toggle quando fornecido
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  accessibilityLabel: string;
  accessibilityHint?: string;
  onBlur?: () => void;
  editable?: boolean;
}
```

### `AppButton`

```ts
interface AppButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  accessibilityLabel: string;
}
```

### `AppLogo`

```ts
interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';     // padrão: 'md'
  showTitle?: boolean;             // padrão: true
}
```

---

## Estado de Autenticação Global

```
authStore (Zustand)
├── usuario: Usuario | null   → null até login/register bem-sucedido
├── token: string | null      → null até login/register bem-sucedido
├── login(email, senha)       → mock nesta feature; substituir por authService.login()
└── logout()                  → limpa token do SecureStore e estado do store

RootNavigator
└── isAuthenticated = !!useAuthStore(s => s.token)
    ├── false → AuthNavigator (Login + Register)
    └── true  → AppNavigator (vitrine, carrinho, etc.)
```

---

## Post-Design Constitution Check

| Princípio | Status Pós-Design | Observações |
|-----------|-------------------|-------------|
| I — Sem HTTP em telas | ✅ PASS | Telas chamam `authStore.login()` — nenhum Axios nas telas |
| II — TypeScript estrito | ✅ PASS | Todos os tipos explícitos; nenhum `any` |
| III — JWT em SecureStore | ✅ PASS | `authStore.ts` usa `SecureStore.setItemAsync` |
| IV — Tipos em types/index.ts | ✅ PASS | `AuthCredentials`, `RegisterPayload`, FormState types adicionados lá |
| V — Isolamento de feature | ✅ PASS | Sem importações de `vitrine/`, `carrinho/`, etc. |
| VI — Escopo MVP | ✅ PASS | useState simples; nenhuma lib de formulário |
| VII — Git flow | ✅ PASS | Branch `001-auth-screens-ui` ativa |

**Gate result pós-design**: ✅ PASS — design pronto para implementação.
