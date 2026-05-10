# Feature Specification: Auth Screens UI — Login & Registro

**Feature Branch**: `001-auth-screens-ui`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Telas de login e registro com paleta de cores praiana. Login com usuário/senha e redirecionamento para cadastro. Registro com campos adequados para o app. Implementação somente de UI preparada para integração futura."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Acesso ao App via Login (Priority: P1)

Um usuário que já possui conta no Maré de Manguinhos abre o aplicativo e é apresentado à tela de login. Ele informa suas credenciais (e-mail e senha), confirma e é direcionado à vitrine de pescados.

**Why this priority**: Sem autenticação funcional na UI, nenhum fluxo subsequente do app pode ser exercitado. É o ponto de entrada obrigatório para todos os usuários já cadastrados.

**Independent Test**: A tela de login pode ser renderizada, preenchida e ter seu botão de envio acionado de forma completamente isolada, validando campos e exibindo mensagens de erro inline — sem necessidade de API real.

**Acceptance Scenarios**:

1. **Given** o app está aberto pela primeira vez (ou o usuário foi desconectado), **When** a tela de login é exibida, **Then** o usuário vê campos de e-mail e senha, o logotipo do aplicativo, a paleta de cores praiana definida e um link "Ainda não tem conta? Cadastre-se".
2. **Given** o usuário está na tela de login, **When** ele deixa os campos em branco e toca em "Entrar", **Then** mensagens de validação aparecem inline abaixo de cada campo obrigatório vazio.
3. **Given** o usuário está na tela de login, **When** ele preenche e-mail e senha e toca em "Entrar", **Then** o botão exibe estado de carregamento (indicador visual) enquanto a ação está em andamento.
4. **Given** o usuário está na tela de login, **When** a autenticação retorna erro (ex: credenciais inválidas — mensagem mockada), **Then** uma mensagem de erro é exibida de forma amigável sem travar a tela.
5. **Given** o usuário está na tela de login, **When** ele toca em "Esqueci minha senha", **Then** uma mensagem informativa aparece indicando que a recuperação de senha será disponibilizada em breve.

---

### User Story 2 — Criação de Nova Conta em Duas Etapas (Priority: P2)

Um novo usuário que ainda não tem conta acessa a tela de registro a partir do link na tela de login. O cadastro é dividido em duas etapas: **Etapa 1 — Dados Básicos** (nome, e-mail, senha e telefone) e **Etapa 2 — Endereço** (CEP, logradouro, número, complemento, bairro, cidade e estado). Após concluir as duas etapas, o usuário é automaticamente autenticado e redirecionado para a vitrine.

**Why this priority**: O cadastro é o único caminho para novos usuários ingressarem no app. A divisão em duas etapas reduz a percepção de complexidade e segue o padrão consagrado de apps de delivery.

**Independent Test**: A tela de registro pode ser renderizada de forma isolada, com as duas etapas navegáveis, validação local em cada etapa e estado de sucesso exibido ao final — sem necessidade de API real.

**Acceptance Scenarios**:

