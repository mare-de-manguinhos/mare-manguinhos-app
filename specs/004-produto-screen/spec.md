# Feature Specification: ProdutoScreen — Detalhes do Produto

**Feature Branch**: `004-produto-screen`  
**Created**: 2026-05-24  
**Status**: Draft  
**Input**: User description: "Quero a espeficicação para implementar a ProdutoScreen do aplicativo. Você deve seguir estritamente o modelo de dados e consulta de endpoints propostos para esta tela disponível em docs."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visualizar Detalhes e Adicionar ao Carrinho (Priority: P1)

O usuário chega à ProdutoScreen ao tocar em um card de produto na VitrineScreen. A tela carrega os detalhes completos do produto: foto em destaque, nome da espécie, informações do pescador, descrição, preço por kg e peso disponível. O usuário escolhe o corte desejado (inteiro, limpo ou filé) e o peso em kg, então toca em "Adicionar ao Carrinho" para incluir o item na sacola.

**Why this priority**: Este é o fluxo principal de compra. Sem essa tela, o usuário não consegue selecionar variantes de corte/peso nem adicionar produtos ao carrinho — o app não cumpre sua função de delivery.

**Independent Test**: Pode ser testada com um único produto mockado — a tela carrega dados estáticos, permite selecionar corte e peso, e ao tocar "Adicionar ao Carrinho" verifica-se que o item foi inserido no carrinho (Zustand).

**Acceptance Scenarios**:

1. **Given** o usuário tocou em um card de produto na VitrineScreen **When** a ProdutoScreen é aberta **Then** a tela exibe um indicador de carregamento enquanto os dados do produto são obtidos (mockados ou da API).
2. **Given** os dados do produto foram carregados **When** a tela é renderizada **Then** os seguintes elementos são exibidos em ordem vertical: foto do produto em destaque (largura total), nome da espécie, informações do pescador (foto circular + nome), descrição do produto, preço por kg, peso disponível, seletor de corte, seletor de peso, e botão "Adicionar ao Carrinho".
3. **Given** o usuário visualiza o produto **When** ele toca no botão de voltar (seta no topo) **Then** ele retorna à VitrineScreen.
4. **Given** o usuário selecionou corte e peso **When** ele toca em "Adicionar ao Carrinho" **Then** o item é adicionado ao Zustand `carrinhoStore`, um feedback visual de confirmação é exibido (ex: toast ou badge animado), e o usuário permanece na ProdutoScreen.

---

### User Story 2 — Selecionar Corte do Pescado (Priority: P1)

O usuário escolhe entre os cortes disponíveis para o produto: inteiro, limpo ou filé. Cada corte é apresentado como uma opção visual (chip/botão), e o corte selecionado fica destacado. Apenas um corte pode ser selecionado por vez.

**Why this priority**: O corte é uma escolha obrigatória para adicionar ao carrinho — sem ela o usuário não consegue prosseguir.

**Independent Test**: Pode ser testada com dados mockados de `cortesDisponiveis` = `["inteiro", "limpo", "file"]` — o usuário toca em cada opção e verifica que a seleção alterna corretamente.

**Acceptance Scenarios**:

1. **Given** o produto tem cortes disponíveis `["inteiro", "limpo", "file"]` **When** a tela carrega **Then** os três cortes são exibidos como chips selecionáveis, e o primeiro corte da lista vem pré-selecionado.
2. **Given** um corte está selecionado (ex: "limpo") **When** o usuário toca em outro corte (ex: "inteiro") **Then** a seleção muda para o novo corte e o anterior perde o destaque visual.
3. **Given** o usuário não selecionou nenhum corte manualmente **When** ele tenta adicionar ao carrinho **Then** o corte pré-selecionado (primeiro da lista) é usado.

---

### User Story 3 — Escolher Peso Desejado (Priority: P1)

O usuário informa o peso desejado em kg através de um controle de incremento/decremento ou campo numérico. O peso deve ser maior que zero e não pode exceder o `pesoDisponivel` do produto. O valor total é calculado e exibido dinamicamente (preçoPorKg × pesoKg).

**Why this priority**: O peso define o valor do item no carrinho — sem ele não é possível calcular o custo.

**Independent Test**: Pode ser testada com dados mockados (ex: precoPorKg = R$ 45,00, pesoDisponivel = 12.5kg) — o usuário ajusta o peso e verifica o valor total atualizado em tempo real.

**Acceptance Scenarios**:

1. **Given** o peso disponível é 12.5kg **When** a tela carrega **Then** o peso inicial é 0.5kg (valor padrão sugerido) e o valor total exibido é `precoPorKg × 0.5`.
2. **Given** o peso atual é 1kg **When** o usuário toca no botão "+" **Then** o peso aumenta em 0.5kg (para 1.5kg) e o valor total é recalculado instantaneamente.
3. **Given** o peso atual é 1kg **When** o usuário toca no botão "−" **Then** o peso diminui em 0.5kg (para 0.5kg) e o valor total é recalculado.
4. **Given** o peso atual é 0.5kg **When** o usuário toca no botão "−" **Then** o peso não pode ser reduzido abaixo de 0.5kg (botão desabilitado ou limitado).
5. **Given** o peso atual é 12kg **When** o usuário toca no botão "+" **Then** o peso aumenta para 12.5kg (peso máximo) e não pode ultrapassar `pesoDisponivel` (botão "+" desabilitado ao atingir o limite).
6. **Given** o usuário altera o peso **When** o valor muda **Then** o valor total exibido (preçoPorKg × pesoKg) é atualizado em tempo real, formatado como moeda (ex: "R$ 67,50").

