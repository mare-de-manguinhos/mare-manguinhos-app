# Implementation Plan: Vitrine Home Screen

**Branch**: `003-vitrine-home-screen` | **Date**: 2026-05-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-vitrine-home-screen/spec.md`

## Summary

Implementar a VitrineScreen — tela inicial do Maré de Manguinhos com 5 seções: barra de busca, banner promocional, "Nossos Pescadores" (scroll horizontal), filtros de categoria (chips) e "Disponível agora" (grid 2 colunas de produtos). Tela alimentada por dados mockados seguindo o contrato `GET /api/app/vitrine`, com filtragem local por pescador, categoria e texto.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19.1  
**Primary Dependencies**: @react-navigation/stack v7, Axios, NativeWind v4, Expo ~54  
**Storage**: N/A — vitrine é display-only (sem persistência)  
**Testing**: Manual visual + navegação (MVP — sem test runner configurado para UI)  
**Target Platform**: iOS 15+ e Android 10+ (Expo managed workflow)
**Project Type**: mobile-app (React Native / Expo)
**Performance Goals**: Filtragem local <200ms após toque; carregamento inicial com skeleton loader
**Constraints**: Sem HTTP em telas (Princípio I), tipos novos em `src/types/index.ts` (Princípio IV), sem Zustand para dados de vitrine (Princípio VI)
**Scale/Scope**: 1 tela, 5 seções, ~7 componentes, 1 serviço mockado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate | Status | Justification |
|---|------|--------|---------------|
| I | Nenhuma chamada HTTP em telas ou componentes | ✅ PASS | `vitrineService.ts` centraliza chamadas; tela só chama o service |
| II | Nenhum `any` sem justificativa | ✅ PASS | Todos os novos tipos (VitrineData, Banner, ProdutoResumo) serão estritamente tipados |
| III | JWT apenas em expo-secure-store | ✅ PASS | Vitrine não lida com autenticação; o interceptor do `api.ts` já injeta o token |
| IV | Tipos de domínio somente em `src/types/index.ts` | ✅ PASS | `VitrineData`, `Banner`, `ProdutoResumo` serão adicionados a `src/types/index.ts` |
| V | Feature não importa diretamente de outro domínio | ✅ PASS | Vitrine só importa de `src/types/` e `src/services/` |
| VI | Nenhuma feature out-of-MVP implementada | ✅ PASS | Vitrine é parte central do MVP (seção 2.2 do backend doc) |
| VII | Commit messages seguem Conventional Commits | ✅ PASS | Seguiremos o padrão estabelecido |

**Resultado**: ✅ Todos os gates aprovados. Nenhuma violação detectada.

### Re-check pós-Phase 1 Design

| # | Gate | Status | Observação |
|---|------|--------|------------|
| I | Nenhuma chamada HTTP em telas | ✅ | `vitrineService` + mock isolam HTTP |
| II | TypeScript estrito sem `any` | ✅ | Todos os novos tipos definidos no data-model |
| III | JWT em expo-secure-store | ✅ | N/A — vitrine pública |
| IV | Tipos de domínio centralizados | ✅ | Novos tipos adicionados a `src/types/index.ts` |
| V | Isolamento por feature | ✅ | Componentes vitrine em `src/components/vitrine/` |
| VI | Escopo MVP | ✅ | Vitrine é MVP (seção 2.2 do backend) |
| VII | Conventional Commits | ✅ | Seguiremos o padrão |

**Resultado final**: ✅ Constitution Check mantido aprovado após design.

## Project Structure

### Documentation (this feature)

```text
specs/003-vitrine-home-screen/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── vitrine-sections.md    # UI component contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   └── vitrine/                      # [CRIAR] componentes específicos da vitrine
│       ├── SearchBar.tsx             # [CRIAR] barra de busca com debounce
│       ├── VitrineBanner.tsx         # [CRIAR] banner promocional
│       ├── PescadorCard.tsx          # [CRIAR] card de pescador (scroll horizontal)
│       ├── CategoriaChip.tsx         # [CRIAR] chip de filtro de categoria
│       └── ProdutoCard.tsx           # [CRIAR] card de produto (grid 2 colunas)
│
├── screens/
│   └── vitrine/
│       └── VitrineScreen.tsx         # [MODIFICAR] implementação completa
│
├── services/
│   ├── vitrineDataMock.ts            # [CRIAR] dados mockados do endpoint
│   └── vitrineService.ts             # [MODIFICAR] adicionar fallback mock
│
└── types/
    └── index.ts                      # [MODIFICAR] adicionar VitrineData, Banner, ProdutoResumo
```

**Structure Decision**: Mobile app (React Native/Expo) com feature-based screens e components. Componentes específicos da vitrine ficam em `src/components/vitrine/` para isolamento (Princípio V). Compartilháveis (AppButton, AppInput) permanecem em `src/components/ui/`.

## Complexity Tracking

Nenhuma violação de Constitution Check — seção não aplicável.