1. **Given** o usuário toca em "Ainda não tem conta? Cadastre-se" na tela de login, **When** a navegação ocorre, **Then** a tela de registro é exibida na **Etapa 1 de 2** com indicador de progresso visível e todos os campos da etapa 1 em tela.
2. **Given** o usuário está na Etapa 1, **When** ele toca em "Próximo" com campos obrigatórios da etapa 1 vazios ou inválidos, **Then** mensagens de validação aparecem inline abaixo de cada campo com problema e o usuário permanece na Etapa 1.
3. **Given** o usuário preenche corretamente todos os campos da Etapa 1, **When** ele toca em "Próximo", **Then** a tela avança para a **Etapa 2 de 2** com indicador de progresso atualizado e os dados da Etapa 1 preservados em memória.
4. **Given** o usuário está na Etapa 2, **When** ele toca em "Voltar", **Then** retorna para a Etapa 1 com todos os dados já preenchidos anteriormente preservados nos campos.
5. **Given** o usuário preenche e-mails diferentes nos campos "E-mail" e "Confirmar e-mail" (ou senhas não coincidentes), **When** ele toca em "Próximo", **Then** um erro inline informa a não-correspondência antes de avançar.
6. **Given** o usuário preenche todos os campos da Etapa 2 corretamente, **When** ele toca em "Criar conta", **Then** o botão exibe estado de carregamento e, após sucesso (mockado), o usuário é automaticamente autenticado e redirecionado para a vitrine de pescados — sem precisar fazer login manualmente.
7. **Given** o usuário está na Etapa 1 do registro, **When** ele toca em "Já tenho conta? Entrar", **Then** navega para a tela de login e o formulário de registro é completamente limpo, de modo que ao retornar ao cadastro ambas as etapas estão com campos vazios e sem erros residuais.

---

### User Story 3 — Experiência Visual Viva com Identidade Praiana (Priority: P3)

Tanto a tela de login quanto a de registro transmitem a identidade do Maré de Manguinhos através de elementos decorativos inspirados no oceano (ondas, gradientes, ilustrações de praia), não sendo telas planas. O scroll funciona suavemente em ambas as telas, garantindo que nenhum campo fique inacessível em dispositivos compactos.

**Why this priority**: A identidade visual e a experiência de rolagem são necessárias para a aceitação do produto pela comunidade local e para transmitir confiança. São validáveis independentemente da funcionalidade.

**Independent Test**: As duas telas podem ser avaliadas visualmente: verificar elementos decorativos presentes (ondas, gradiente, ilustração); rolar até o final de cada tela em um dispositivo com tela de 320px e confirmar que todos os campos ficam visíveis — sem interação funcional.

**Acceptance Scenarios**:

1. **Given** qualquer uma das telas de auth é aberta, **When** inspecionada visualmente, **Then** todas as cores utilizadas pertencem à paleta praiana definida nesta spec e pelo menos um elemento decorativo inspirado no oceano/praia é visível.
2. **Given** a tela de login, **When** renderizada, **Then** o logotipo/ícone do app é exibido de forma proeminente no topo dentro de uma área de cabeçalho com gradiente ou onda decorativa.
3. **Given** qualquer tela de auth em dispositivo com tela de 320px, **When** o usuário rola para baixo, **Then** todos os campos e botões ficam acessíveis sem sobreposição de elementos.
4. **Given** as telas são exibidas em dispositivos com temas claro e escuro, **When** o tema do sistema é verificado, **Then** as telas seguem o tema claro por padrão (modo escuro é escopo futuro).

---

### Edge Cases

- O que acontece quando o e-mail informado no cadastro já está associado a uma conta existente? → Um erro inline é exibido abaixo do campo de e-mail com o texto “Este e-mail já está cadastrado” e um link “Fazer login” que redireciona o usuário para a tela de login.
- O que acontece quando o usuário digita um e-mail em formato inválido? → Validação inline imediata ao sair do campo (evento `onBlur`).
- O que acontece quando o campo de senha está visível (toggle de "mostrar senha")? → O campo deve exibir/ocultar o conteúdo sem perder o foco ou apagar o texto.
- O que acontece se o teclado virtual cobrir o campo que o usuário está preenchendo? → A tela deve rolar suavemente para manter o campo ativo visível acima do teclado.
- O que acontece em telas pequenas (ex: 320px de largura)? → O layout deve permanecer funcional e legível em ambas as etapas, sem elementos sobrepostos, com scroll funcional.
- O que acontece quando o usuário toca repetidamente no botão "Entrar" antes do carregamento terminar? → O botão deve ser desabilitado durante o estado de carregamento para evitar chamadas duplicadas.
- O que acontece após 5 tentativas de login com credenciais inválidas? → A tela exibe um aviso destacado de bloqueio temporário e orienta o usuário a usar o link "Esqueci minha senha" para recuperar o acesso. O botão "Entrar" permanece desabilitado até que o usuário interaja com a opção de recuperação ou reinicie o app.
- O que acontece quando o usuário volta da Etapa 2 para a Etapa 1 do registro? → Os dados já preenchidos na Etapa 1 devem ser preservados nos campos; nenhum dado é apagado ao navegar entre etapas.
- O que acontece se o usuário digitar um CEP na Etapa 2? → O campo CEP aplica máscara automática (00000-000); os demais campos de endereço permanecem para preenchimento manual (busca automática de CEP é escopo futuro).
- O que acontece se o usuário tocar em "Próximo" na Etapa 1 sem preencher campos obrigatórios? → A tela não avança; os campos inválidos exibem erros inline e o scroll posiciona o primeiro campo com erro no campo de visão.

