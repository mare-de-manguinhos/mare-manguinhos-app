---

description: "Task list for Vitrine Home Screen feature implementation"

---

# Tasks: Vitrine Home Screen

**Input**: Design documents from `/specs/003-vitrine-home-screen/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/vitrine-sections.md

**Tests**: Not requested — manual visual testing per spec.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps to User Story from spec.md (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Nothing to initialize — project already bootstrapped (Expo + NativeWind + React Navigation + Axios + Zustand).

- [x] T001 Create `src/components/vitrine/` directory for vitrine-specific components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, mock data, and service layer that MUST be complete before ANY user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Add `VitrineData`, `Banner`, `ProdutoResumo`, `CategoriaVitrine` interfaces to `src/types/index.ts`
- [x] T003 [P] Create mock data module `src/services/vitrineDataMock.ts` exporting a `vitrineDataMock: VitrineData` constant matching the `GET /api/app/vitrine` contract
- [x] T004 Modify `src/services/vitrineService.ts`: update `listarVitrine()` to return `VitrineData` type and add a `useMock` toggle that returns mock data when `true`

**Checkpoint**: Foundation ready — types, mock data, and service layer in place.

---

## Phase 3: User Story 1 — Visualizar Vitrine Completa (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado acessa a vitrine e vê todos os blocos (banner, pescadores, categorias, produtos) com loading, erro e pull-to-refresh.

**Independent Test**: VitrineScreen renderiza com dados mockados exibindo barra de busca, banner, scroll horizontal de pescadores, chips de categoria e grid 2 colunas de produtos — sem dependência de API real.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create `VitrineBanner` component in `src/components/vitrine/VitrineBanner.tsx` with full-width layout (~180px height), rounded bottom corners, image background, and title/subtitle/description overlay
- [x] T006 [P] [US1] Create `PescadorCard` component in `src/components/vitrine/PescadorCard.tsx` with circular avatar (fallback to initial on error), name label, highlight when selected
- [x] T007 [P] [US1] Create `CategoriaChip` component in `src/components/vitrine/CategoriaChip.tsx` with active/inactive states: active = `#1A5F7A` fundo + texto branco; inactive = fundo neutro
- [x] T008 [P] [US1] Create `ProdutoCard` component in `src/components/vitrine/ProdutoCard.tsx` with image at top, species name, price/kg, available weight, colored badges (verde "Hoje", dourado "Premium", laranja "Favorito"), and pescador name — display only (no navigation yet)
- [x] T009 [US1] Implement `VitrineScreen` in `src/screens/vitrine/VitrineScreen.tsx`: ScrollView layout with all 5 sections in order, loading skeleton, error state with "Tentar novamente", pull-to-refresh via RefreshControl

**Checkpoint**: MVP ready — vitrine carrega e exibe todos os blocos com loading/error/pull-to-refresh.

---

## Phase 4: User Story 2 — Filtrar Produtos por Pescador e Categoria (Priority: P2)

**Goal**: Usuário toca em um pescador ou categoria e a lista de produtos filtra instantaneamente.

**Independent Test**: Ao tocar em "Sr. Antônio", apenas produtos dele aparecem; tocar em "Crustáceos" mostra só crustáceos; filtros combináveis; toggle desmarca pescador; filtro vazio exibe "Nenhum produto encontrado para este filtro".

### Implementation for User Story 2

- [x] T010 [P] [US2] Add filter state (`pescadorId`, `categoriaId` as `useState`) to `VitrineScreen` in `src/screens/vitrine/VitrineScreen.tsx`
- [x] T011 [US2] Implement filter logic: derive `produtosFiltrados` via `useMemo` combining pescadorId + categoriaId; add toggle behavior for pescador; wire PescadorCard `onPress` and CategoriaChip `onPress`; empty state when filtered list is empty

**Checkpoint**: Product filtering by pescador and categoria working independently.

---

## Phase 5: User Story 3 — Buscar Produtos por Texto (Priority: P2)

**Goal**: Usuário digita na barra de busca e produtos são filtrados localmente com debounce.

**Independent Test**: Digitar "camarão" mostra só produtos com "camarão" no nome; limpar o texto com "X" restaura todos; termo <2 caracteres ignora; zero resultados exibe "Nenhum resultado para".

### Implementation for User Story 3

