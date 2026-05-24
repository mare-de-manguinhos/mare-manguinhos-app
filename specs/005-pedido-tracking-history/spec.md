# Spec: Módulo de Pedidos - Acompanhamento e Histórico

## 1. Contexto e Objetivo do Produto
Este módulo gerencia a experiência pós-compra do cliente no ecossistema SaaS Maré de Manguinhos. O objetivo é fornecer transparência e rastreabilidade total desde o momento em que o pedido é recebido na plataforma até a entrega do peixe ou marisco fresco pelo pescador local, além de permitir a consulta de transações passadas.

---

## 2. Fluxo do Usuário e Navegação
- **Entrada via Histórico:** O usuário acessa a aba "Pedidos" no menu inferior (`BottomNavMenu`), renderizando a tela `HistoricoScreen`.
- **Navegação para Detalhes:** Ao selecionar qualquer cartão de pedido ativo ou concluído no Histórico, o usuário é direcionado para a tela `AcompanhamentoScreen` passando o parâmetro `pedidoId`.
- **Retorno:** Ambas as telas utilizam o comportamento padrão de navegação do `PedidosStack`, permitindo retorno seguro à tela anterior através do botão nativo do cabeçalho.

---

## 3. Especificação da Interface (UI Component Driven)

### 3.1. Tela de Histórico de Pedidos (`HistoricoScreen.tsx`)

#### Cabeçalho
- Utiliza o componente compartilhado `OceanHeader` com o título fixo `"Meus Pedidos"`. Não exibe botão de voltar quando acessado diretamente pelo menu de abas principal.

#### Estados da Tela
1. **Estado de Carregamento (Loading State):** Exibe um indicador de progresso centralizado (`ActivityIndicator`) com a cor primária do projeto (`#0284c7`) enquanto os dados são recuperados pelo método `pedidoService.getHistoricoPedidos()`.
2. **Estado Vazio (Empty State):** Se a lista retornar vazia, exibe de forma centralizada:
   - Ícone `ShoppingBag` da biblioteca `lucide-react-native` estilizado na cor azul-oceano (`text-sky-600`).
   - Texto de título: `"Nenhum pedido por aqui"`.
   - Subtexto explicativo: `"Descubra os peixes e mariscos mais frescos direto de Manguinhos."`
3. **Lista de Pedidos (Default State):** Implementa um `FlatList` com rolagem vertical otimizada e suporte a `pull-to-refresh` acionando o estado `refreshing`.

#### Componente de Cartão do Pedido (`PedidoItemCard`)
Cada item da lista deve ser renderizado em um container de cantos arredondados (`rounded-2xl bg-white border border-slate-100 p-4 mb-3`), contendo:
- **Linha Superior:** Nome do Pescador (alinhado à esquerda) e uma Badge de Status com bordas e cores semânticas (alinhada à direita).
- **Linha Central:** Código identificador do pedido formatado (ex: `Ref: #MANG-8273`).
- **Linha Inferior:** Data da transação acompanhada pelo ícone `Calendar` (`text-slate-400`) e o valor total formatado em Real (`R$ XX,XX`) destacado em negrito (`font-bold text-slate-900`).
- **Indicador de Ação:** Ícone `ChevronRight` na extremidade direita sinalizando que o elemento é clicável.

---

### 3.2. Tela de Acompanhamento do Pedido (`AcompanhamentoScreen.tsx`)

#### Cabeçalho
- Utiliza o componente `OceanHeader` com o título dinâmico contendo o ID simplificado do pedido (ex: `"Pedido #8273"`). O parâmetro `showBackButton` deve ser explicitamente definido como `true`, com a ação `onBackPress` mapeando `navigation.goBack()`.

#### Painel de Progresso da Maré (`StepIndicator`)
Elemento central da tela focado no modelo Spec-Driven que traduz o status logístico do pescador:
- Deve consumir o componente `StepIndicator` passando o índice numérico correspondente ao status atual obtido da API.
- **Mapeamento de Passos:**
  1. `RECEBIDO` ➔ Pedido registrado e aguardando confirmação.
  2. `CONFIRMADO` ➔ O pescador aceitou o pedido e está separando os produtos no porto/barco.
  3. `A_CAMINHO` ou `PRONTO_PARA_RETIRADA` ➔ O produto saiu para entrega física ou está aguardando retirada no ponto combinado em Manguinhos.
  4. `ENTREGUE` ➔ Transação concluída com sucesso.

#### Bloco do Pescador Responsável
- Container destacado contendo o nome do pescador e a comunidade/porto de origem (ex: *"Porto de Manguinhos"* ou *"Associação de Pescadores"*).
- **Ação de Contato Direto:** Inclui o componente `AppButton` com variante `outline` escrito `"Contato"`. Ao ser acionado, dispara o redirecionamento via `Linking.openURL` para o WhatsApp do pescador responsável utilizando uma mensagem pré-formatada com as informações do pedido.

#### Resumo de Produtos da Maré
- Listagem detalhada de cada item pertencente ao pedido.
- Exibe o ícone descritivo `Fish` (`text-sky-600`), o nome do produto (ex: *"Filé de Peroá"*, *"Camarão Sete Barbas"*), a quantidade adquirida (com suporte a exibição fracionada para representar quilogramas) e o preço calculado por item.

#### Resumo Financeiro da Compra
Exibição limpa das divisões de custo utilizando tipografia e espaçamento alinhados com o design system global:
- Subtotal dos pescados.
- Taxa de entrega calculada pelo frete de barcos/motoboys da comunidade.
- **Valor Total Pago:** Destacado em tamanho maior utilizando a cor de destaque da identidade do projeto (`text-sky-700 font-bold`).

---

## 4. Regras de Negócio e Casos de Borda
- **Status de Cancelamento:** Caso o pedido retorne com o status `CANCELADO`, a tela de Acompanhamento deve substituir o componente `StepIndicator` por uma mensagem de alerta contendo o motivo do cancelamento e desativar o botão de contato.
- **Formatação de Dados:** Valores monetários devem obrigatoriamente passar por tratamento de localização brasileira (`pt-BR`). As quantidades de produtos pesados devem exibir a unidade de medida adequada baseada no cadastro do produto obtido do backend.