---

## Requirements *(mandatory)*

### Functional Requirements

**Tela de Login:**

- **FR-001**: A tela de login DEVE exibir o ícone oficial do aplicativo (`app-icon.png`) no topo, como elemento de identidade da marca.
- **FR-002**: A tela de login DEVE conter um campo de entrada para e-mail e um campo de entrada para senha (com conteúdo oculto por padrão).
- **FR-003**: A tela de login DEVE oferecer um ícone de alternância (toggle) dentro do campo de senha para revelar/ocultar o texto digitado.
- **FR-004**: A tela de login DEVE exibir um botão primário "Entrar" com estado de carregamento visual (spinner/loading indicator) durante o processamento.
- **FR-005**: A tela de login DEVE validar os campos localmente (e-mail não vazio, formato válido; senha não vazia) antes de acionar qualquer ação de autenticação.
- **FR-006**: A tela de login DEVE exibir mensagens de erro inline, posicionadas abaixo de cada campo, quando a validação falhar.
- **FR-007**: A tela de login DEVE conter um link navegável "Ainda não tem conta? Cadastre-se" que redireciona para a tela de registro.
- **FR-008**: A tela de login DEVE conter um link "Esqueci minha senha" que exibe uma mensagem informativa de disponibilidade futura (não funcional no MVP).
- **FR-009**: O botão "Entrar" DEVE ser desabilitado enquanto o estado de carregamento estiver ativo.
- **FR-010**: A tela de login DEVE expor um ponto de integração claro e bem definido para receber as credenciais (e-mail e senha) e repassá-las à camada de autenticação quando esta for integrada.

- **FR-026**: Após 5 tentativas consecutivas de login com credenciais inválidas (contabilizadas no estado local da tela), a tela de login DEVE exibir um aviso destacado de bloqueio temporário e desabilitar o botão "Entrar", orientando o usuário a utilizar o fluxo de recuperação de senha.

**Tela de Registro — Etapa 1 (Dados Básicos):**

- **FR-011**: A tela de registro DEVE exibir a **Etapa 1 de 2** com um indicador de progresso visual (step indicator) no topo, contendo os seguintes campos obrigatórios: Nome completo, E-mail, Confirmar e-mail, Senha, Confirmar senha, Telefone (WhatsApp).
- **FR-012**: A tela de registro DEVE exibir um botão "Próximo" na Etapa 1 que valida todos os campos da etapa antes de avançar; em caso de validação falha, erros inline são exibidos e o usuário permanece na Etapa 1.
- **FR-013**: A tela de registro DEVE validar localmente na Etapa 1: correspondência entre e-mails, correspondência entre senhas, formato de e-mail válido, telefone no formato brasileiro, senha com mínimo de 8 caracteres, nome com mínimo de 3 caracteres.
- **FR-014**: A tela de registro DEVE exibir mensagens de erro inline abaixo de cada campo com problema de validação.
- **FR-019**: Os campos de senha na Etapa 1 DEVEM oferecer toggle de visibilidade individualmente.

**Tela de Registro — Etapa 2 (Endereço):**

