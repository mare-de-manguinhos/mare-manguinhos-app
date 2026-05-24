# Tasks: Módulo de Pedidos

- [ ] **Fase 1: Infraestrutura e Componentes**
  - [ ] Atualizar interface `OceanHeaderProps` para suportar `showBackButton` e `onBackPress`.
  - [ ] Implementar botão de retorno condicional no layout do `OceanHeader`.
  - [ ] Alterar assinatura do `StepIndicator` de `1 | 2` para `number`.
  - [ ] Validar renderização do divisor flexível do `StepIndicator` para 4 passos.

- [ ] **Fase 2: Tela de Histórico (`HistoricoScreen`)**
  - [ ] Criar estrutura base com `OceanHeader`.
  - [ ] Implementar chamada do service `pedidoService.listarHistorico()` com tratamento de loading.
  - [ ] Criar o componente visual de Card de Pedido no padrão NativeWind.
  - [ ] Adicionar funcionalidade `RefreshControl` para pull-to-refresh.
  - [ ] Configurar navegação ao clicar no card enviando o `pedidoId`.

- [ ] **Fase 3: Tela de Acompanhamento (`AcompanhamentoScreen`)**
  - [ ] Capturar parâmetro `pedidoId` via hook `useRoute`.
  - [ ] Implementar busca de dados via `pedidoService.buscarStatus(pedidoId)`.
  - [ ] Mapear string de status da API (`confirmado`, `em_preparo`, `a_caminho`, `entregue`) para o índice correto do indicador de passos.
  - [ ] Adicionar container de exibição do Pescador responsável e botão de integração com WhatsApp.
  - [ ] Adicionar tratamento visual para o estado `cancelado`.