---

### Edge Cases

- O que acontece quando a requisição do produto falha (erro de rede ou ID inválido)? → Uma mensagem de erro amigável "Não foi possível carregar os detalhes do produto" com botão "Tentar novamente" é exibida.
- O que acontece quando a foto do produto falha ao carregar? → Uma imagem placeholder (ícone de peixe) é exibida no lugar, mantendo o layout intacto.
- O que acontece quando o produto não tem cortes disponíveis (cortesDisponiveis vazio)? → O seletor de corte é ocultado e o sistema assume "inteiro" como padrão.
- O que acontece quando o `pesoDisponivel` é 0 (produto esgotado)? → O botão "Adicionar ao Carrinho" fica desabilitado com o texto "Indisponível" e uma mensagem visual "Produto esgotado no momento" é exibida.
- O que acontece se o usuário navegar diretamente para a tela com um ID inválido/nulo? → A tela exibe erro e botão "Voltar" para retornar à VitrineScreen.
- O que acontece quando o carrinho já contém o mesmo produto com mesmo corte? → O item é adicionado como um novo entry no carrinho (permitindo múltiplas entradas do mesmo produto/corte com pesos diferentes).
- O que acontece se o usuário sair da tela antes do carregamento completo? → A requisição é cancelada (abort controller) para evitar memory leaks e atualizações de estado em componente desmontado.

---

## Requirements *(mandatory)*

### Functional Requirements

**Estrutura e Navegação:**

- **FR-001**: A ProdutoScreen DEVE ser acessada via navegação por stack a partir da VitrineScreen, recebendo o `id` do produto como parâmetro de rota.
- **FR-002**: A ProdutoScreen DEVE exibir um botão de voltar (seta) no topo esquerdo que retorna à VitrineScreen.
- **FR-003**: Durante o carregamento dos dados do produto, a tela DEVE exibir um indicador visual de carregamento (skeleton loader ou spinner).

**Exibição de Dados:**

- **FR-004**: A tela DEVE exibir a foto do produto em largura total no topo, com altura proporcional (~300px) e cantos inferiores arredondados.
- **FR-005**: Abaixo da foto, a tela DEVE exibir: nome da espécie (título grande), informações do pescador (foto circular pequena + nome), descrição do produto, preço por kg formatado como moeda.
- **FR-006**: O peso disponível DEVE ser exibido em formato legível (ex: "12,5 kg disponíveis").
- **FR-007**: A tela DEVE consumir os dados do produto através de um service/hook isolado que chama `GET /api/app/produtos/:id` e utiliza dados mockados enquanto o backend não estiver disponível.

**Seleção de Corte:**

- **FR-008**: Os cortes disponíveis DEVEM ser exibidos como chips/botões selecionáveis lado a lado (horizontal).
- **FR-009**: O primeiro corte da lista DEVE vir pré-selecionado ao carregar a tela.
- **FR-010**: O chip do corte selecionado DEVE ter destaque visual (cor primária de fundo, texto branco); os não selecionados DEVEM ter fundo neutro.
- **FR-011**: Se `cortesDisponiveis` estiver vazio, o seletor de corte DEVE ser ocultado e "inteiro" é assumido como padrão.

**Seleção de Peso:**

- **FR-012**: O controle de peso DEVE permitir incremento e decremento em passos de 0.5kg, com valor mínimo de 0.5kg e valor máximo igual a `pesoDisponivel`.
- **FR-013**: O peso atual DEVE ser exibido em formato numérico com uma casa decimal (ex: "1,5 kg").
- **FR-014**: O valor total do item (preçoPorKg × pesoKg) DEVE ser calculado e exibido em tempo real, formatado como moeda brasileira (R$).
- **FR-015**: Os botões de incremento/decremento DEVEM ser desabilitados visualmente quando o limite (mínimo/máximo) for atingido.

**Adição ao Carrinho:**

- **FR-016**: O botão "Adicionar ao Carrinho" DEVE exibir o valor total calculado (ex: "Adicionar — R$ 67,50").
- **FR-017**: Ao tocar em "Adicionar ao Carrinho", o sistema DEVE chamar `carrinhoStore.adicionarItem(produto, corteSelecionado, pesoSelecionado)`.
- **FR-018**: Após adicionar ao carrinho, um feedback visual de sucesso DEVE ser exibido (ex: toast "Adicionado ao carrinho!" com duração de 2 segundos).
- **FR-019**: Se `pesoDisponivel` for 0, o botão "Adicionar ao Carrinho" DEVE ficar desabilitado com o texto "Indisponível".

