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
- [ ] T002 [P] Adicionar tipos `AuthCredentials`, `RegisterPayload` (incluindo `endereco: { cep, logradouro, numero, complemento?, bairro, cidade, estado }`), `LoginFormState`, `BasicFormState`, `AddressFormState` e `RegisterStep` ao final de `src/types/index.ts` conforme definições em `data-model.md`

**Checkpoint**: Paleta disponível como classes Tailwind; tipos de domínio exportados de `src/types/index.ts`. Qualquer componente pode agora usar `className="bg-mar"` e importar os tipos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Utilitários de máscara, store de autenticação e componentes atômicos de UI — todos os user stories dependem destes.

**⚠️ CRÍTICO**: Nenhuma tela pode ser implementada antes desta fase estar completa.

- [ ] T003 Criar `src/utils/formatPhone.ts` com as funções `formatBrazilianPhone(raw: string): string` e `rawPhone(formatted: string): string` conforme `research.md` R-002
- [ ] T004 [P] Criar `src/utils/formatCEP.ts` com as funções `formatCEP(raw: string): string` (aplica máscara `00000-000` a até 8 dígitos) e `rawCEP(formatted: string): string` (remove a máscara para validação)
- [ ] T005 [P] Criar `src/store/authStore.ts` implementando a interface `AuthStore` de `src/types/index.ts` com Zustand + `expo-secure-store`; incluir ação `register(payload: RegisterPayload): Promise<void>` que internamente chama `login()` após sucesso — ambas mockadas com delay de 1500ms conforme `research.md` R-003
- [ ] T006 [P] Criar `src/components/ui/AppButton.tsx` com props `AppButtonProps` (tipada em `data-model.md`): variantes `primary`/`secondary`, estado `loading` com `ActivityIndicator`, estado `disabled` com opacidade reduzida, feedback de toque via `activeOpacity={0.8}` ou `Pressable` com estilo de pressionado, props de acessibilidade `accessibilityLabel` e `accessibilityRole="button"`
- [ ] T007 [P] Criar `src/components/ui/AppInput.tsx` com props `AppInputProps` (tipada em `data-model.md`): label acima, bordas com estado normal/foco/erro, toggle de visibilidade de senha quando `onToggleSecure` fornecido, mensagem de erro abaixo, props `accessibilityLabel`, `accessibilityHint` e `accessible`
- [ ] T008 [P] Criar `src/components/ui/StepIndicator.tsx` com props `{ currentStep: 1 | 2; totalSteps: 2; labels: string[] }`: exibe dois círculos numerados conectados por linha; o círculo ativo usa `bg-mar` e o inativo `bg-pedra-mar`; exibe rótulo textual abaixo de cada círculo (ex: "Dados" / "Endereço"); `accessibilityLabel="Etapa N de 2"` no container
- [ ] T009 Criar `src/components/shared/OceanHeader.tsx` exibindo a área de cabeçalho decorativa: fundo com cor sólida `bg-mar` (ou gradiente linear usando `expo-linear-gradient` se disponível no managed workflow); `assets/app-icon.png` via `<Image>` centralizado; prop `title?: string` para subtítulo; `accessibilityLabel="Cabeçalho decorativo do Maré de Manguinhos"`. **Nota**: se `expo-linear-gradient` não estiver instalado, usar `bg-mar` sólido com wave shape simulada via `borderBottomLeftRadius` e `borderBottomRightRadius` generosos.

**Checkpoint**: Utilitários de telefone e CEP testáveis manualmente; `useAuthStore` importável; `AppButton`, `AppInput`, `StepIndicator` e `OceanHeader` renderizáveis de forma isolada. Telas podem agora ser construídas.

---

## Phase 3: User Story 1 — Acesso ao App via Login (Priority: P1) 🎯 MVP

**Goal**: Um usuário existente vê a tela de login com identidade visual viva (cabeçalho decorativo de oceano, formulário em card com sombra), rola a tela quando necessário, preenche credenciais e é autenticado via mock.

