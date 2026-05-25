# Feature Specification: CarrinhoScreen — Carrinho de Compras

**Feature Branch**: `007-carrinho-screen`  
**Created**: 2026-05-24  
**Status**: Draft  
**Input**: User description: "Quero a espeficicação para implementar a CarrinhoScreen do aplicativo. Você deve seguir estritamente o modelo de dados e consulta de endpoints propostos para esta tela disponível em docs."

---

## Clarifications

### Session 2026-05-24

- Q: Como lidar com itens duplicados no carrinho (mesmo produto + mesmo corte)? → A: Opção B — mesmo produto com mesmo corte funde o peso (incrementa); cortes diferentes geram entradas separadas. A remoção usa o par (produtoId, corte) como chave única.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visualizar Itens do Carrinho e Ir ao Checkout (Priority: P1)

O usuário acessa a CarrinhoScreen através da aba "Carrinho" no bottom tab do app. A tela exibe todos os itens que foram adicionados anteriormente via ProdutoScreen. Cada item mostra foto do produto, nome da espécie, corte selecionado, peso e valor calculado (preçoPorKg × pesoKg). No rodapé fixo, o subtotal geral é exibido junto com o botão "Ir para Checkout". Se o carrinho estiver vazio, uma mensagem indicativa com ilustração e botão para voltar à VitrineScreen é exibida.

**Why this priority**: Este é o fluxo principal da tela. Sem ela o usuário não consegue revisar os itens antes de finalizar a compra — o app de delivery não cumpre seu propósito.

**Independent Test**: Pode ser testada com dados mockados inseridos manualmente no carrinhoStore — a tela carrega os itens, exibe corretamente cada card com foto/nome/corte/peso/valor, calcula o subtotal e disponibiliza o botão "Ir para Checkout".

**Acceptance Scenarios**:

1. **Given** o carrinho possui itens adicionados **When** o usuário navega para a aba Carrinho **Then** a tela exibe a lista de itens, cada um com: foto do produto (thumbnail 64x64), nome da espécie, corte selecionado, peso (ex: "1,5 kg"), valor do item formatado (ex: "R$ 67,50") e um botão de remover (ícone de lixeira ou "X").
2. **Given** a lista de itens é exibida **When** o usuário faz scroll **Then** o rodapé fixo permanece visível na parte inferior, contendo o subtotal (ex: "Subtotal: R$ 135,00") e o botão "Ir para Checkout".
3. **Given** o usuário está na CarrinhoScreen com itens **When** ele toca em "Ir para Checkout" **Then** o sistema navega para a CheckoutScreen (stack de checkout).
4. **Given** o carrinho está vazio **When** a tela carrega **Then** uma mensagem "Seu carrinho está vazio" é exibida com uma ilustração ou ícone representativo e um botão "Ver produtos" que navega de volta à VitrineScreen.

---

### User Story 2 — Remover Item do Carrinho (Priority: P1)

O usuário pode remover um item indesejado do carrinho tocando no botão de remover (ícone de lixeira ou "X") no card do item. O item é removido instantaneamente, o subtotal é recalculado e a lista é atualizada. Se o último item for removido, a tela transita para o estado de carrinho vazio.

**Why this priority**: Remover itens é a segunda ação mais importante após visualizar — sem ela o usuário fica preso a itens que não deseja mais.

**Independent Test**: Pode ser testada com 2+ itens no carrinho — ao remover um item, o subtotal diminui e o item desaparece da lista; ao remover o último item, o estado de carrinho vazio é exibido.

**Acceptance Scenarios**:

1. **Given** o carrinho tem 3 itens com subtotal de R$ 200,00 **When** o usuário toca no botão de remover de um dos itens **Then** o item é removido da lista, o subtotal é recalculado (R$ 200,00 - valor do item removido), e a lista agora mostra 2 itens.
2. **Given** o carrinho tem 1 item **When** o usuário toca em remover **Then** o item é removido e a tela transita para o estado de carrinho vazio com mensagem e botão "Ver produtos".
3. **Given** o usuário está removendo itens **When** ele remove um item **Then** um feedback visual sutil (ex: o item desliza para fora ou fade out) é exibido antes da remoção completa.