- **FR-028**: A tela de registro DEVE exibir a **Etapa 2 de 2** com os seguintes campos de endereço no padrão de apps de delivery: CEP (obrigatório), Logradouro/Rua (obrigatório), Número (obrigatório), Complemento (opcional — ex: Apto, Bloco), Bairro (obrigatório), Cidade (obrigatório), Estado/UF (obrigatório).
- **FR-029**: O campo CEP DEVE aplicar máscara automática no formato `00000-000` conforme o usuário digita.
- **FR-030**: A tela de registro DEVE exibir um botão "Voltar" na Etapa 2 que retorna para a Etapa 1 preservando todos os dados já preenchidos em ambas as etapas.
- **FR-031**: A tela de registro DEVE validar localmente na Etapa 2: CEP com 8 dígitos (sem máscara), logradouro não vazio, número não vazio, bairro não vazio, cidade não vazia, estado não vazio.
- **FR-015**: A tela de registro DEVE exibir um botão primário "Criar conta" **somente na Etapa 2** com estado de carregamento durante o processamento.
- **FR-016**: Ao submeter com sucesso (mockado), o sistema DEVE autenticar o usuário automaticamente e redirecioná-lo para a vitrine de pescados, sem exigir login manual. Uma confirmação visual breve (ex: toast) MAY ser exibida durante a transição.
- **FR-017**: A tela de registro DEVE conter um link "Já tenho conta? Entrar" visível na Etapa 1 que retorna para a tela de login.
- **FR-018**: A tela de registro DEVE expor um ponto de integração claro e bem definido para receber os dados completos das duas etapas (dados básicos + endereço) e repassá-los à camada de cadastro quando esta for integrada.
- **FR-019**: Os campos de senha na Etapa 1 DEVEM oferecer toggle de visibilidade individualmente.
- **FR-027**: Ao navegar da tela de registro para a tela de login (via link "Já tenho conta? Entrar"), o formulário de registro DEVE ser completamente resetado, de modo que ao retornar ao cadastro ambas as etapas estejam com campos vazios e sem erros de validação residuais.

- **FR-024**: Quando o cadastro retornar conflito de e-mail duplicado (mockado), a tela de registro DEVE exibir um erro inline abaixo do campo de e-mail com o texto “Este e-mail já está cadastrado” e um link navegável “Fazer login” que redireciona para a tela de login.

- **FR-025**: Todos os campos de entrada, botões e links das telas de autenticação DEVEM possuir rótulos descritivos legíveis por leitores de tela (ex: VoiceOver, TalkBack), garantindo acessibilidade mínima para o público-alvo que inclui idosos e pessoas com deficiência visual.

**Scroll e Experiência de Rolagem:**

- **FR-032**: Ambas as telas de autenticação DEVEM ser envoltas em `ScrollView` para garantir que todo o conteúdo seja acessível através de rolagem vertical em qualquer dispositivo suportado, inclusive em dispositivos compactos (320px de largura).
- **FR-033**: Quando o teclado virtual estiver ativo, a tela DEVE rolar automaticamente para manter o campo em foco visível acima do teclado; `KeyboardAvoidingView` DEVE ser utilizado em conjunto com o `ScrollView`.

**Identidade Visual Viva:**

- **FR-034**: Ambas as telas DEVEM incluir um elemento decorativo visual de topo inspirado no oceano/praia (ex: onda SVG, gradiente do azul mar ao branco, ou área de cabeçalho com cor sólida da paleta) que ocupa a porção superior da tela e enquadra o logo do aplicativo, tornando a tela não-plana.
- **FR-035**: O formulário em cada tela DEVE ser apresentado dentro de um cartão (card) com sombra suave (`shadow`) e cantos arredondados, criando profundidade visual em relação ao fundo.
- **FR-036**: Elementos interativos (botões, links) DEVEM fornecer feedback visual de pressão (ex: `activeOpacity` ou `Pressable` com estado `pressed`) para transmitir responsividade ao toque.