**Independent Test**: Abrir o app → tela de login renderiza com `OceanHeader` (logo + cor praiana), card de formulário com sombra, campos de e-mail e senha, botão "Entrar" e link "Cadastre-se". Preencher campos inválidos → erros inline aparecem. Preencher campos válidos e tocar "Entrar" → botão entra em loading por ~1.5s → app navega para a vitrine. Em dispositivo 320px, rolar a tela até o fim → todos os elementos acessíveis.

### Implementation for User Story 1

- [ ] T010 [US1] Implementar `src/screens/auth/LoginScreen.tsx` substituindo o stub existente: layout com `KeyboardAvoidingView` + `ScrollView` (contentContainerStyle com `flexGrow: 1`); `OceanHeader` no topo; abaixo do header, card de formulário com `bg-espuma`, `rounded-2xl`, `shadow-md` e padding interno contendo: subtítulo "Entre na sua conta" (`text-marinha`), `AppInput` e-mail, `AppInput` senha com toggle, link "Esqueci minha senha" (Alert informativo), `AppButton` "Entrar", card de aviso de bloqueio (condicional), link "Ainda não tem conta? Cadastre-se"
- [ ] T011 [US1] Adicionar estado local `LoginFormState` (via `useState`) e lógica de validação em `LoginScreen.tsx`: validar e-mail não vazio e formato válido; senha não vazia; exibir erros inline passados via prop `error` ao `AppInput`; desabilitar botão durante `loading`
- [ ] T012 [US1] Adicionar lógica de submissão em `LoginScreen.tsx`: chamar `useAuthStore().login(email, password)` no `handleSubmit`; incrementar `tentativasFalhas` em caso de erro mockado; exibir card de bloqueio e desabilitar botão quando `tentativasFalhas >= 5` conforme `research.md` R-004
- [ ] T013 [US1] Modificar `src/navigation/RootNavigator.tsx` substituindo o stub `const isAuthenticated = false` por `const isAuthenticated = !!useAuthStore((s) => s.token)` com import de `useAuthStore` conforme TODO já presente no arquivo — RootNavigator agora reage ao store

**Checkpoint (US1)**: Tela de login completamente funcional e visualmente aplicada. `OceanHeader` visível, formulário em card com sombra, scroll funciona em dispositivos compactos. Usuário pode autenticar via mock e ser redirecionado. Validação inline funciona. Bloqueio após 5 tentativas funciona.

---

## Phase 4: User Story 2 — Criação de Nova Conta em Duas Etapas (Priority: P2)

**Goal**: Um novo usuário acessa o registro pelo link no login, preenche dados básicos na Etapa 1, avança para a Etapa 2 de endereço, completa o cadastro e é automaticamente autenticado — sem fazer login manualmente.

**Independent Test**: Tocar "Cadastre-se" → tela de registro exibe Etapa 1 com `StepIndicator` ("Etapa 1 de 2") e campos de dados básicos. Submeter vazio → erros inline, permanece na Etapa 1. Preencher Etapa 1 corretamente → tocar "Próximo" → avança para Etapa 2 com `StepIndicator` ("Etapa 2 de 2") e campos de endereço. Tocar "Voltar" → retorna para Etapa 1 com dados preservados. Preencher Etapa 2 e tocar "Criar conta" → loading 1.5s → navega para vitrine.

### Implementation for User Story 2