---

### User Story 3 — Carrinho Vazio com Navegação para Vitrine (Priority: P2)

Quando o carrinho está vazio (seja ao abrir o app pela primeira vez ou após remover todos os itens), a tela exibe um estado amigável de carrinho vazio com uma ilustração ou ícone, texto "Seu carrinho está vazio" e um botão "Ver produtos" que redireciona para a VitrineScreen.

**Why this priority**: Melhora a experiência do usuário ao evitar uma tela em branco/confusa quando não há itens no carrinho.

**Independent Test**: Pode ser testada zerando o carrinhoStore (limpar) — a tela exibe o estado vazio corretamente e o botão "Ver produtos" navega para a VitrineScreen.

**Acceptance Scenarios**:

1. **Given** o carrinho está vazio **When** a CarrinhoScreen é aberta **Then** o ícone/ilustração de carrinho vazio, o texto "Seu carrinho está vazio" e o botão "Ver produtos" são exibidos.
2. **Given** a tela de carrinho vazio está sendo exibida **When** o usuário toca em "Ver produtos" **Then** o sistema navega para a aba Vitrine no bottom tabs.
3. **Given** o usuário removeu todos os itens **When** a tela transita para o estado vazio **Then** o botão "Ir para Checkout" e o subtotal não são mais exibidos.

---

### Edge Cases

- O que acontece quando o item removido é o único item do carrinho? → A lista some e o estado de carrinho vazio é exibido com ilustração e botão "Ver produtos".
- O que acontece quando o usuário tenta remover rapidamente vários itens em sucessão? → Cada remoção é processada individualmente — o carrinhoStore garante consistência dos dados.
- O que acontece se o carrinho tiver itens de múltiplos pescadores? → Todos os itens são listados juntos — a separação por pescador não faz parte do escopo do carrinho MVP.
- O que acontece se o peso de um item no carrinho for 0 ou negativo? → Isso não deve ocorrer porque o controle de peso na ProdutoScreen já impede valores inválidos. O carrinhoStore não precisa validar.
- O que acontece com itens cujo `precoPorKg` mudou desde a adição ao carrinho? → O valor exibido no carrinho reflete o preço no momento da adição — o carrinho armazena o snapshot do preço no ItemCarrinho.
- O que acontece se a foto de um produto falhar ao carregar no card do carrinho? → Uma imagem placeholder (ícone de peixe) é exibida, mantendo as dimensões do layout.
- O que acontece quando o usuário adiciona o mesmo produto com o mesmo corte novamente? → O peso é fundido (incrementado) na entrada existente — não é criada uma nova entrada. O subtotal é recalculado automaticamente.

---

## Requirements *(mandatory)*

### Functional Requirements

**Estrutura e Navegação:**

- **FR-001**: A CarrinhoScreen DEVE ser uma tela de aba (bottom tab) acessível a partir da navegação inferior do AppNavigator.
- **FR-002**: O botão "Ir para Checkout" DEVE navegar para a CheckoutScreen (que fica em outro stack — a navegação exata é delegada ao navegador).
- **FR-003**: O botão "Ver produtos" (estado vazio) DEVE navegar para a aba VitrineScreen.
- **FR-004**: Um badge numérico no ícone da aba Carrinho DEVE exibir a quantidade total de itens no carrinho (consumindo `carrinhoStore.itens.length`).

**Exibição de Itens:**