- [x] T012 [P] [US3] Create `SearchBar` component in `src/components/vitrine/SearchBar.tsx` with placeholder "Buscar peixes, crustáceos...", clear "X" icon, debounce (300ms) on `onChangeText`
- [x] T013 [US3] Integrate `SearchBar` into `VitrineScreen` at top of layout; add `buscaTermo` to filter state; extend `useMemo` filter to search on `especie` (case-insensitive, min 2 chars); wire zero-results message

**Checkpoint**: Text search works locally with debounce and empty state.

---

## Phase 6: User Story 4 — Navegar para Detalhes do Produto (Priority: P2)

**Goal**: Usuário toca em um card de produto e navega para ProdutoScreen.

**Independent Test**: Tocar em qualquer card de produto redireciona para ProdutoScreen (já existente como placeholder) com o `produtoId` correto no parâmetro de navegação.

### Implementation for User Story 4

- [x] T014 [US4] Add `useNavigation` to `VitrineScreen`; pass `onPress` callback to `ProdutoCard` that calls `navigation.navigate('Produto', { produtoId: produto.id })`; ensure `ProdutoCard` uses `Pressable` with opacity feedback

**Checkpoint**: Navigation from product card to ProdutoScreen working.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple sections.

- [x] T015 [P] Add `accessibilityLabel` and `accessibilityRole` to all vitrine components (`SearchBar`, `VitrineBanner`, `PescadorCard`, `CategoriaChip`, `ProdutoCard`) per FR-036
- [x] T016 [P] Add image placeholder fallback (`Image` with `onError` → fallback icon/initial) for `ProdutoCard` (icone de peixe) and `PescadorCard` (inicial do nome) per FR-019, FR-030
- [x] T017 Verify responsive layout: confirm no horizontal scroll at 320px width; all touch targets ≥44x44px per FR-035
- [x] T018 Run `npx tsc --noEmit` and fix any type errors; run lint

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational complete
  - US1 (Phase 3) → US2 (Phase 4) → US3 (Phase 5) → US4 (Phase 6): Sequential preferred
  - US2, US3, US4 can technically proceed in parallel after US1 since they modify different components/SearchBar
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **US2 (P2)**: Depends on US1 (VitrineScreen layout with PescadorCard and CategoriaChip)
- **US3 (P2)**: Depends on US1 (VitrineScreen layout); independent of US2
- **US4 (P2)**: Depends on US1 (ProdutoCard already created); independent of US2/US3

### Within Each User Story

- Components (marked [P]) before integration
- Integration tasks depend on component tasks

### Parallel Opportunities

| Phase | Tasks | Parallel? |
|-------|-------|-----------|
| Phase 2 | T002, T003 | ✅ Yes — different files |
| Phase 3 | T005, T006, T007, T008 | ✅ Yes — different component files |
| Phase 3 | T009 | ❌ Depends on T005-T008 |
| Phase 4 | T010, T011 | ❌ Sequential (state then logic) |
| Phase 5 | T012, T013 | ❌ Sequential (component then integration) |
| Phase 6 | T014 | Single task |
| Phase 7 | T015, T016 | ✅ Yes — different files |

---

## Parallel Example: User Story 1

```bash
# Launch all components for US1 in parallel:
Task: "Create VitrineBanner in src/components/vitrine/VitrineBanner.tsx"
Task: "Create PescadorCard in src/components/vitrine/PescadorCard.tsx"
Task: "Create CategoriaChip in src/components/vitrine/CategoriaChip.tsx"
Task: "Create ProdutoCard in src/components/vitrine/ProdutoCard.tsx"

# After all complete, implement the screen:
Task: "Implement VitrineScreen in src/screens/vitrine/VitrineScreen.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Test US1 — vitrine carrega e exibe todos os blocos
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test → Demo (MVP!)
3. Add US2 → Test independently
4. Add US3 → Test independently
5. Add US4 → Test independently

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once Foundation done:
   - Dev A: US1 components (T005-T008) then US4 (T014)
   - Dev B: US3 (T012-T013)
   - Dev A or C: US2 (T010-T011)
3. After all components ready: integrate US1 screen (T009), then sequentially integrate US2, US3, US4

---

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 18 |
| Phase 1 (Setup) | 1 |
| Phase 2 (Foundational) | 3 |
| Phase 3 (US1 - P1) | 5 |
| Phase 4 (US2 - P2) | 2 |
| Phase 5 (US3 - P2) | 2 |
| Phase 6 (US4 - P2) | 1 |
| Phase 7 (Polish) | 4 |
| Parallel-capable tasks | 10 |
| MVP scope (Phase 1-3) | 9 tasks |
