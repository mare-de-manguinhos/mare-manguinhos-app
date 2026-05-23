# Implementation Plan: Menu de Navegação Inferior (Bottom Tabs)

**Branch**: `002-bottom-nav-menu` | **Date**: 2026-05-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-bottom-nav-menu/spec.md`

## Summary

Criar o menu de navegação inferior (bottom tabs) com 4 abas — Vitrine, Carrinho, Pedidos, Perfil — com stacks de navegação internas onde necessário (Vitrine→Produto, Pedidos→Acompanhamento) e telas placeholder identificáveis. O menu segue o layout já definido na arquitetura (seção 6 do `docs/arch-mvp-app-mare-manguinhos.md`), com ícones, destaque visual da aba ativa e navegação fluida entre telas.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19.1  
**Primary Dependencies**: @react-navigation/native v7, @react-navigation/bottom-tabs v7, @react-navigation/stack v7, NativeWind v4, Expo ~54  
**Storage**: N/A (navegação gerenciada internamente pelo React Navigation)  
**Testing**: N/A para esta feature — telas placeholder sem lógica de negócio  
**Target Platform**: iOS 15+ e Android 10+ (Expo managed workflow)
**Project Type**: mobile-app (React Native / Expo)
**Performance Goals**: Troca entre abas percebida como instantânea (<100ms)
**Constraints**: Escopo MVP — sem dependências extras além das já existentes no package.json; sem lógica de negócio nas telas placeholder
**Scale/Scope**: 4 bottom tabs, 6 telas no total (VitrineScreen, ProdutoScreen, CarrinhoScreen, HistoricoScreen, AcompanhamentoScreen, PerfilScreen)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate | Status | Justification |
|---|------|--------|---------------|
| I | Nenhuma chamada HTTP em telas ou componentes | ✅ PASS | Telas placeholder sem HTTP; navegação não faz chamadas de rede |
| II | Nenhum `any` sem justificativa | ✅ PASS | Todos os tipos de navegação (param lists) serão estritamente tipados |
| III | JWT apenas em expo-secure-store | ✅ PASS | Não aplicável — feature não lida com autenticação |
| IV | Tipos de domínio somente em `src/types/index.ts` | ✅ PASS | Tipos de navegação (param lists) são específicos do React Navigation, não de domínio; serão definidos nos arquivos de navegação |
| V | Feature não importa diretamente de outro domínio | ✅ PASS | Navigation layer importa screens de cada domínio por design (é o papel do navigator) |
| VI | Nenhuma feature out-of-MVP implementada | ✅ PASS | Navegação inferior é parte central do MVP (seção 6 da arquitetura) |
| VII | Commit messages seguem Conventional Commits | ✅ PASS | Seguiremos o padrão estabelecido |

**Resultado**: ✅ Todos os gates aprovados. Nenhuma violação detectada.

### Re-check pós-Phase 1 Design

| # | Gate | Status | Observação |
|---|------|--------|------------|
| I | Nenhuma chamada HTTP em telas | ✅ | Telas placeholder, sem HTTP |
| II | TypeScript estrito sem `any` | ✅ | Tipos de navegação estritamente definidos em `navigation/types.ts` |
| III | JWT em expo-secure-store | ✅ | N/A |
| IV | Tipos de domínio centralizados | ✅ | Tipos de navegação não são de domínio |
| V | Isolamento por feature | ✅ | Navigation importa screens por design |
| VI | Escopo MVP | ✅ | Navegação é parte do MVP original (seção 6 da arquitetura) |
| VII | Conventional Commits | ✅ | Seguiremos o padrão |

**Resultado final**: ✅ Constitution Check mantido aprovado após design.

## Project Structure

### Documentation (this feature)

```text
specs/002-bottom-nav-menu/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── navigation.md    # Navigation param contracts
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── navigation/
│   ├── RootNavigator.tsx       # (exists) decide entre AuthNavigator e AppNavigator
│   ├── AuthNavigator.tsx       # (exists) stack de login e cadastro
│   ├── AppNavigator.tsx        # [MODIFICAR] bottom tabs do app principal
│   ├── types.ts                # [CRIAR] tipos de navegação compartilhados
│   ├── VitrineStack.tsx        # [CRIAR] stack navigator da aba Vitrine
│   └── PedidosStack.tsx        # [CRIAR] stack navigator da aba Pedidos
│
├── screens/                    # telas organizadas por domínio
│   ├── vitrine/
│   │   ├── VitrineScreen.tsx   # [CRIAR] placeholder
│   │   └── ProdutoScreen.tsx   # [CRIAR] placeholder
│   ├── carrinho/
│   │   └── CarrinhoScreen.tsx  # [CRIAR] placeholder
│   ├── pedido/
│   │   ├── HistoricoScreen.tsx      # [CRIAR] placeholder
│   │   └── AcompanhamentoScreen.tsx # [CRIAR] placeholder
│   └── perfil/
│       └── PerfilScreen.tsx    # [CRIAR] placeholder
│
├── components/
│   └── shared/
│       └── TabIcon.tsx         # [CRIAR] ícone customizado para cada aba
```

**Structure Decision**: Mobile app (React Native/Expo) com estrutura feature-based de screens conforme seção 5 da arquitetura. A navegação recebe seus próprios arquivos de stack para manter a responsabilidade única. Cada tela placeholder fica em seu respectivo diretório de domínio.

## Complexity Tracking

Nenhuma violação de Constitution Check — seção não aplicável.