- [ ] T014 [US2] Implementar `src/screens/auth/RegisterScreen.tsx` substituindo o stub existente: layout com `KeyboardAvoidingView` + `ScrollView` (contentContainerStyle com `flexGrow: 1`, `paddingBottom: 32`); `OceanHeader` no topo com título "Criar conta"; `StepIndicator` abaixo do header com `currentStep` e labels `["Dados", "Endereço"]`; card de formulário com `bg-espuma`, `rounded-2xl`, `shadow-md`; renderização condicional do formulário da etapa ativa via estado `currentStep: 1 | 2`
- [ ] T015 [US2] Implementar **Etapa 1** em `RegisterScreen.tsx` com estado `BasicFormState` (via `useState`): campos em ordem: Nome completo, E-mail, Confirmar e-mail, Senha (toggle), Confirmar senha (toggle), Telefone (WhatsApp com `formatBrazilianPhone` no `onChangeText`); botão `AppButton` "Próximo" que aciona `handleStep1Submit`; link "Já tenho conta? Entrar" abaixo do botão
- [ ] T016 [US2] Implementar lógica `handleStep1Submit` em `RegisterScreen.tsx`: validar nome ≥ 3 chars; e-mail válido; confirmEmail === email; senha ≥ 8 chars; confirmPassword === password; telefone mínimo 10 dígitos (`rawPhone(telefone).length >= 10`); se qualquer validação falhar → exibir erros inline e permanecer na Etapa 1; se todos os campos válidos → `setCurrentStep(2)` e fazer scroll para o topo do `ScrollView` via `scrollViewRef.current?.scrollTo({ y: 0 })`
- [ ] T017 [US2] Implementar **Etapa 2** em `RegisterScreen.tsx` com estado `AddressFormState` (via `useState`): campos em ordem: CEP (com `formatCEP` no `onChangeText`, `keyboardType="numeric"`), Logradouro/Rua, Número (`keyboardType="numeric"`), Complemento (opcional — placeholder "Apto, Bloco, Casa..."), Bairro, Cidade, Estado/UF; botão `AppButton` "Criar conta"; botão/link "Voltar" que aciona `setCurrentStep(1)` sem apagar dados da Etapa 1
- [ ] T018 [US2] Adicionar lógica de submissão `handleRegisterSubmit` em `RegisterScreen.tsx`: validar campos obrigatórios da Etapa 2 (CEP com 8 dígitos via `rawCEP`, logradouro, número, bairro, cidade, estado não vazios); construir `RegisterPayload` a partir dos dois estados de formulário; chamar `useAuthStore().register(payload)`; tratar erro de e-mail duplicado (mock 409) exibindo erro inline no campo e-mail da Etapa 1 e retornando para `currentStep(1)`; após sucesso o `RootNavigator` reage automaticamente ao token no store

**Checkpoint (US2)**: Tela de registro completamente funcional com duas etapas. `StepIndicator` atualiza visualmente ao avançar. Scroll funciona em ambas as etapas. Dados da Etapa 1 preservados ao navegar para Etapa 2 e voltar. Todos os campos de endereço validam corretamente. Auto-login pós-registro funciona. E-mail duplicado (mock) retorna para Etapa 1 com erro inline.

---

## Phase 5: User Story 3 — Experiência Visual Viva com Identidade Praiana (Priority: P3)

**Goal**: Ambas as telas usam `OceanHeader` com identidade decorativa, formulários em cards com sombra, todas as cores da paleta praiana, feedback de toque em elementos interativos, e todos os campos/botões têm labels de acessibilidade.

**Independent Test**: Inspecionar ambas as telas: `OceanHeader` visível com logo; card de formulário com sombra e cantos arredondados; nenhuma cor fora da paleta praiana; pressionar botão → feedback visual de opacidade; ativar VoiceOver/TalkBack → todos os elementos lidos com rótulos descritivos; `StepIndicator` na tela de registro visível e legível.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Auditar `src/screens/auth/LoginScreen.tsx` substituindo qualquer classe de cor que não pertença à paleta praiana pelas classes customizadas correspondentes; confirmar que `OceanHeader` é o primeiro elemento visual proeminente; confirmar card de formulário com `shadow-md` e `rounded-2xl`; confirmar `ScrollView` com `contentContainerStyle={{ flexGrow: 1 }}`
- [ ] T020 [P] [US3] Auditar `src/screens/auth/RegisterScreen.tsx` substituindo qualquer classe de cor fora da paleta; confirmar `StepIndicator` renderiza corretamente em ambas as etapas; confirmar `OceanHeader` visível; confirmar `ScrollView` com scroll suave e `paddingBottom` suficiente para não esconder o botão atrás do teclado; confirmar que `scrollViewRef.current?.scrollTo({ y: 0 })` é chamado ao avançar de etapa
- [ ] T021 [US3] Auditar props de acessibilidade em `src/components/ui/AppInput.tsx`, `src/components/ui/AppButton.tsx` e `src/components/ui/StepIndicator.tsx`: verificar que todos os elementos têm `accessibilityLabel` descritivo em português, `accessibilityHint` quando necessário, e `accessibilityState={{ disabled }}` no botão quando desabilitado ou em loading

