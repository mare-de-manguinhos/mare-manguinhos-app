---
description: "Task list for Auth Screens UI — Login & Registro"
---

# Tasks: Auth Screens UI — Login & Registro

**Input**: Design documents from `specs/001-auth-screens-ui/`  
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/auth-api.md ✅ · quickstart.md ✅

**Tests**: Não solicitados — sem tarefas de teste automatizado nesta feature.

**Organization**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: User story a que a tarefa pertence (US1, US2, US3)
- Tarefas de Setup e Foundational não têm label de story

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fundar a paleta de cores e os tipos de domínio — sem isso nenhuma tela pode ser construída com a identidade visual correta.

- [ ] T001 Estender `tailwind.config.js` com a paleta de cores praiana completa (12 tokens: `mar`, `mar-dark`, `oceano`, `solar`, `areia-dourada`, `areia`, `espuma`, `pedra-mar`, `ardosia`, `marinha`, `coral`, `mangue`) em `theme.extend.colors`
- [ ] T002 [P] Adicionar tipos `AuthCredentials`, `RegisterPayload`, `LoginFormState` e `RegisterFormState` ao final de `src/types/index.ts` conforme definições em `data-model.md`

**Checkpoint**: Paleta disponível como classes Tailwind; tipos de domínio exportados de `src/types/index.ts`. Qualquer componente pode agora usar `className="bg-mar"` e importar os tipos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Utilitário de máscara, store de autenticação e componentes atômicos de UI — todos os user stories dependem destes.

**⚠️ CRÍTICO**: Nenhuma tela pode ser implementada antes desta fase estar completa.

- [ ] T003 Criar `src/utils/formatPhone.ts` com as funções `formatBrazilianPhone(raw: string): string` e `rawPhone(formatted: string): string` conforme `research.md` R-002
- [ ] T004 [P] Criar `src/store/authStore.ts` implementando a interface `AuthStore` de `src/types/index.ts` com Zustand + `expo-secure-store`; incluir ação `register(payload: RegisterPayload): Promise<void>` que internamente chama `login()` após sucesso — ambas mockadas com delay de 1500ms conforme `research.md` R-003
- [ ] T005 [P] Criar `src/components/ui/AppButton.tsx` com props `AppButtonProps` (tipada em `data-model.md`): variantes `primary`/`secondary`, estado `loading` com `ActivityIndicator`, estado `disabled` com opacidade reduzida, props de acessibilidade `accessibilityLabel` e `accessibilityRole="button"`
- [ ] T006 [P] Criar `src/components/ui/AppInput.tsx` com props `AppInputProps` (tipada em `data-model.md`): label acima, bordas com estado normal/foco/erro, toggle de visibilidade de senha quando `onToggleSecure` fornecido, mensagem de erro abaixo, props `accessibilityLabel`, `accessibilityHint` e `accessible`
- [ ] T007 Criar `src/components/shared/AppLogo.tsx` exibindo `assets/app-icon.png` via `<Image source={require('../../../assets/app-icon.png')} />` com prop `size` (`sm`/`md`/`lg`) e `showTitle` (booleano); `accessibilityLabel="Logo do Maré de Manguinhos"` na imagem

**Checkpoint**: Utilitário de telefone testável manualmente; `useAuthStore` importável; `AppButton`, `AppInput` e `AppLogo` renderizáveis de forma isolada. Telas podem agora ser construídas.

---

## Phase 3: User Story 1 — Acesso ao App via Login (Priority: P1) 🎯 MVP

**Goal**: Um usuário existente vê a tela de login com identidade visual praiana, preenche credenciais, aciona o estado de carregamento e, após sucesso (mock), é autenticado e redirecionado para a vitrine.

**Independent Test**: Abrir o app → tela de login renderiza com logo, paleta praiana, campos de e-mail e senha, botão "Entrar" e link "Cadastre-se". Preencher campos inválidos → erros inline aparecem. Preencher campos válidos e tocar "Entrar" → botão entra em loading por ~1.5s → app navega para a vitrine (AppNavigator stub).

### Implementation for User Story 1