**Tratamento de Erros:**

- **FR-020**: Em caso de falha na requisição do produto, a tela DEVE exibir mensagem de erro amigável com botão "Tentar novamente".
- **FR-021**: Se a foto do produto falhar ao carregar, uma imagem placeholder DEVE ser exibida (ícone de peixe em fundo neutro, mantendo as dimensões do layout).
- **FR-022**: A requisição de produto DEVE ser cancelada se o usuário sair da tela antes do carregamento (abort controller ou equivalente).

**Dados Mockados:**

- **FR-023**: Enquanto o backend não estiver disponível, a ProdutoScreen DEVE utilizar dados mockados que seguem EXATAMENTE o modelo de dados do endpoint `GET /api/app/produtos/:id`.
- **FR-024**: A troca do mock para a API real DEVE ser feita alterando-se um único arquivo/service, sem modificar a tela ou componentes.

**Padrões Visuais:**

- **FR-025**: A ProdutoScreen DEVE utilizar a paleta de cores do Maré de Manguinhos: fundo #FDF6EC (Areia Clara), cards #FAFCFD (Espuma), botões primários #1A5F7A (Azul Mar), badges #F2A23A (Laranja Solar).
- **FR-026**: Elementos interativos (chips de corte, botões, controle de peso) DEVEM ter cantos arredondados (borderRadius 12-16px) e feedback visual de toque (opacidade/escala).
- **FR-027**: A tela DEVE priorizar acessibilidade: fonte mínima de 14px, targets de toque mínimos de 44x44px.

**Acessibilidade:**

- **FR-028**: Todos os elementos interativos DEVEM possuir rótulos acessíveis (accessibilityLabel).
- **FR-029**: O botão "Adicionar ao Carrinho" DEVE ter altura mínima de 52px para facilitar o toque.

---

### Key Entities

- **Produto**: Entidade única de produto, com `descricao?` opcional. O endpoint `GET /api/app/produtos/:id` retorna o `Produto` completo incluindo `descricao`. O `ProdutoResumo` (usado na vitrine) é um subtipo sem `cortesDisponiveis` e `descricao`.
- **SelecaoCorte**: Estado local do corte atualmente selecionado pelo usuário (tipo `Corte` = `"inteiro" | "limpo" | "file"`).
- **SelecaoPeso**: Estado local do peso em kg atualmente selecionado (tipo `number`, entre 0.5 e `pesoDisponivel`, passo 0.5).
- **ItemCarrinho**: Estrutura criada ao adicionar ao carrinho, composta por `produto`, `corte` e `pesoKg`, conforme já definido na camada de estado (Zustand carrinhoStore).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue visualizar todos os detalhes do produto (foto, nome, pescador, descrição, preço, peso disponível) em menos de 3 segundos após a abertura da tela (com dados mockados, sem latência de rede).
- **SC-002**: O usuário consegue selecionar um corte, ajustar o peso e adicionar ao carrinho em menos de 10 segundos sem necessidade de instruções.
- **SC-003**: O valor total é recalculado e exibido corretamente em menos de 100ms após qualquer alteração de peso.
- **SC-004**: O feedback visual de "Adicionado ao carrinho!" é exibido em 100% das tentativas bem-sucedidas de adição.
- **SC-005**: Tocar no botão de voltar retorna à VitrineScreen em 100% dos casos, sem perda de estado.
- **SC-006**: Targets de toque (botões, chips, controles) possuem no mínimo 44x44px, verificável por inspeção visual.
- **SC-007**: A tela é completamente funcional em dispositivos com largura entre 320px e 430px, sem scroll horizontal indesejado ou elementos cortados.
- **SC-008**: Dados mockados seguem exatamente o esquema do endpoint `GET /api/app/produtos/:id` — nenhuma modificação na tela é necessária ao trocar mock por API real.

---

## Assumptions

- A ProdutoScreen é acessada exclusivamente via navegação a partir da VitrineScreen, recebendo o parâmetro `id` do produto.
- O endpoint `GET /api/app/produtos/:id` retorna um único objeto produto com todos os campos descritos — não há paginação nem sub-recursos.
- O carrinho é gerenciado localmente via Zustand (`carrinhoStore`), conforme estabelecido na arquitetura do app.
- O corte pré-selecionado é sempre o primeiro item do array `cortesDisponiveis`.
- O passo padrão de peso é 0.5kg com mínimo de 0.5kg — valores razoáveis para venda de pescado por kg.
- A troca de mock para API real será feita substituindo o conteúdo do service/hook — a tela e componentes permanecem inalterados.
- A paleta de cores, fontes e tokens de design seguem o que foi estabelecido na especificação de Auth Screens (spec 001).
- O público-alvo inclui usuários com pouca familiaridade tecnológica, justificando fonte mínima de 14px, targets de toque generosos e labels descritivos.
- A navegação para outras telas (CarrinhoScreen, CheckoutScreen) NÃO faz parte do escopo desta tela — a ProdutoScreen adiciona ao carrinho e permanece na mesma tela, exibindo feedback de confirmação.