---

### Paleta de Cores — Maré de Manguinhos

Inspirada no ícone oficial do app: oceano profundo, ondas em teal, areia dourada e sol laranja.

| Token | Nome | Hex | Uso |
|-------|------|-----|-----|
| `color-primary` | Azul Mar | `#1A5F7A` | Botões primários, links, ícones ativos |
| `color-primary-dark` | Azul Profundo | `#0D3D52` | Pressionar botão, headers |
| `color-secondary` | Azul Oceano | `#2E86AB` | Bordas de foco, elementos secundários |
| `color-accent` | Laranja Solar | `#F2A23A` | Destaques, CTAs alternativos, badges |
| `color-accent-light` | Dourado Areia | `#F5C97A` | Ícones decorativos, hovers suaves |
| `color-background` | Areia Clara | `#FDF6EC` | Fundo das telas |
| `color-surface` | Espuma | `#FAFCFD` | Cards, inputs, modais |
| `color-border` | Pedra Mar | `#B8D4DC` | Bordas de input, divisores |
| `color-text-primary` | Azul Ardósia | `#1C3A47` | Texto principal |
| `color-text-secondary` | Cinza Marinha | `#5A7A87` | Labels, placeholders, textos auxiliares |
| `color-error` | Coral | `#E05A5A` | Mensagens de erro, validação |
| `color-success` | Verde Mangue | `#3A9E6A` | Confirmações, sucesso |

---

### Key Entities *(include if feature involves data)*

- **Usuário (Consumer)**: Representa o comprador de pescado. Atributos relevantes para cadastro: `id`, `nome`, `email`, `telefone`, `senha` (nunca armazenada em plain text), `criadoEm`.
- **Endereço**: Representa os dados de endereço do usuário coletados na Etapa 2 do cadastro: `cep`, `logradouro`, `numero`, `complemento?`, `bairro`, `cidade`, `estado`.
- **BasicFormState**: Estado local da Etapa 1 do formulário de registro (valores dos campos de dados básicos, erros de validação, etapa atual).
- **AddressFormState**: Estado local da Etapa 2 do formulário de registro (valores dos campos de endereço, erros de validação).
- **AuthCredentials**: Estrutura de dados enviada ao submeter login `{ email: string, password: string }`.
- **RegisterPayload**: Estrutura de dados enviada ao submeter registro `{ nome, email, telefone, senha, endereco: { cep, logradouro, numero, complemento?, bairro, cidade, estado } }`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo usuário consegue identificar visualmente a tela de login como pertencente ao Maré de Manguinhos (ícone, paleta e nome do app visíveis) em até 3 segundos após abrir o app.
- **SC-002**: Um usuário preenche e submete o formulário de login em menos de 60 segundos em sua primeira interação com a tela.
- **SC-003**: Um novo usuário completa o preenchimento de todos os campos do cadastro em menos de 3 minutos.
- **SC-004**: 100% dos campos obrigatórios exibem mensagem de validação visível antes de qualquer chamada de serviço quando submetidos em branco.
- **SC-005**: O botão de envio permanece desabilitado durante toda a duração de um estado de carregamento ativo, sem exceção.
- **SC-006**: A tela de login e a tela de registro renderizam corretamente (sem overflow ou sobreposição de elementos) em dispositivos com telas entre 320px e 430px de largura.
- **SC-007**: Ao tocar em "Criar conta" com todos os campos válidos, uma confirmação visual de sucesso é exibida ao usuário em até 500ms após o mock responder.
- **SC-008**: A navegação entre tela de login e tela de registro (em ambas as direções) ocorre sem erros de tela em branco ou resets indesejados de estado.
- **SC-011**: Ao retornar da Etapa 2 para a Etapa 1 do registro via botão "Voltar", 100% dos dados preenchidos na Etapa 1 são preservados nos campos exatamente como foram digitados.
- **SC-012**: Em um dispositivo com tela de 320px de largura, o usuário consegue rolar e acessar todos os campos e botões de ambas as telas sem que nenhum elemento fique cortado ou inacessível.
- **SC-013**: Ambas as telas possuem pelo menos um elemento decorativo visual (onda, gradiente ou cabeçalho colorido) e um card de formulário com sombra visível, distinguindo as telas de uma tela completamente plana.