- [ ] T008 [US1] Implementar `src/screens/auth/LoginScreen.tsx` substituindo o stub existente: layout com `ScrollView` + `KeyboardAvoidingView`; seções: `AppLogo size="lg"`, subtítulo "Entre na sua conta" (`text-marinha`), `AppInput` e-mail, `AppInput` senha com toggle, link "Esqueci minha senha" (Alert informativo), `AppButton` "Entrar", card de aviso de bloqueio (condicional), link "Ainda não tem conta? Cadastre-se"
- [ ] T009 [US1] Adicionar estado local `LoginFormState` (via `useState`) e lógica de validação em `LoginScreen.tsx`: validar e-mail não vazio e formato válido; senha não vazia; exibir erros inline passados via prop `error` ao `AppInput`; desabilitar botão durante `loading`
- [ ] T010 [US1] Adicionar lógica de submissão em `LoginScreen.tsx`: chamar `useAuthStore().login(email, password)` no `handleSubmit`; incrementar `tentativasFalhas` em caso de erro mockado; exibir card de bloqueio e desabilitar botão quando `tentativasFalhas >= 5` conforme `research.md` R-004
- [ ] T011 [US1] Modificar `src/navigation/RootNavigator.tsx` substituindo o stub `const isAuthenticated = false` por `const isAuthenticated = !!useAuthStore((s) => s.token)` com import de `useAuthStore` conforme TODO já presente no arquivo — RootNavigator agora reage ao store

**Checkpoint (US1)**: Tela de login completamente funcional e visualmente aplicada à paleta praiana. Usuário pode autenticar via mock e ser redirecionado. Validação inline funciona. Bloqueio após 5 tentativas funciona.

---

## Phase 4: User Story 2 — Criação de Nova Conta (Priority: P2)

**Goal**: Um novo usuário acessa o registro pelo link no login, preenche todos os campos com validação local, toca "Criar conta" e é automaticamente autenticado e redirecionado para a vitrine sem fazer login manualmente.

**Independent Test**: Tocar "Cadastre-se" na tela de login → tela de registro renderiza com todos os campos. Submeter com campos vazios → erros inline. Preencher e-mails diferentes → erro de não-correspondência. Preencher tudo corretamente → loading 1.5s → navega para vitrine. Voltar para login e clicar "Cadastre-se" novamente → campos do registro estão vazios.

### Implementation for User Story 2

- [ ] T012 [US2] Implementar `src/screens/auth/RegisterScreen.tsx` substituindo o stub existente: layout com `ScrollView` + padding inferior para teclado; campos em ordem: Nome completo, E-mail, Confirmar e-mail, Senha (toggle), Confirmar senha (toggle), Telefone (WhatsApp), Bairro (opcional); botão "Criar conta"; link "Já tenho conta? Entrar"
- [ ] T013 [US2] Adicionar estado local `RegisterFormState` (via `useState`) e lógica de validação em `RegisterScreen.tsx`: nome ≥ 3 chars; e-mail válido; confirmEmail === email; senha ≥ 8 chars; confirmPassword === password; telefone mínimo 10 dígitos (`rawPhone(telefone).length >= 10`); exibir erros inline por campo; usar `formatBrazilianPhone` no `onChangeText` do campo Telefone
- [ ] T014 [US2] Adicionar lógica de submissão em `RegisterScreen.tsx`: chamar `useAuthStore().register(payload)` com `RegisterPayload` construído a partir dos campos; tratar erro de e-mail duplicado (mock 409) exibindo erro inline no campo e-mail com texto "Este e-mail já está cadastrado" + `Pressable` "Fazer login" que navega para Login; após sucesso o `RootNavigator` reage automaticamente ao token no store conforme `research.md` R-006

**Checkpoint (US2)**: Tela de registro completamente funcional. Todos os campos validam corretamente. Auto-login pós-registro funciona. E-mail duplicado (mock) exibe erro inline com link de login. Reset de formulário ao sair é gratuito via unmount (R-007).

---

## Phase 5: User Story 3 — Experiência Visual Coesa com Paleta Praiana (Priority: P3)

**Goal**: Ambas as telas usam exclusivamente as classes da paleta praiana, o logo é exibido de forma proeminente, e todos os campos/botões têm labels de acessibilidade compatíveis com VoiceOver e TalkBack.

