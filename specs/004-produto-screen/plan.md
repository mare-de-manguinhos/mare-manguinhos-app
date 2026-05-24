# Implementation Plan: ProdutoScreen

**Branch**: `004-produto-screen` | **Date**: 2026-05-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-produto-screen/spec.md`

## Summary

Implementar a ProdutoScreen — tela de detalhes do produto com foto em destaque, informações do pescador, descrição, preço por kg, seletor de corte (inteiro/limpo/file), controle de peso com incremento/decremento (0.5kg), valor total dinâmico e botão "Adicionar ao Carrinho". Dados mockados seguindo contrato `GET /api/app/produtos/:id`, com integração ao `carrinhoStore` (Zustand) e navegação a partir da VitrineScreen.

## Technical Context

**Language/Version**: TypeScript 5.9 + React 19.1  
**Primary Dependencies**: @react-navigation/stack v7, Axios, NativeWind v4, Expo ~54, Zustand  
**Storage**: N/A — carrinho é estado em memória (Zustand)  
**Testing**: Manual visual + navegação (MVP — sem test runner configurado para UI)  
**Target Platform**: iOS 15+ e Android 10+ (Expo managed workflow)
**Project Type**: mobile-app (React Native / Expo)
**Performance Goals**: Carregamento <3s (mock); recálculo de preço <100ms
**Constraints**: Sem HTTP em telas (Princípio I), tipos novos em `src/types/index.ts` (Princípio IV), estado local com `useState` (Princípio VI — sem React Hook Form)
**Scale/Scope**: 1 tela, 2 novos componentes (CorteChip, PesoControl), 1 service atualizado, 1 store criado (carrinhoStore)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate | Status | Justification |
|---|------|--------|---------------|
| I | Nenhuma chamada HTTP em telas ou componentes | ✅ PASS | `vitrineService.ts` centraliza chamadas; `buscarProduto()` é chamado via service, não diretamente |
| II | Nenhum `any` sem justificativa | ✅ PASS | `ProdutoDetalhado` será estritamente tipado |
| III | JWT apenas em expo-secure-store | ✅ PASS | ProdutoScreen não lida com autenticação; endpoint de produto é público |
| IV | Tipos de domínio somente em `src/types/index.ts` | ✅ PASS | `ProdutoDetalhado` será adicionado a `src/types/index.ts` |
| V | Feature não importa diretamente de outro domínio | ✅ PASS | ProdutoScreen só importa de `src/types/`, `src/services/`, `src/components/vitrine/`, `src/store/` |
| VI | Nenhuma feature out-of-MVP implementada | ✅ PASS | ProdutoScreen é parte central do MVP (seção 2.3 do backend doc) |
| VII | Commit messages seguem Conventional Commits | ✅ PASS | Seguiremos o padrão estabelecido |

**Resultado**: ✅ Todos os gates aprovados. Nenhuma violação detectada.

### Re-check pós-Phase 1 Design

| # | Gate | Status | Observação |
|---|------|--------|------------|
| I | Nenhuma chamada HTTP em telas | ✅ | `vitrineService` + mock isolam HTTP |
| II | TypeScript estrito sem `any` | ✅ | `ProdutoDetalhado` estritamente tipado |
| III | JWT em expo-secure-store | ✅ | N/A — endpoint público |
| IV | Tipos de domínio centralizados | ✅ | `ProdutoDetalhado` adicionado a `src/types/index.ts` |
| V | Isolamento por feature | ✅ | Componentes em `src/components/vitrine/`, store separado |
| VI | Escopo MVP | ✅ | ProdutoScreen é MVP (seção 2.3 do backend) |
| VII | Conventional Commits | ✅ | Seguiremos o padrão |

**Resultado final**: ✅ Constitution Check mantido aprovado após design.

## Project Structure

### Documentation (this feature)

```text
specs/004-produto-screen/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── produto-screen.md      # UI component contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   └── vitrine/
│       ├── CorteChip.tsx          # [CRIAR] seletor de corte (inteiro/limpo/file)
│       └── PesoControl.tsx        # [CRIAR] controle de peso +/- 0.5kg
│
├── screens/
│   └── vitrine/
│       └── ProdutoScreen.tsx      # [MODIFICAR] implementação completa
│
├── services/
│   ├── vitrineDataMock.ts         # [MODIFICAR] adicionar gerarProdutoDetalhado()
│   └── vitrineService.ts          # [MODIFICAR] implementar buscarProduto() c/ mock
│
├── store/
│   └── carrinhoStore.ts           # [CRIAR] store Zustand do carrinho
│
└── types/
    └── index.ts                   # [MODIFICAR] adicionar ProdutoDetalhado
```

**Structure Decision**: Mobile app (React Native/Expo) com feature-based screens e components. Componentes específicos da vitrine/produto ficam em `src/components/vitrine/`. Store do carrinho fica em `src/store/carrinhoStore.ts` (separado do domínio vitrine, coeso com o dado que gerencia). Novos tipos adicionados a `src/types/index.ts`.

## Complexity Tracking

Nenhuma violação de Constitution Check — seção não aplicável.
