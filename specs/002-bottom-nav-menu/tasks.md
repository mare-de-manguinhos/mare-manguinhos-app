# Tasks: Menu de Navegação Inferior (Bottom Tabs)

**Input**: Design documents from `/specs/002-bottom-nav-menu/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Não solicitados na especificação — todas as telas são placeholder sem lógica de negócio.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `src/` at repository root
- Estrutura feature-based conforme plano: `src/navigation/`, `src/screens/<dominio>/`, `src/components/shared/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verificar dependências e estrutura do projeto

**Observação**: Todas as dependências (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`, `@expo/vector-icons`) já estão instaladas no `package.json`. Nenhuma instalação adicional necessária.

- [x] T001 Verificar que `@react-navigation/bottom-tabs` e `@react-navigation/stack` constam no package.json e estão instalados em node_modules
- [x] T002 [P] Verificar que `src/screens/vitrine/`, `src/screens/carrinho/`, `src/screens/pedido/`, `src/screens/perfil/` existem (criar se necessário)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos de navegação, componente de ícone e telas placeholder — tudo que é base para os navigators

**⚠️ CRITICAL**: Nenhum user story pode começar sem esta fase concluída

- [x] T003 Criar tipos de navegação compartilhados em `src/navigation/types.ts` com `AppTabParamList`, `VitrineStackParamList`, `PedidosStackParamList` conforme contracts/navigation.md
- [x] T004 [P] Criar `src/components/shared/TabIcon.tsx` — componente que renderiza ícone Ionicons (ativa = filled, inativa = outline) com cor configurável, mapeando por nome da aba: Vitrine→storefront, Carrinho→cart, Pedidos→receipt, Perfil→person
- [x] T005 [P] Criar tela placeholder `src/screens/vitrine/VitrineScreen.tsx` exibindo "Vitrine" como título
- [x] T006 [P] Criar tela placeholder `src/screens/vitrine/ProdutoScreen.tsx` exibindo "Produto" como título
- [x] T007 [P] Criar tela placeholder `src/screens/carrinho/CarrinhoScreen.tsx` exibindo "Carrinho" como título
- [x] T008 [P] Criar tela placeholder `src/screens/pedido/HistoricoScreen.tsx` exibindo "Histórico" como título
- [x] T009 [P] Criar tela placeholder `src/screens/pedido/AcompanhamentoScreen.tsx` exibindo "Acompanhamento" como título
- [x] T010 [P] Criar tela placeholder `src/screens/perfil/PerfilScreen.tsx` exibindo "Perfil" como título

**Checkpoint**: Tipos, ícones e 6 telas placeholder prontos — implementação dos navigators pode começar

---

## Phase 3: User Story 1 — Navegar entre abas principais (Priority: P1) 🎯 MVP

**Goal**: Usuário autenticado vê menu inferior com 4 abas e navega entre elas

**Independent Test**: Abrir o app autenticado e tocar em cada aba (Vitrine, Carrinho, Pedidos, Perfil), confirmando que a tela placeholder correspondente é exibida e a aba fica visualmente destacada

### Implementation for User Story 1

- [x] T011 [US1] Modificar `src/navigation/AppNavigator.tsx` — implementar `createBottomTabNavigator<AppTabParamList>()` com 4 tabs: Vitrine (VitrineScreen), Carrinho (CarrinhoScreen), Pedidos (HistoricoScreen), Perfil (PerfilScreen)
- [x] T012 [US1] Configurar `tabBarIcon` em AppNavigator.tsx usando componente TabIcon com mapeamento de ícones por aba
- [x] T013 [US1] Configurar estilos do tab bar em AppNavigator.tsx: fundo `areia` (#FDF6EC), aba ativa com cor `oceano` (#2E86AB), aba inativa com cor `marinha` (#5A7A87), borda superior sutil, `tabBarStyle` com paddingBottom seguro

**Checkpoint**: Menu inferior funcional com 4 abas. US1 completo e testável independentemente.

---

## Phase 4: User Story 2 — Navegação em pilha dentro de uma aba (Priority: P2)

**Goal**: Dentro das abas Vitrine e Pedidos, o usuário navega entre telas em pilha com botão voltar

**Independent Test**: Navegar VitrineScreen → ProdutoScreen (com botão voltar) e HistoricoScreen → AcompanhamentoScreen (com botão voltar), confirmando ida e volta

### Implementation for User Story 2

- [x] T014 [P] [US2] Criar `src/navigation/VitrineStack.tsx` com `createStackNavigator<VitrineStackParamList>()` contendo VitrineScreen e ProdutoScreen, com botão voltar configurado
- [x] T015 [P] [US2] Criar `src/navigation/PedidosStack.tsx` com `createStackNavigator<PedidosStackParamList>()` contendo HistoricoScreen e AcompanhamentoScreen, com botão voltar configurado
- [x] T016 [US2] Atualizar `src/navigation/AppNavigator.tsx` — aba Vitrine passa a usar VitrineStack, aba Pedidos passa a usar PedidosStack (Carrinho e Perfil permanecem como telas diretas)

**Checkpoint**: Stacks de navegação funcionando. US1 + US2 completos e independentemente testáveis.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finais e verificação de integração

- [x] T017 Verificar que `RootNavigator.tsx` não precisa de alterações — já decide entre AuthNavigator e AppNavigator corretamente
- [x] T018 Rodar compilação TypeScript (`npx tsc --noEmit`) para verificar tipagem em todos os arquivos novos
- [x] T019 Executar quickstart.md validation: testar navegação entre 4 abas + stacks + botão voltar

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todos os user stories
- **US1 (Phase 3)**: Depende do Foundational — P1, MVP
- **US2 (Phase 4)**: Depende do US1 (precisa das abas funcionando) e do Foundational
- **Polish (Phase 5)**: Depende de US1 e US2 completos

### User Story Dependencies

- **User Story 1 (P1)**: Começa após Foundational (Phase 2) — sem dependências de outras stories ✅ MVP
- **User Story 2 (P2)**: Começa após US1 — importa stacks nas abas já existentes

### Parallel Opportunities

- T002, T004-T010: Todas as telas placeholder + TabIcon podem ser criadas em paralelo
- T014, T015: VitrineStack e PedidosStack podem ser criados em paralelo

---

## Parallel Example: User Story 1

```bash
# Placeholder screens and TabIcon can be created together:
Task: "Criar TabIcon.tsx, VitrineScreen.tsx, ProdutoScreen.tsx, CarrinhoScreen.tsx, HistoricoScreen.tsx, AcompanhamentoScreen.tsx, PerfilScreen.tsx"
# After all foundational tasks:
Task: "Modificar AppNavigator.tsx com 4 bottom tabs"
```

## Parallel Example: User Story 2

```bash
# Both stacks can be created in parallel:
Task: "Criar VitrineStack.tsx"
Task: "Criar PedidosStack.tsx"
# Then update AppNavigator to use them
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verificação)
2. Complete Phase 2: Foundational (tipos + telas + ícone)
3. Complete Phase 3: User Story 1 (AppNavigator com 4 abas)
4. **STOP and VALIDATE**: Testar navegação entre as 4 abas
5. MVP funcional com navegação básica entre telas placeholder

### Incremental Delivery

1. Setup + Foundational → Base pronta
2. Add US1 → Navegação entre 4 abas → TESTAR → MVP 🎯
3. Add US2 → Stacks Vitrine e Pedidos → TESTAR → Demo completo
4. Polish → Verificação final

### Parallel Team Strategy

Com múltiplos desenvolvedores:

1. Time completo faz Setup + Foundational juntos
2. Após Foundational:
   - Dev A: US1 (AppNavigator com 4 abas)
   - (US2 depende de US1 — precisa ser sequencial)
3. Após US1:
   - Dev A: VitrineStack
   - Dev B: PedidosStack
   - (em paralelo entre si)
4. Um dev atualiza AppNavigator para usar os stacks

---

## Notes

- [P] tasks = diferentes arquivos, sem dependências entre si
- [Story] label mapeia task para user story específica
- Cada user story é independentemente completável e testável
- Commit após cada tarefa ou grupo lógico
- Parar em qualquer checkpoint para validar a story independentemente
- Evitar: tasks vagas, conflitos no mesmo arquivo, dependências cross-story
