# Feature Specification: Menu de Navegação Inferior (Bottom Tabs)

**Feature Branch**: `002-bottom-nav-menu`
**Created**: 22/05/2026
**Status**: Draft
**Input**: User description: "Criar menu de navegação do app, moderno, estilo parte inferior da tela, seguindo as cores do app, com navegação para telas limpas como base para o time."

## User Scenarios & Testing

### User Story 1 - Navegar entre abas principais (Priority: P1)

Um usuário autenticado acessa o app e vê um menu inferior com quatro abas. Ele toca em cada aba para navegar entre as seções do aplicativo, vendo o conteúdo de cada tela correspondente.

**Why this priority**: A navegação é a estrutura fundamental do app — sem ela, nenhuma outra funcionalidade pode ser acessada. É a base sobre a qual todo o restante será construído.

**Independent Test**: Pode ser totalmente testada abrindo o app autenticado e tocando em cada aba do menu inferior, confirmando que a tela correspondente é exibida.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado e vê o menu inferior, **When** ele toca na aba "Vitrine", **Then** a tela inicial da Vitrine é exibida e a aba fica visualmente destacada
2. **Given** que o usuário está na aba Vitrine, **When** ele toca na aba "Carrinho", **Then** a tela do Carrinho é exibida com a respectiva aba destacada
3. **Given** que o usuário está na aba Carrinho, **When** ele toca na aba "Pedidos", **Then** a tela de Histórico de Pedidos é exibida
4. **Given** que o usuário está na aba Pedidos, **When** ele toca na aba "Perfil", **Then** a tela de Perfil é exibida

---

### User Story 2 - Navegação em pilha dentro de uma aba (Priority: P2)

Dentro da aba Vitrine, o usuário navega da listagem de produtos para os detalhes de um produto específico. Dentro da aba Pedidos, navega do histórico para o acompanhamento de um pedido.

**Why this priority**: As telas de detalhe são essenciais para o fluxo principal do app, mas dependem da navegação básica funcionando primeiro.

**Independent Test**: Pode ser testada navegando entre duas telas dentro da mesma aba (Vitrine → Produto e Pedidos → Acompanhamento).

**Acceptance Scenarios**:

1. **Given** que o usuário está na VitrineScreen, **When** ele navega para o detalhe de um produto, **Then** a ProdutoScreen é exibida com um botão de voltar para a VitrineScreen
2. **Given** que o usuário está na ProdutoScreen, **When** ele toca no botão voltar, **Then** ele retorna à VitrineScreen
3. **Given** que o usuário está no Histórico de Pedidos, **When** ele navega para ver detalhes de um pedido, **Then** a AcompanhamentoScreen é exibida com opção de voltar

---

### User Story 3 - Indicador visual da aba ativa (Priority: P2)

O menu inferior mostra claramente qual aba está ativa no momento, com destaque visual (cor diferente, ícone preenchido) para que o usuário sempre saiba onde está.

**Why this priority**: A usabilidade da navegação depende do feedback visual claro. Sem isso, o usuário pode se sentir perdido no app.

**Independent Test**: Pode ser testada visualmente — ao tocar em cada aba, o ícone e texto da aba ativa devem estar destacados em relação às demais.

**Acceptance Scenarios**:

1. **Given** que o usuário está na aba Vitrine, **Then** o ícone e rótulo "Vitrine" estão destacados na cor primária do app
2. **Given** que o usuário toca em outra aba, **Then** a aba anteriormente ativa volta ao estilo padrão (não destacado) e a nova aba fica destacada

---

### Edge Cases

- O que acontece quando o usuário toca repetidamente na mesma aba? A tela não deve ser recriada — apenas permanecer no estado atual.
- Como o menu se comporta em diferentes tamanhos de tela? O menu deve ocupar a largura total e se ajustar proporcionalmente.
- O que acontece se o nome de uma aba for muito longo? Os rótulos devem ser truncados com "..." ou usar nomes curtos.
- Como o menu se comporta quando o teclado está aberto? Em plataforma mobile, o menu deve permanecer visível ou ser ocultado conforme padrão da plataforma.

## Requirements

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um menu de navegação fixo na parte inferior da tela com quatro abas: Vitrine, Carrinho, Pedidos e Perfil
- **FR-002**: Cada aba DEVE exibir um ícone e um rótulo textual curto
- **FR-003**: A aba ativa DEVE ser visualmente destacada com a cor primária do app
- **FR-004**: As abas inativas DEVEM usar a cor neutra/cinzenta padrão
- **FR-005**: O menu inferior DEVE permanecer visível em todas as telas do app principal
- **FR-006**: A navegação entre abas DEVE ser instantânea, sem recarregamento desnecessário
- **FR-007**: A aba Vitrine DEVE conter uma pilha de navegação (stack) com VitrineScreen e ProdutoScreen
- **FR-008**: A aba Carrinho DEVE conter apenas a CarrinhoScreen
- **FR-009**: A aba Pedidos DEVE conter uma pilha de navegação (stack) com HistoricoScreen e AcompanhamentoScreen
- **FR-010**: A aba Perfil DEVE conter apenas a PerfilScreen
- **FR-011**: Telas dentro de uma pilha DEVEM exibir um botão de voltar no cabeçalho
- **FR-012**: Cada tela DEVE exibir um título placeholder e o nome da tela como conteúdo mínimo identificável

### Key Entities

- **Tab**: Cada item do menu inferior representa uma seção principal do app (Vitrine, Carrinho, Pedidos, Perfil). Possui nome, ícone e tela(s) associada(s).
- **Stack Navigator**: Agrupamento de telas em sequência (pilha) dentro de uma aba, permitindo navegação para frente e para trás. A aba Vitrine e a aba Pedidos possuem stacks.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um usuário consegue navegar por todas as 4 abas em menos de 10 segundos na primeira tentativa
- **SC-002**: A troca entre abas é percebida como instantânea pelo usuário (sem delay visível)
- **SC-003**: 100% das telas definidas na arquitetura (VitrineScreen, ProdutoScreen, CarrinhoScreen, HistoricoScreen, AcompanhamentoScreen, PerfilScreen) são acessíveis via navegação
- **SC-004**: O botão de voltar funciona corretamente em 100% das telas em stack (ProdutoScreen, AcompanhamentoScreen)

## Assumptions

- O app já possui as dependências `@react-navigation/native`, `@react-navigation/bottom-tabs` e `@react-navigation/native-stack` instaladas
- O esquema de cores do app está definido (primário: azul oceano/turquesa, neutro: cinza claro)
- As telas podem ser criadas como componentes placeholder (exibindo apenas o nome da tela) para servirem de base
- O menu inferior deve seguir o padrão iOS (ícone + texto abaixo) como padrão visual
- Os ícones das abas utilizarão uma biblioteca de ícones já presente no projeto (ex: @expo/vector-icons)
- O usuário alvo do MVP são consumidores de pescado da região de Manguinhos com smartphones Android/iOS
