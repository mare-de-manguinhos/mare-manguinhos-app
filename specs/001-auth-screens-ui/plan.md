# Implementation Plan: Auth Screens UI — Login & Registro

**Branch**: `001-auth-screens-ui` | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-auth-screens-ui/spec.md`

## Summary

Implementação completa da UI das telas de Login e Registro do Maré de Manguinhos. As telas existem como stubs vazios em `src/screens/auth/`; esta feature os transforma em telas totalmente funcionais com validação local, paleta de cores praiana, suporte a acessibilidade e pontos de integração preparados para a API futura. Nenhuma chamada HTTP real é realizada — as ações de submit usam mocks com delay para simular respostas da API. O `authStore` Zustand é scaffoldado seguindo a interface `AuthStore` já definida em `src/types/index.ts`, pronto para receber a integração real.

## Technical Context

**Language/Version**: TypeScript 5.9  
**Primary Dependencies**: React Native 0.81.5, Expo 54 (managed), NativeWind 4.2.3, Zustand 5.0.13, React Navigation 7 (Stack), expo-secure-store 15.0.8  
**Storage**: expo-secure-store exclusivo para token JWT (scaffoldado); estado de formulário em `useState` local  
**Testing**: Não configurado no MVP (fora do escopo desta feature)  
**Target Platform**: iOS 15+ e Android 10+  
**Project Type**: mobile-app (Expo managed workflow)  
**Performance Goals**: 60 fps; resposta ao toque < 16ms; validação inline instantânea (sem debounce)  
**Constraints**: Expo managed workflow — sem dependências nativas fora do ecossistema Expo; sem bibliotecas de formulário (React Hook Form, Formik, etc.); `useState` simples para todos os campos; sem cache client-side  
**Scale/Scope**: 2 telas (LoginScreen, RegisterScreen), 2 componentes UI reutilizáveis, 1 store, 1 utility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Princípio | Status Pré-Design | Notas |
|---|-----------|-------------------|-------|
| I | Arquitetura em Camadas — nenhuma chamada HTTP em telas | ✅ PASS | Submit actions são mocks; authService será chamado pelo store, não pela tela |
| II | TypeScript estrito — sem `any` | ✅ PASS | Todos os tipos definidos em `src/types/index.ts`; `AuthStore` interface já existe |
| III | JWT em expo-secure-store | ✅ PASS | authStore usa `SecureStore.setItemAsync`; nenhum token é armazenado em AsyncStorage |
| IV | Tipos de domínio somente em `src/types/index.ts` | ✅ PASS | `AuthCredentials` e `RegisterPayload` serão adicionados lá; sem duplicação |
| V | Feature isolada — sem importações cruzadas entre domínios | ✅ PASS | Telas em `src/screens/auth/`, componentes em `src/components/ui/`; sem imports de `vitrine/`, `carrinho/` etc. |
| VI | Escopo MVP disciplinado — useState simples, sem bibliotecas de formulário | ✅ PASS | Campos gerenciados com `useState`; sem React Hook Form, Formik ou similares |
| VII | Conventional Commits e feature branch | ✅ PASS | Branch `001-auth-screens-ui` criada; commits seguirão `feat:`, `style:`, `chore:` |

**Gate result**: ✅ PASS — nenhuma violação identificada. Prosseguir para Phase 0.

**Post-Design Re-check** (após Phase 1): Ver seção ao final do plano.

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-screens-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── auth-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Mobile App — Expo managed (single project, feature-sliced)

src/
├── screens/
│   └── auth/
│       ├── LoginScreen.tsx        # MODIFY — stub → implementação completa
│       └── RegisterScreen.tsx     # MODIFY — stub → implementação completa
├── components/
│   ├── ui/
│   │   ├── AppInput.tsx           # CREATE — input reutilizável com estado de erro e acessibilidade
│   │   └── AppButton.tsx          # CREATE — botão primário com loading state
│   └── shared/
│       └── AppLogo.tsx            # CREATE — ícone + nome do app (usado no topo do login)
├── store/
│   └── authStore.ts               # CREATE — Zustand store implementando AuthStore interface
├── utils/
│   └── formatPhone.ts             # CREATE — máscara de telefone brasileiro sem lib externa
└── types/
    └── index.ts                   # MODIFY — adicionar AuthCredentials, RegisterPayload, FormState types

tailwind.config.js                 # MODIFY — adicionar paleta de cores praiana no theme.extend.colors
assets/
└── app-icon.png                   # EXISTS — usado em AppLogo.tsx via <Image source={require(...)} />
```

**Structure Decision**: Single project (mobile-only). Toda a feature fica em `src/screens/auth/` com componentes atômicos em `src/components/ui/`. Não há backend nesta feature. A estrutura segue o Princípio V da constituição (isolamento por feature).

## Complexity Tracking

*Nenhuma violação de constituição identificada. Seção não aplicável.*