- **FR-005**: Cada item do carrinho DEVE ser exibido como um card horizontal contendo: thumbnail da foto (64x64px, cantos arredondados), nome da espécie (negrito), corte selecionado (ex: "Filé"), peso formatado (ex: "1,5 kg"), valor do item (preçoPorKg × pesoKg, formatado como moeda), e botão de remover (ícone de lixeira).
- **FR-006**: O valor de cada item DEVE ser calculado como `precoPorKg × pesoKg`, formatado em moeda brasileira (R$ XX,XX).
- **FR-007**: O subtotal DEVE ser a soma dos valores de todos os itens, exibido no rodapé fixo, formatado como moeda brasileira.
- **FR-008**: A lista de itens DEVE ser scrollável verticalmente quando exceder a altura da tela.
- **FR-009**: O rodapé fixo DEVE conter o subtotal (alinhado à esquerda) e o botão "Ir para Checkout" (alinhado à direita ou largura total).

**Remoção de Itens:**

- **FR-010**: O botão de remover em cada card DEVE chamar `carrinhoStore.removerItem(produtoId, corte)` — a chave de remoção é o par (produtoId, corte) para distinguir entradas do mesmo produto com cortes diferentes.
- **FR-011**: Ao remover um item, um feedback visual sutil DEVE ser exibido (ex: animação de fade out ou deslize lateral) indicando a remoção.
- **FR-012**: O subtotal DEVE ser recalculado automaticamente após qualquer remoção.

**Estado de Carrinho Vazio:**

- **FR-013**: Quando `carrinhoStore.itens` estiver vazio, a tela DEVE exibir: ilustração/ícone grande de carrinho vazio (centralizado), texto "Seu carrinho está vazio" e botão "Ver produtos" que navega para a VitrineScreen.
- **FR-014**: Quando o carrinho estiver vazio, o rodapé fixo com subtotal e botão "Ir para Checkout" NÃO DEVE ser exibido.

**Dados (Carrinho Local via Zustand):**

- **FR-015**: A CarrinhoScreen NÃO DEVE fazer chamadas de API — ela consome exclusivamente o estado local do `carrinhoStore` (Zustand).
- **FR-016**: O `carrinhoStore` DEVE expor `itens` (ItemCarrinho[]), `adicionarItem(produto, corte, pesoKg)` (que funde peso se já existir entrada com mesmo produtoId + corte, ou cria nova entrada), `removerItem(produtoId: string, corte: Corte)`, `limpar()`, e um getter computado `total()` que retorna a soma dos valores.
- **FR-017**: Enquanto o backend não estiver disponível, os dados mockados DEVEM ser inseridos diretamente no `carrinhoStore` via um helper de mock ou dados iniciais — a tela consome o store da mesma forma que consumiria dados reais.
- **FR-018**: A troca de mock para dados reais NÃO DEVE exigir alterações na CarrinhoScreen, apenas no código que alimenta o carrinhoStore (originado da ProdutoScreen).

**Padrões Visuais e Acessibilidade:**

