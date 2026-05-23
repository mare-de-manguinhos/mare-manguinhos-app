# Feature Specification: Vitrine Home Screen

**Feature Branch**: `003-vitrine-home-screen`  
**Created**: 2026-05-23  
**Status**: Draft  
**Input**: User description: "Quero a especificação para implementar a VitrineScreen do aplicativo. Você deve seguir estritamente o modelo de dados e consulta de endpoints propostos para esta tela."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visualizar Vitrine Completa (Priority: P1)

O usuário abre o aplicativo e é recebido pela VitrineScreen, a tela inicial do Maré de Manguinhos. Uma única chamada carrega o banner promocional, a lista de pescadores, as categorias e os produtos disponíveis. O usuário tem uma visão geral de tudo o que está sendo vendido.

**Why this priority**: Esta é a tela de entrada do app, a primeira impressão. A vitrine é o coração da experiência de delivery — sem ela o app não tem propósito.

**Independent Test**: A vitrine pode ser renderizada com dados mockados (banner, pescadores, categorias e produtos) em isolamento total — sem dependência de API real ou autenticação.

**Acceptance Scenarios**:

1. **Given** o usuário está autenticado e acessa a vitrine, **When** a tela carrega, **Then** todos os quatro blocos da vitrine são exibidos em ordem: barra de busca no topo, banner promocional, seção "Nossos Pescadores" (scroll horizontal), filtros de categoria, e seção "Disponível agora" (cards em grid 2 colunas).
2. **Given** a vitrine está carregando, **When** a requisição `GET /api/app/vitrine` está em andamento, **Then** um indicador visual de carregamento é exibido (skeleton loader ou spinner) no lugar do conteúdo.
3. **Given** a requisição da vitrine falha, **When** o erro é recebido, **Then** uma mensagem amigável é exibida com opção de "Tentar novamente" que reexecuta a chamada.
4. **Given** a vitrine é carregada com sucesso, **When** o usuário rola a tela, **Then** todos os blocos são scrolláveis verticalmente sem sobreposição ou quebras de layout.
5. **Given** a vitrine está visível, **When** o usuário puxa a tela para baixo (pull-to-refresh), **Then** os dados são recarregados via `GET /api/app/vitrine`.

---

### User Story 2 — Filtrar Produtos por Pescador e Categoria (Priority: P2)

O usuário pode filtrar os produtos exibidos na vitrine de duas formas: clicando em um pescador na seção "Nossos Pescadores" (scroll horizontal) ou selecionando uma categoria (Todos, Peixes, Crustáceos). Ao aplicar um filtro, apenas os produtos correspondentes são mostrados na seção "Disponível agora".

**Why this priority**: A filtragem é essencial para que o usuário encontre rapidamente o que deseja comprar. Sem filtros, o usuário precisaria rolar todos os produtos, o que é inviável em um estoque grande.

**Independent Test**: A filtragem pode ser testada com dados mockados — ao tocar em um pescador ou categoria, a lista de produtos se atualiza instantaneamente sem chamada de rede adicional.

**Acceptance Scenarios**:

1. **Given** a vitrine exibe múltiplos pescadores no scroll horizontal, **When** o usuário toca em "Sr. Antônio", **Then** a seção "Disponível agora" filtra para mostrar apenas os produtos do Sr. Antônio, e o card do pescador selecionado fica visualmente destacado (borda/opacidade).
2. **Given** a vitrine exibe os filtros de categoria (Todos, Peixes, Crustáceos), **When** o usuário toca em "Crustáceos", **Then** apenas produtos da categoria crustáceo são exibidos, e o filtro ativo fica destacado visualmente.
3. **Given** o usuário aplicou um filtro de pescador, **When** ele toca em "Todos" na categoria, **Then** o filtro de categoria é resetado mas o filtro de pescador permanece ativo (filtros são combináveis).
4. **Given** o usuário aplicou o filtro "Sr. Antônio", **When** ele toca novamente no mesmo pescador, **Then** o filtro é removido e todos os produtos são exibidos novamente (toggle).
5. **Given** um filtro está ativo e não há produtos correspondentes, **When** a lista é exibida, **Then** uma mensagem "Nenhum produto encontrado para este filtro" é exibida na seção de produtos.

---

### User Story 3 — Buscar Produtos por Texto (Priority: P2)

