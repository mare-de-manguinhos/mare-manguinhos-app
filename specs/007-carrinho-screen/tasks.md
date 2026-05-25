# Tasks: CarrinhoScreen — Carrinho de Compras

**Input**: Design documents from `specs/007-carrinho-screen/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

**Path Conventions**: Mobile app — `src/` at repository root (React Native + Expo).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure — nothing new to scaffold.

- [x] T001 [P] Verify all directories exist: `src/screens/carrinho/`, `src/store/`, `src/types/`, `src/components/ui/`, `src/navigation/`
- [x] T002 [P] Confirm existing `carrinhoStore.ts`, `types/index.ts`, `CarrinhoScreen.tsx`, `AppButton.tsx`, `AppNavigator.tsx` are present and readable

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update data layer and state layer BEFORE any screen work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Update `CarrinhoStore` interface in `src/types/index.ts:249` — change `removerItem(produtoId: string)` to `removerItem(produtoId: string, corte: Corte)`
- [x] T004 Rewrite `adicionarItem` in `src/store/carrinhoStore.ts:7` — implement merge logic: if entry with same (produto.id, corte) exists, increment `pesoKg`; otherwise push new entry
- [x] T005 Rewrite `removerItem` in `src/store/carrinhoStore.ts:12` — filter using `(item.produto.id !== produtoId || item.corte !== corte)` to remove only the matching (produtoId, corte) pair

**Checkpoint**: `carrinhoStore` now supports merge-on-add and remove-by-pair. Open `CarrinhoScreen` in Expo — should still show placeholder (no errors). User story implementation can now begin.

---

## Phase 3: User Story 1 + 2 — Visualizar e Remover Itens (Priority: P1) 🎯 MVP

**Goal**: CarrinhoScreen exibe lista de itens do Zustand com foto, nome, corte, peso, valor e botão remover. Rodapé fixo com subtotal e "Ir para Checkout". Remoção com feedback visual.

**Independent Test**: Adicionar 2+ itens via ProdutoScreen (ou mockar no carrinhoStore). Navegar para aba Carrinho — verificar cards com dados corretos, subtotal calculado. Remover um item — verificar que desaparece e subtotal recalculado. Remover último item — verificar transição para estado vazio.

### Implementation for User Story 1 + 2

- [x] T006 [US1] Create item card layout inline in `src/screens/carrinho/CarrinhoScreen.tsx` — card horizontal com thumbnail 64x64 (placeholder `fish-outline` se erro de imagem), nome da espécie em negrito, corte, peso, valor formatado (R$), botão lixeira com `accessibilityLabel`, cantos arredondados 12px, sombra sutil
- [x] T007 [US1] Build main screen layout in `src/screens/carrinho/CarrinhoScreen.tsx` — `ScrollView` com lista de itens; rodapé fixo (View absoluta no bottom) com subtotal à esquerda e botão "Ir para Checkout" (reutilizar `AppButton` com variant `primary`, altura 52px, borderRadius 12px — cor terracota existente do componente)
- [x] T008 [US1] Wire data from `useCarrinhoStore` em `src/screens/carrinho/CarrinhoScreen.tsx` — ler `itens` e `total()` do store; exibir subtotal formatado como moeda; itens mapeados para `CarrinhoItemCard`
- [x] T009 [US2] Implement remoção com feedback em `src/screens/carrinho/CarrinhoScreen.tsx` — botão lixeira chama `removerItem(produtoId, corte)`. Feedback: animação de fade out (usar `Animated` do RN) antes de remover
- [x] T010 [US1] Implement navegação "Ir para Checkout" em `src/screens/carrinho/CarrinhoScreen.tsx` — usar `useNavigation` para navegar para tela Checkout (rota definida pelo AppNavigator). Enquanto CheckoutScreen não existe, é aceitável navegar para rota inexistente ou exibir alerta "Checkout em breve"
- [x] T011 [US1] Adicionar `accessibilityLabel` em todos os elementos interativos da CarrinhoScreen — botão remover (ex: "Remover Robalo filé"), botão "Ir para Checkout", imagem do produto

**Checkpoint**: CarrinhoScreen funcional com itens, remoção, subtotal e navegação. Testar no Expo.

---

## Phase 4: User Story 3 — Carrinho Vazio (Priority: P2)

**Goal**: Quando carrinho está vazio, exibir estado amigável com ilustração, texto e botão "Ver produtos" que navega para VitrineScreen.

**Independent Test**: Chamar `carrinhoStore.limpar()` ou garantir que `itens` esteja vazio. Abrir aba Carrinho — verificar ilustração, texto "Seu carrinho está vazio" e botão "Ver produtos". Tocar no botão — verificar navegação para VitrineScreen.

### Implementation for User Story 3

- [x] T012 [P] [US3] Create empty state layout in `src/screens/carrinho/CarrinhoScreen.tsx` — ícone grande de carrinho vazio (Ionicons `cart-outline` size 80, cor #6B655A), texto "Seu carrinho está vazio" (text-ardosia, text-lg), texto secundário "Explore os produtos disponíveis e adicione itens ao carrinho" (text-marinha, text-sm), botão "Ver produtos" (AppButton variant primary)
- [x] T013 [US3] Implement conditional rendering em `src/screens/carrinho/CarrinhoScreen.tsx` — se `itens.length === 0` renderiza empty state; senão renderiza lista + rodapé. Rodapé NÃO aparece no estado vazio (FR-014)
- [x] T014 [US3] Wire navegação "Ver produtos" em `src/screens/carrinho/CarrinhoScreen.tsx` — usar `navigation.navigate('Vitrine')` para voltar à aba Vitrine. Adicionar `accessibilityLabel` no botão "Ver produtos"

**Checkpoint**: Carrinho vazio exibe estado amigável. Navegação para Vitrine funciona. Carrinho com itens exibe lista. Transição entre estados é suave.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Refinamentos visuais, edge cases e verificação de integração.

- [x] T015 [P] Handle image load error on item cards in `src/screens/carrinho/CarrinhoScreen.tsx` — se foto falhar, exibir placeholder (ícone peixe `fish-outline` em fundo neutro) mantendo dimensões 64x64
- [x] T016 Add `tabBarBadge` to Carrinho tab in `src/navigation/AppNavigator.tsx:37` — no `<Tab.Screen name="Carrinho">", adicionar `options={{ tabBarBadge: badgeCount > 0 ? badgeCount : undefined }}`. Badge some quando `itens.length === 0`. Reativo via hook Zustand.
- [ ] T017 Verify responsive layout in `src/screens/carrinho/CarrinhoScreen.tsx` — testar em larguras 320px–430px (sem scroll horizontal ou elementos cortados). Ajustar padding/layout se necessário
- [x] T018 [P] Clean up placeholder code — remover conteúdo placeholder antigo (View com Text "Carrinho") de `src/screens/carrinho/CarrinhoScreen.tsx` após confirmação de que tudo funciona