- **FR-019**: A CarrinhoScreen DEVE utilizar a paleta de cores do Maré de Manguinhos: fundo #FDF6EC (Areia Clara), cards #FAFCFD (Espuma), botões primários #1A5F7A (Azul Mar), texto valor/destaque #F2A23A (Laranja Solar).
- **FR-020**: Cards de itens DEVEM ter cantos arredondados (borderRadius 12-16px), sombra sutil (elevação 2-3) e padding interno de 12px.
- **FR-021**: O rodapé fixo DEVE ter fundo branco sólido (#FFFFFF) com sombra superior (elevação 4-6) para destacar da lista scrollável.
- **FR-022**: O botão "Ir para Checkout" DEVE ter altura mínima de 52px, cantos arredondados (borderRadius 12px), cor de fundo Azul Mar (#1A5F7A) e texto branco em negrito.
- **FR-023**: A tela DEVE priorizar acessibilidade: fonte mínima de 14px, targets de toque mínimos de 44x44px em todos os elementos interativos (botão remover, botão checkout, botão ver produtos).
- **FR-024**: Todos os elementos interativos DEVEM possuir rótulos acessíveis (accessibilityLabel).
- **FR-025**: A tela DEVE ser responsiva em dispositivos com largura entre 320px e 430px, sem scroll horizontal ou elementos cortados.

---

### Key Entities

- **ItemCarrinho**: Estrutura de dado que representa uma entrada no carrinho: `{ produto: Produto, corte: Corte, pesoKg: number }`. O `produto` armazena um snapshot completo incluindo `precoPorKg` no momento da adição. A chave única da entrada é o par (produtoId, corte) — se o mesmo produto for adicionado com o mesmo corte, o peso é fundido (incrementado) em vez de criar nova entrada.
- **CarrinhoStore**: Estado global gerenciado pelo Zustand que mantém a lista de `itens` (ItemCarrinho[]) e expõe as ações `adicionarItem`, `removerItem`, `limpar` e o getter computado `total`.
- **Corte**: Tipo literal `"inteiro" | "limpo" | "file"` que representa o corte selecionado para o pescado.
- **Subtotal**: Valor calculado como soma de `item.produto.precoPorKg × item.pesoKg` para todos os itens do carrinho.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar todos os itens do carrinho com foto, nome, corte, peso e valor em menos de 1 segundo após abrir a aba — (dados locais, sem latência de rede).
- **SC-002**: O usuário consegue remover um item do carrinho em no máximo 2 toques, e o subtotal é recalculado instantaneamente (menos de 100ms).
- **SC-003**: O estado de carrinho vazio (ilustração, texto e botão) é exibido corretamente sempre que `itens.length === 0`.
- **SC-004**: O badge na aba Carrinho reflete a quantidade exata de itens em todas as telas do app, atualizando em menos de 100ms após qualquer adição ou remoção.
- **SC-005**: Tocar em "Ir para Checkout" navega para a CheckoutScreen em 100% dos casos sem perda de dados do carrinho.
- **SC-006**: Tocar em "Ver produtos" (estado vazio) navega para a VitrineScreen em 100% dos casos.
- **SC-007**: Targets de toque (botões, ícones de remover) possuem no mínimo 44x44px, verificável por inspeção visual.
- **SC-008**: A tela é completamente funcional em dispositivos com largura entre 320px e 430px, sem scroll horizontal indesejado ou elementos cortados.
- **SC-009**: Nenhuma chamada de API é feita pela CarrinhoScreen — 100% dos dados vêm do Zustand store local.
- **SC-010**: A troca de dados mockados para dados reais não requer nenhuma alteração na CarrinhoScreen (apenas no código de origem, ProdutoScreen ou helpers de mock).

---

## Assumptions

- A CarrinhoScreen é uma aba do bottom tab navigator — não recebe parâmetros de rota e não faz parte de uma stack navigation própria.
- O carrinho é gerenciado localmente via Zustand (`carrinhoStore`), conforme estabelecido na arquitetura do app (arquivo `store/carrinhoStore.ts`).
- Os itens são adicionados ao carrinho exclusivamente através da ProdutoScreen, que chama `carrinhoStore.adicionarItem()`.
- O valor do item no carrinho usa o `precoPorKg` do snapshot do produto no momento da adição — não reflete alterações futuras de preço no backend.
- A CheckoutScreen é uma tela separada (fora do escopo desta especificação) — o botão "Ir para Checkout" apenas navega para ela.
- O badge na aba Carrinho é gerenciado pelo componente de bottom tab (navegação), lendo `carrinhoStore.itens.length`.
- A paleta de cores, fontes e tokens de design seguem o estabelecido nas especificações anteriores (spec 001 — Auth Screens).
- O público-alvo inclui usuários com pouca familiaridade tecnológica, justificando fonte mínima de 14px, targets de toque generosos e labels descritivos.
- Nenhuma funcionalidade de edição de item (alterar corte ou peso) está no escopo — o usuário deve remover e readicionar se quiser alterar.
- A chave única de cada entrada no carrinho é o par (produtoId, corte) — adicionar o mesmo produto com o mesmo corte funde o peso na entrada existente.