O usuário digita um termo de busca na barra de pesquisa no topo da vitrine. Conforme digita, o app realiza busca local entre os produtos já carregados ou faz uma chamada ao endpoint `GET /api/app/produtos?busca=...`.

**Why this priority**: A busca textual é a forma mais direta de encontrar um produto específico, especialmente para usuários que sabem exatamente o que querem (ex: "camarão", "robalo").

**Independent Test**: A busca pode ser testada com dados mockados — ao digitar na barra, os resultados são filtrados localmente; o endpoint remoto é preparado para integração futura.

**Acceptance Scenarios**:

1. **Given** a vitrine está carregada, **When** o usuário toca na barra de busca, **Then** o teclado é exibido e o placeholder "Buscar peixes, crustáceos..." fica visível.
2. **Given** o usuário digita "camarão" na busca, **When** a digitação termina (debounce de 300ms), **Then** os produtos são filtrados para exibir apenas aqueles cujo nome contém "camarão" (case-insensitive).
3. **Given** a busca retorna zero resultados, **When** a lista vazia é exibida, **Then** uma mensagem textual "Nenhum resultado para \"camarão\"" com sugestão de ajustar os termos aparece.
4. **Given** o usuário digitou na busca, **When** ele toca no ícone "X" dentro do campo de busca, **Then** o texto é limpo e todos os produtos são exibidos novamente.

---

### User Story 4 — Navegar para Detalhes do Produto (Priority: P2)

O usuário toca em um card de produto na seção "Disponível agora" e é direcionado para a ProdutoScreen, onde poderá ver detalhes e adicionar ao carrinho.

**Why this priority**: A navegação para detalhes do produto é o próximo passo lógico no fluxo de compra. O card de produto precisa fornecer informação suficiente para o usuário decidir se quer ver mais.

**Independent Test**: A navegação pode ser testada com um toque em qualquer card — o app deve redirecionar para a ProdutoScreen (placeholder existente) com o `id` do produto como parâmetro de navegação.

**Acceptance Scenarios**:

1. **Given** a vitrine exibe produtos, **When** o usuário toca em um card de produto, **Then** o app navega para a tela ProdutoScreen passando o `id` do produto como parâmetro de rota.
2. **Given** o usuário toca em um card, **When** a navegação ocorre, **Then** o card exibe feedback visual de pressão (ativa opacidade/sutil escala) antes da transição.

---

### Edge Cases

- O que acontece quando não há banner disponível? → A seção de banner é ocultada, e o conteúdo seguinte (pescadores) começa do topo da tela.
- O que acontece quando não há pescadores ativos? → A seção "Nossos Pescadores" exibe uma mensagem "Nenhum pescador disponível no momento" e o filtro por pescador não está disponível.
- O que acontece quando não há produtos disponíveis? → A seção "Disponível agora" exibe "Nenhum produto disponível no momento. Volte mais tarde!" com um ícone ilustrativo.
- O que acontece quando o usuário digita caracteres especiais ou muito curtos na busca (ex: "ab")? → A busca ignora termos com menos de 2 caracteres; nenhum filtro é aplicado.
- O que acontece quando a imagem de um produto ou pescador falha ao carregar? → Uma imagem placeholder (ícone genérico de peixe/pessoa) é exibida no lugar.
- O que acontece quando o token JWT expira durante o uso da vitrine? → O usuário é redirecionado para a tela de login (fluxo gerenciado pelo interceptador de navegação, não pela tela).
- O que acontece se o usuário rapidamente alterna entre filtros? → A transição dos produtos é suave; o último filtro aplicado é o vigente, sem race conditions visuais.

---

## Requirements *(mandatory)*

### Functional Requirements

**Estrutura Geral:**

- **FR-001**: A VitrineScreen DEVE ser composta por 5 seções em ordem vertical: barra de busca, banner promocional, "Nossos Pescadores", filtros de categoria, "Disponível agora".
- **FR-002**: A VitrineScreen DEVE consumir um único ponto de integração (service/hook) que realiza a chamada `GET /api/app/vitrine` e retorna os dados mockados enquanto o backend não estiver disponível.
- **FR-003**: Durante o carregamento inicial, a VitrineScreen DEVE exibir um skeleton loader ou spinner centralizado.
- **FR-004**: Em caso de falha na requisição, a VitrineScreen DEVE exibir uma mensagem de erro amigável e um botão "Tentar novamente".
- **FR-005**: A VitrineScreen DEVE suportar pull-to-refresh para recarregar todos os dados.
- **FR-006**: Todos os blocos DEVEM estar contidos em um container com rolagem vertical para garantir scroll em qualquer dispositivo.

