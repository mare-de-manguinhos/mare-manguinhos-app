import { create } from 'zustand';
import { PedidoStore, DadosCheckout } from '../types';
import { pedidoService } from '../services/pedidoService';
import { useCarrinhoStore } from './carrinhoStore';

export const usePedidoStore = create<PedidoStore>((set) => ({
  pedidoAtivo: null,
  historico: [],
  loading: false,

  fazerPedido: async (checkout: DadosCheckout) => {
    set({ loading: true });
    try {
      const pedido = await pedidoService.criar(checkout);
      set({ pedidoAtivo: pedido });
      useCarrinhoStore.getState().limpar();
    } finally {
      set({ loading: false });
    }
  },

  atualizarStatus: async (pedidoId: string) => {
    set({ loading: true });
    try {
      const pedido = await pedidoService.buscarStatus(pedidoId);
      set({ pedidoAtivo: pedido });
    } finally {
      set({ loading: false });
    }
  },

  listarHistorico: async () => {
    set({ loading: true });
    try {
      const data = await pedidoService.listarHistorico();
      set({ historico: data.pedidos });
    } finally {
      set({ loading: false });
    }
  },

  limpar: () => set({ pedidoAtivo: null, historico: [] }),
}));