**Nota**: FR-017 (dados mockados via helper) é atendido indiretamente pela ProdutoScreen — os itens chegam ao carrinho via `adicionarItem()` real, não via helper separado. Nenhuma task adicional necessária. FR-018 (troca mock→real sem alterar tela) é verificado no Constitution Check do PR (Princípio I — Data Layer isolada da UI).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 + US2 (Phase 3)**: Depends on Foundational — carries main screen
- **US3 (Phase 4)**: Depends on Foundational — can run after or alongside Phase 3
- **Polish (Phase 5)**: Depends on US1 + US2 + US3 being complete

### User Story Dependencies

- **US1 + US2 (P1)**: Require Foundational (Phase 2) — no dependency on other stories. These are the MVP.
- **US3 (P2)**: Requires Foundational (Phase 2) — no dependency on US1/US2. Can be implemented independently since it's conditional rendering based on `itens.length === 0`.
- In practice, US1, US2, and US3 are tightly coupled (same screen, different states) — recommended to implement together for a complete CarrinhoScreen.

### Within Each Phase

- Models/types before store (data contract established first)
- Store before screen (state layer ready before UI)
- Core layout before polish
- Screen complete before moving to next phase

### Parallel Opportunities

- T001 and T002 can run in parallel (independent directory checks)
- T003 (types) must complete BEFORE T004, T005 (store)
- T012 (empty state layout) can run in parallel with T006-T011 (items view) since they're different rendering branches
- T015, T016, T017, T018 can all run in parallel (different concerns)

---

## Parallel Example: CarrinhoScreen Implementation

```bash
# Phase 1: All setup tasks in parallel
Task: "Verify directories in src/screens/carrinho/ src/store/ src/types/"
Task: "Confirm existing files present"

# Phase 2: Sequential (types before store)
Task: "Update CarrinhoStore interface in types/index.ts"
Task: "Then: Rewrite adicionarItem and removerItem in carrinhoStore.ts"

# Phase 3 + 4: Main screen (can work on items + empty state in parallel)
Task: "Create CarrinhoItemCard in CarrinhoScreen.tsx" # [US1]
Task: "Build screen layout with ScrollView + rodapé fixo" # [US1]
Task: "Wire data from useCarrinhoStore" # [US1]
Task: "Create empty state layout in CarrinhoScreen.tsx" # [US3] - parallel branch
Task: "Implement remoção with fade out feedback" # [US2]
Task: "Wire navigation for Ir para Checkout and Ver produtos" # [US1][US3]
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (minutes — verify structure)
2. Complete Phase 2: Foundational (types + store — blocking for everything)
3. Complete Phase 3: US1 + US2 (CarrinhoScreen with items, removal, subtotal, checkout nav)
4. **STOP and VALIDATE**: Test CarrinhoScreen independently via Expo
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 (items + remove) → Test independently → Demo (MVP! 🎯)
3. Add US3 (empty state) → Test independently → Demo
4. Add Polish (image fallback, badge, responsiveness) → Final review

### Parallel Team Strategy

With multiple developers:
1. Everyone: Phase 1 + 2 together (small effort)
2. Once Foundational is done:
   - Developer A: US1 + US2 (main screen items + removal)
   - Developer B: US3 (empty state) — independent parallel work
3. Merge and polish together in Phase 5

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No test tasks included — project has no test framework installed (test setup is out of scope)
- Commit after each task or logical group using Conventional Commits
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