**Barra de Busca:**

- **FR-007**: A barra de busca DEVE ser exibida no topo da tela com placeholder "Buscar peixes, crustáceos...".
- **FR-008**: A busca DEVE aplicar debounce de 300ms para filtrar produtos localmente (filtro no array de produtos já carregados) e também DEVE expor preparação para chamar `GET /api/app/produtos?busca=...` quando o backend estiver pronto.
- **FR-009**: A barra de busca DEVE exibir um ícone de "X" para limpar o texto quando houver conteúdo digitado.
- **FR-010**: A busca DEVE ignorar termos com menos de 2 caracteres.
- **FR-011**: Quando a busca retorna zero resultados, uma mensagem descritiva "Nenhum resultado para \"[termo]\"" DEVE ser exibida com sugestão de ajustar o termo.

**Banner Promocional:**

- **FR-012**: O banner DEVE exibir o `titulo`, `subtitulo` e `descricao` conforme o modelo do endpoint, com a `imagem` como fundo do banner.
- **FR-013**: O banner DEVE ocupar a largura total da tela com altura proporcional (ex: ratio 16:9 ou altura fixa de ~180px) e cantos arredondados nas bordas inferiores.
- **FR-014**: Se o banner não for retornado pela API (null/empty), a seção DEVE ser completamente ocultada.

**Seção "Nossos Pescadores":**

- **FR-015**: A seção DEVE exibir um título "Nossos Pescadores" seguido de um scroll horizontal com foto circular e nome de cada pescador.
- **FR-016**: Ao tocar em um pescador, os produtos DEVEM ser filtrados para mostrar apenas os daquele pescador (filtro local sobre dados já carregados).
- **FR-017**: O pescador selecionado DEVE ter destaque visual (ex: borda colorida na foto) em relação aos não selecionados.
- **FR-018**: Tocar novamente no mesmo pescador DEVE remover o filtro.
- **FR-019**: Se a foto do pescador falhar ao carregar, um avatar placeholder com a inicial do nome DEVE ser exibido.
- **FR-020**: Se a lista de pescadores estiver vazia, a seção DEVE exibir "Nenhum pescador disponível no momento" e ocultar a opção de filtro.

**Filtros de Categoria:**

- **FR-021**: Os filtros DEVEM ser exibidos como chips horizontais roláveis com as opções: "Todos", "Peixes", "Crustáceos".
- **FR-022**: O filtro ativo DEVE ter destaque visual (cor primária de fundo com texto branco); os inativos DEVEM ter fundo neutro.
- **FR-023**: Os filtros de categoria e pescador DEVEM ser combináveis (ex: selecionar "Sr. Antônio" + "Peixes" mostra apenas peixes do Sr. Antônio).

**Seção "Disponível Agora":**

- **FR-024**: A seção DEVE exibir o título "Disponível agora" seguido de cards de produto em grid de 2 colunas.
- **FR-025**: Cada card DEVE exibir: foto do produto (ocupando topo do card), nome da espécie, preço por kg, peso disponível, badges do produto, e nome do pescador.
- **FR-026**: Os badges DEVEM ser exibidos como chips coloridos no canto superior do card (ex: "Hoje" em verde, "Premium" em dourado, "Favorito" em laranja).
- **FR-027**: O card DEVE ter cantos arredondados, sombra suave e ao ser tocado navega para ProdutoScreen com o `id` do produto.
- **FR-028**: O card DEVE ter no mínimo 120px de altura e largura responsiva (50% da largura disponível menos espaçamento).
- **FR-029**: Se não houver produtos, a seção DEVE exibir "Nenhum produto disponível no momento. Volte mais tarde!" com ícone ilustrativo.
- **FR-030**: Se a foto do produto falhar ao carregar, uma imagem placeholder de peixe DEVE ser exibida.

**Dados Mockados:**

- **FR-031**: Enquanto o backend não estiver disponível, a VitrineScreen DEVE utilizar dados mockados locais que seguem EXATAMENTE o mesmo modelo de dados definido para o endpoint `GET /api/app/vitrine`.
- **FR-032**: A troca do mock para a API real DEVE ser feita alterando-se um único arquivo/service, sem modificar a tela ou seus componentes.

**Padrões Visuais:**

