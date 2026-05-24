---

description: "Task list for ProdutoScreen feature implementation"

---

# Tasks: ProdutoScreen — Detalhes do Produto

**Input**: Design documents from `/specs/004-produto-screen/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/produto-screen.md, quickstart.md

**Tests**: MVP — testes manuais; sem test runner configurado para UI.

**Organization**: Tasks grouped in phases. All user stories (US1, US2, US3) são P1 e parte da mesma tela — implementação sequencial recomendada.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `src/` at repository root
- Paths shown below reflect the real project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Tipos, mock data e service layer — base para toda a feature.

- [x] T001 Adicionar `descricao?` opcional a `Produto` em `src/types/index.ts`
- [x] T002 [P] Adicionar função `gerarProdutoDetalhado(id)` em `src/services/vitrineDataMock.ts`
- [x] T003 [P] Atualizar `USE_MOCK` e implementar `buscarProduto()` com fallback mock em `src/services/vitrineService.ts`

**Checkpoint**: `descricao?` opcional adicionada a `Produto`, mock funcional, service pronto para consumo.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Store do carrinho — necessário para US1 adicionar item ao carrinho.

- [x] T004 Criar `carrinhoStore` com Zustand em `src/store/carrinhoStore.ts` (implementar interface `CarrinhoStore` de `src/types/index.ts`: itens, adicionarItem, removerItem, limpar, total)

**Checkpoint**: `carrinhoStore` funcional — pode adicionar/remover itens em memória.

---

## Phase 3: User Story 1 — Visualizar Detalhes e Adicionar ao Carrinho (Priority: P1) 🎯 MVP

**Goal**: Tela completa de detalhes do produto com foto, dados do pescador, descrição, seletor de corte, controle de peso, valor dinâmico e botão "Adicionar ao Carrinho". Inclui US2 (seleção de corte) e US3 (seleção de peso) como componentes integrados.

**Independent Test**: Com dados mockados, a tela carrega o produto, permite alternar corte, ajustar peso com +/- e adicionar ao carrinho com toast de confirmação.

### Implementation for User Story 1

- [x] T005 [P] [US1] Criar `CorteChip` — componente de seleção de corte em `src/components/vitrine/CorteChip.tsx`
- [x] T006 [P] [US1] Criar `PesoControl` — componente de controle de peso em `src/components/vitrine/PesoControl.tsx`
- [x] T007 [US1] Implementar `ProdutoScreen` completa em `src/screens/vitrine/ProdutoScreen.tsx` (loading, error+retry, layout, CorteChip, PesoControl, valor total, add to cart, toast, abort controller, edge cases)
- [x] T008 [US1] Verificar navegação em `src/navigation/VitrineStack.tsx` — já configurada (stack com back button padrão)

**Checkpoint**: Fluxo completo — VitrineScreen → ProdutoScreen → selecionar corte → ajustar peso → adicionar ao carrinho → toast.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Tratamento de erros, fallback de imagem e consistência visual.

- [x] T009 [P] Placeholder de imagem integrado em `ProdutoScreen` (imageError state → fish icon)
- [x] T010 [P] Paleta de cores consistente: bg #FDF6EC, cards #FAFCFD, botão #1A5F7A, badge #F2A23A
- [x] T011 Todos elementos interativos com accessibilityLabel + touch target >= 44x44px (h-12=48px)
- [x] T012 TypeScript check passed (tsc --noEmit). Fluxo Vitrine → Produto → carrinho funcional.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Phase 1 — `descricao?` precisa existir em `Produto`
- **US1 (Phase 3)**: Depende de Phase 1 + Phase 2 — precisa de types, mock, service e carrinhoStore
- **Polish (Final Phase)**: Depende de todas as fases anteriores

### User Story Dependencies

- **US1 (P1)**: Depende de Phase 1 + Phase 2. US2 e US3 são implementados como componentes dentro de US1 (CorteChip, PesoControl).
- Tasks T005 e T006 (CorteChip, PesoControl) são [P] — podem ser feitas em paralelo.
- T007 (ProdutoScreen) depende de T005 e T006 estarem completos.

### Parallel Opportunities

| Task ID | Pairs With | Why |
|---------|-----------|-----|
| T002 | T003 | Mock e service são arquivos independentes |
| T005 | T006 | CorteChip e PesoControl são componentes independentes |
| T009 | T010 | Placeholder de imagem e paleta de cores são independentes |

---

## Parallel Example: User Story 1

```bash
# Launch CorteChip and PesoControl in parallel:
Task: "Criar CorteChip in src/components/vitrine/CorteChip.tsx"
Task: "Criar PesoControl in src/components/vitrine/PesoControl.tsx"

# Then implement ProdutoScreen (depends on both):
Task: "Implementar ProdutoScreen in src/screens/vitrine/ProdutoScreen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004)
3. Complete Phase 3: User Story 1 (T005-T008)
4. **STOP and VALIDATE**: Test fluxo completo manualmente
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Base pronta
2. Add US1 (CorteChip, PesoControl, ProdutoScreen) → Testar → **MVP!**
3. Add Polish (placeholder, acessibilidade, cores) → Finalizar

### Parallel Team Strategy

Com 2 desenvolvedores:
1. Dev A: T002 (mock) + T005 (CorteChip)
2. Dev B: T003 (service) + T006 (PesoControl)
3. Juntos: T001 → T004 → T007 → T008
4. Qualquer um: T009-T012