**Independent Test**: Inspecionar visualmente ambas as telas e confirmar: nenhuma cor fora da paleta praiana; logo visível no topo da tela de login; ativar VoiceOver/TalkBack e navegar pelos campos — todos lidos com rótulos descritivos; contrastar Azul Mar `#1A5F7A` sobre Areia Clara `#FDF6EC` = 7.2:1 ≥ WCAG AA.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Auditar `src/screens/auth/LoginScreen.tsx` substituindo qualquer classe de cor que não pertença à paleta praiana (ex: `bg-white`, `bg-blue-600`, `text-gray-*`) pelas classes customizadas correspondentes (`bg-areia`, `bg-mar`, `text-ardosia`, etc.); confirmar que o `AppLogo` é o primeiro elemento visual proeminente
- [ ] T016 [P] [US3] Auditar `src/screens/auth/RegisterScreen.tsx` substituindo qualquer classe de cor fora da paleta praiana; confirmar uso consistente de `text-ardosia` para labels, `text-marinha` para textos secundários, `bg-areia` para fundo e `text-coral` para mensagens de erro
- [ ] T017 [US3] Auditar props de acessibilidade em `src/components/ui/AppInput.tsx` e `src/components/ui/AppButton.tsx`: verificar que todos os campos têm `accessibilityLabel` descritivo em português, `accessibilityHint` quando o campo tem comportamento não-óbvio, e `accessibilityState={{ disabled }}` no botão quando desabilitado ou em loading

**Checkpoint (US3)**: Ambas as telas visualmente coesas com identidade praiana. Contraste WCAG AA garantido. VoiceOver/TalkBack navega por todos os elementos com rótulos descritivos.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final de integração, limpeza e verficação de conformidade com a constituição.

- [ ] T018 [P] Validar manualmente todos os cenários do `quickstart.md` (checklist de 10 itens) e corrigir quaisquer divergências encontradas
- [ ] T019 [P] Verificar Constitution Check em todos os arquivos criados/modificados: nenhuma chamada HTTP em telas; nenhum `any`; JWT em `SecureStore`; tipos somente em `src/types/index.ts`; sem imports cruzados entre domínios

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOQUEIA tudo abaixo
    ↓
Phase 3 (US1 — Login) ──────────────── MVP entregável
    ↓
Phase 4 (US2 — Registro) ────────────── MVP completo
    ↓
Phase 5 (US3 — Visual/Acessibilidade)
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

- **US1 (P1 — Login)**: Pode iniciar após Phase 2 completa. Independente de US2 e US3.
- **US2 (P2 — Registro)**: Pode iniciar após Phase 2 completa. Independe de US1 (usa o mesmo store e componentes, mas tela diferente). Integra-se ao `RootNavigator` já ligado em T011.
- **US3 (P3 — Visual)**: Depende de US1 e US2 estarem implementadas (T008–T014) para poder auditar as telas. As tarefas T015 e T016 são [P] entre si.

### Parallelization Opportunities

| Tarefas | Podem rodar em paralelo? | Motivo |
|---------|--------------------------|--------|
| T001 + T002 | ✅ Sim | Arquivos diferentes (`tailwind.config.js` vs `src/types/index.ts`) |
| T004 + T005 + T006 | ✅ Sim | Arquivos diferentes (store, AppButton, AppInput) |
| T003 + T004 + T005 + T006 | ✅ Sim | Todos independentes entre si |
| T008 + T009 + T010 | ❌ Não | Sequenciais — mesmo arquivo `LoginScreen.tsx` |
| T012 + T013 + T014 | ❌ Não | Sequenciais — mesmo arquivo `RegisterScreen.tsx` |
| T015 + T016 | ✅ Sim | Arquivos diferentes (LoginScreen vs RegisterScreen) |
| T018 + T019 | ✅ Sim | Validações independentes |

---

## Summary

| Métrica | Valor |
|---------|-------|
| Total de tarefas | **19** |
| Tarefas paralelizáveis [P] | **9** |
| Tarefas US1 (Login) | **4** (T008–T011) |
| Tarefas US2 (Registro) | **3** (T012–T014) |
| Tarefas US3 (Visual) | **3** (T015–T017) |
| Tarefas Setup/Foundational | **7** (T001–T007) |
| Tarefas Polish | **2** (T018–T019) |
| Arquivos a criar | **7** |
| Arquivos a modificar | **5** |

### Suggested MVP Scope

**MVP mínimo = Phase 1 + Phase 2 + Phase 3** (T001–T011): tela de login funcional com identidade visual e autenticação mockada. Demonstrável e entregável de forma independente.

**MVP completo = Phase 1–5** (T001–T017): ambas as telas implementadas, validadas e visualmente coesas com a paleta praiana e acessibilidade.