- **FR-033**: A VitrineScreen DEVE utilizar a paleta de cores do Maré de Manguinhos conforme definido na especificação de Auth Screens, com destaque para: fundo #FDF6EC (Areia Clara), cards #FAFCFD (Espuma), botões primários #1A5F7A (Azul Mar), badges #F2A23A (Laranja Solar).
- **FR-034**: Elementos interativos (cards, botões, chips) DEVEM ter cantos arredondados (borderRadius 12-16px) e sombra suave para criar profundidade.
- **FR-035**: A tela DEVE priorizar tamanhos de texto e toque adequados para usuários idosos: fonte mínima de 14px, targets de toque mínimos de 44x44px.

**Acessibilidade:**

- **FR-036**: Todos os elementos interativos DEVEM possuir rótulos acessíveis (aria-label/accessibilityLabel).
- **FR-037**: Cards de produto e pescador DEVEM ter feedback visual de toque (ex: redução de opacidade ou escala ao pressionar).

---

### Key Entities *(include if feature involves data)*

- **VitrineData**: Estrutura que agrupa todos os dados da home: `{ banner?, pescadores[], categorias[], produtos[] }`. Retornada pelo endpoint `GET /api/app/vitrine`.
- **Banner**: Item promocional com `titulo`, `subtitulo`, `descricao`, `imagem`.
- **Pescador**: Vendedor de pescado com `id`, `nome`, `foto`. Usado para filtragem de produtos e exibição no scroll horizontal.
- **ProdutoResumo**: Item de produto na vitrine com `id`, `especie`, `foto`, `precoPorKg`, `pesoDisponivel`, `badges[]`, `pescador: { id, nome }`. É uma versão resumida do produto completo.
- **Categoria**: Tipo de produto com `id` (todos, peixe, crustaceo) e `nome` (Todos, Peixes, Crustáceos).
- **FiltroAtivo**: Estado combinado de filtro de pescador (`pescadorId?`) e filtro de categoria (`categoriaId?`) utilizado para filtrar a lista de produtos localmente.
- **BuscaTermo**: Texto digitado na barra de busca para filtragem local de produtos por nome.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A vitrine carrega todos os blocos (busca, banner, pescadores, categorias, produtos) em uma única chamada de dados — nenhum bloco faz requisição separada.
- **SC-002**: O usuário consegue identificar visualmente todos os blocos da vitrine em menos de 5 segundos após o carregamento completo.
- **SC-003**: A filtragem por pescador ou categoria reflete na lista de produtos em menos de 200ms após o toque (filtragem local).
- **SC-004**: Um toque em qualquer card de produto navega para ProdutoScreen com o `id` correto do produto em 100% dos casos.
- **SC-005**: A tela é completamente funcional e legível em dispositivos com largura entre 320px e 430px, sem scroll horizontal indesejado.
- **SC-006**: Todos os targets de toque (cards, chips, botões) possuem no mínimo 44x44px, verificável por inspeção visual/ferramenta de acessibilidade.
- **SC-007**: Dados mockados seguem exatamente o esquema do endpoint `GET /api/app/vitrine` — qualquer alteração no mock reflete na tela sem modificação dos componentes.
- **SC-008**: O placeholder de imagem (produto/pescador) é exibido corretamente quando a URL da imagem falha, sem quebras de layout.

---

## Assumptions

- O endpoint `GET /api/app/vitrine` retorna todos os dados em uma única chamada; não há paginação na vitrine inicial.
- Os dados de pescadores, categorias e produtos são carregados simultaneamente; filtros operam sobre o conjunto já carregado (filtragem local), sem nova chamada ao backend.
- A busca textual filtra localmente sobre `produtos[].especie` no MVP; busca via endpoint remoto é preparada mas só será ativada quando o backend do endpoint `GET /api/app/produtos?busca=` estiver pronto.
- Quando o backend for integrado, a troca será feita substituindo o arquivo de dados mockados por um service hook que chama a API — a tela e componentes permanecem inalterados.
- A VitrineScreen já está integrada ao BottomTabNavigator como primeira aba (ícone vitrine), conforme plano de navegação anterior (spec 002).
- A navegação para ProdutoScreen deve usar o `id` do produto como parâmetro, conforme contrato de navegação existente.
- A paleta de cores, fontes e tokens de design seguem o que foi estabelecido na especificação de Auth Screens (spec 001).
- O público-alvo inclui usuários com pouca familiaridade tecnológica, justificando fonte de no mínimo 14px e targets de toque generosos.