**Checkpoint (US3)**: Ambas as telas visualmente vivas e coesas com identidade praiana. Elementos decorativos presentes. Cards com sombra. Scroll funciona. Feedback de toque em botões. VoiceOver/TalkBack navega por todos os elementos com rótulos descritivos.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final de integração, limpeza e verificação de conformidade com a constituição.

- [ ] T022 [P] Validar manualmente todos os cenários do `quickstart.md` (checklist de 10 itens) e corrigir quaisquer divergências encontradas; incluir validação manual do fluxo de duas etapas do registro end-to-end
- [ ] T023 [P] Verificar Constitution Check em todos os arquivos criados/modificados: nenhuma chamada HTTP em telas; nenhum `any`; JWT em `SecureStore`; tipos somente em `src/types/index.ts`; sem imports cruzados entre domínios

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
Phase 4 (US2 — Registro 2 etapas) ──── MVP completo
    ↓
Phase 5 (US3 — Visual/Acessibilidade)
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

- **US1 (P1 — Login)**: Pode iniciar após Phase 2 completa. Independente de US2 e US3.
- **US2 (P2 — Registro)**: Pode iniciar após Phase 2 completa. Independe de US1 (usa os mesmos componentes, mas tela diferente). Integra-se ao `RootNavigator` já ligado em T013.
- **US3 (P3 — Visual)**: Depende de US1 e US2 estarem implementadas (T010–T018) para poder auditar as telas. As tarefas T019 e T020 são [P] entre si.

### Parallelization Opportunities

| Tarefas | Podem rodar em paralelo? | Motivo |
|---------|--------------------------|--------|
| T001 + T002 | ✅ Sim | Arquivos diferentes (`tailwind.config.js` vs `src/types/index.ts`) |
| T003 + T004 + T005 + T006 + T007 + T008 | ✅ Sim | Todos independentes entre si (arquivos diferentes) |
| T009 | ❌ Depende de T006 | `OceanHeader` usa `AppLogo` internamente |
| T010 + T011 + T012 | ❌ Não | Sequenciais — mesmo arquivo `LoginScreen.tsx` |
| T014 + T015 + T016 + T017 + T018 | ❌ Não | Sequenciais — mesmo arquivo `RegisterScreen.tsx` |
| T019 + T020 | ✅ Sim | Arquivos diferentes (LoginScreen vs RegisterScreen) |
| T022 + T023 | ✅ Sim | Validações independentes |

---

## Summary

| Métrica | Valor |
|---------|-------|
| Total de tarefas | **23** |
| Tarefas paralelizáveis [P] | **11** |
| Tarefas US1 (Login) | **4** (T010–T013) |
| Tarefas US2 (Registro 2 etapas) | **5** (T014–T018) |
| Tarefas US3 (Visual) | **3** (T019–T021) |
| Tarefas Setup/Foundational | **9** (T001–T009) |
| Tarefas Polish | **2** (T022–T023) |
| Arquivos a criar | **10** |
| Arquivos a modificar | **5** |

### Suggested MVP Scope

**MVP mínimo = Phase 1 + Phase 2 + Phase 3** (T001–T013): tela de login funcional com identidade visual viva e autenticação mockada. Demonstrável e entregável de forma independente.

**MVP completo = Phase 1–5** (T001–T021): ambas as telas implementadas com registro em duas etapas, campos de endereço padrão delivery, scroll funcional, identidade visual viva e acessibilidade.

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