---

## Clarifications

### Session 2026-05-10

- Q: Após um registro bem-sucedido, para onde o app navega? → A: Direto para a vitrine — o cadastro autentica o usuário automaticamente, sem exigir login manual.
- Q: O que o app exibe quando o e-mail informado no cadastro já está em uso? → A: Erro inline no campo de e-mail com texto "Este e-mail já está cadastrado" + link "Fazer login" redirecionando para a tela de login.
- Q: O app deve oferecer suporte mínimo de acessibilidade nas telas de autenticação? → A: Sim — labels descritivos em todos os campos e botões para suporte a leitores de tela (VoiceOver/TalkBack), com contraste WCAG AA garantido pela paleta.
- Q: Após quantas tentativas de login com credenciais inválidas o app deve alertar diferenciadamente? → A: 5 tentativas — exibe aviso de bloqueio temporário com orientação para "Esqueci minha senha"; botão "Entrar" desabilitado até interação com recuperação.
- Q: O estado do formulário de registro é preservado ao navegar para o login e voltar? → A: Não — o formulário é limpo ao sair; ao retornar ao cadastro todos os campos estão vazios.

- **SC-009**: Todos os campos de entrada, botões e links das telas de autenticação possuem rótulos descritivos compatíveis com leitores de tela (VoiceOver e TalkBack), verificável por inspeção de acessibilidade.
- **SC-010**: As cores da paleta praiana garantem contraste mínimo WCAG AA (4,5:1 para texto normal) entre texto e fundo em todos os estados dos componentes.

---

- A autenticação final será baseada em e-mail e senha (sem login social no MVP), conforme definido no PRD (seção 7 — fora do MVP: login social).
- O campo "Telefone" usará o WhatsApp como canal de comunicação, o que justifica sua obrigatoriedade no cadastro (o backend do sistema usa WhatsApp como canal de notificação para os pescadores; o frontend deve estar alinhado).
- O campo "Bairro/Localidade" é opcional no cadastro e serve para personalização futura da vitrine; o usuário poderá preenchê-lo depois no perfil.
- O cadastro é dividido em duas etapas: Etapa 1 (Dados Básicos) e Etapa 2 (Endereço), seguindo o padrão de apps de delivery brasileiros. Todos os campos de endereço são obrigatórios exceto Complemento.
- A busca automática de CEP (via API ViaCEP ou similar) é escopo futuro; no MVP o usuário preenche manualmente todos os campos após digitar o CEP (com máscara automática no formato `00000-000`).
- Não há integração real com API nesta fase — as ações `onLoginSubmit` e `onRegisterSubmit` serão simuladas com mocks/delays para validar a experiência de carregamento e erro.
- O estado de autenticação persistido (ex: token JWT) será gerenciado por um store Zustand (`useAuthStore`) já preparado para receber os dados quando a API for integrada.
- O público-alvo inclui usuários idosos (35–65 anos conforme PRD), justificando o suporte mínimo a leitores de tela como requisito do MVP.
- O modo escuro não é contemplado nesta feature; as telas seguem o tema claro da paleta praiana definida.
- O app já possui a estrutura de navegação configurada (`AuthNavigator.tsx`, `RootNavigator.tsx`) — esta feature implementa as telas dentro desses navigators existentes.
- A validação de força de senha (barra de progresso) não é requisito do MVP; o mínimo de 8 caracteres é suficiente para esta fase.
- O telefone deve aceitar formatos brasileiros com DDD (ex: `(27) 99999-9999`), com máscara de input aplicada na UI.
