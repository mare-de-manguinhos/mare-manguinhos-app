# Plan: Módulo de Pedidos - Acompanhamento e Histórico

## 1. Escopo de Alterações
- **Componentes Globais:**
  - `src/components/shared/OceanHeader.tsx` -> Adicionar suporte a botão de voltar.
  - `src/components/ui/StepIndicator.tsx` -> Flexibilizar tipos de passos para aceitar até 4 etapas.
- **Novas Telas:**
  - `src/screens/pedido/HistoricoScreen.tsx`
  - `src/screens/pedido/AcompanhamentoScreen.tsx`

## 2. Ordem de Implementação
1. Ajuste e testes de tipagem das propriedades dos componentes compartilhados (`OceanHeader` e `StepIndicator`).
2. Construção da tela `HistoricoScreen` acoplada ao método `pedidoService.listarHistorico()`.
3. Construção da tela `AcompanhamentoScreen` acoplada ao método `pedidoService.buscarStatus()`.
4. Vinculação das rotas e navegação no arquivo de rotas do módulo de pedidos.